import { NextResponse } from "next/server";
import { fallbackGuide, type GuideContext } from "@/lib/guide";
import { homes } from "@/lib/demo-data";

/**
 * The optional model request lives on the server, so OPENAI_API_KEY never reaches
 * the browser. Without a key (or if the service fails), local demo rules answer.
 */
export async function POST(request: Request) {
  let body: { message?: unknown; context?: GuideContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (
    typeof body.message !== "string" ||
    body.message.length > 700 ||
    !body.context
  ) {
    return NextResponse.json(
      { error: "A short message and page context are required" },
      { status: 400 },
    );
  }

  const message = body.message.trim();
  const context = body.context;
  const fallback = fallbackGuide(message, context);
  if (!process.env.OPENAI_API_KEY)
    return NextResponse.json({ ...fallback, mode: "demo rules" });

  const chosen = homes.find((home) => home.id === context.selectedHomeId);
  const visible = homes.filter((home) =>
    context.visibleHomeIds.includes(home.id),
  );
  const pageContext = {
    currentScreen: context.screen,
    editableLabels: context.preferences.labels,
    budget: context.preferences.budget,
    maximumWalkToTransitMinutes: context.preferences.transitWalk,
    stayWeeks: context.preferences.stayWeeks,
    visibleSampleHomes: visible.map((home) => ({
      name: home.name,
      rent: home.rent,
      commute: home.commute,
      transitWalk: home.transitWalk,
      highlight: home.highlight,
      tradeoff: home.tradeoff,
    })),
    selectedSampleHome: chosen
      ? {
          name: chosen.name,
          rent: chosen.rent,
          minLeaseWeeks: chosen.minLeaseWeeks,
          maintenance: chosen.maintenance,
          evidence: chosen.evidence,
        }
      : null,
    shortlistCount: context.shortlistCount,
    compareCount: context.compareCount,
    roommateOptIn: context.roommateOptIn,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        max_output_tokens: 230,
        input: [
          {
            role: "developer",
            content:
              "You are the ABUJA demo guide. Use only the supplied page context. All homes, people, prices, dates, and evidence are illustrative. Never claim live inventory, verified safety, legal conclusions, or that missing records prove a property condition. Explain the renter's next click in 2-4 plain sentences. Mention uncertainty when relevant. Never request personal data.",
          },
          {
            role: "user",
            content: `Page context: ${JSON.stringify(pageContext)}\nRenter asks: ${message}`,
          },
        ],
      }),
    });
    if (!response.ok)
      throw new Error(`Guide request failed: ${response.status}`);
    const data = await response.json();
    // Raw Responses API output can contain several items; gather text safely.
    const text = (
      data.output as
        Array<{ content?: Array<{ type?: string; text?: string }> }> | undefined
    )
      ?.flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text || "")
      .join(" ")
      .trim();
    return NextResponse.json({
      text: text || fallback.text,
      action: fallback.action,
      mode: text ? "live AI" : "demo rules",
    });
  } catch {
    // The mentor demo must still work if no network or API quota is available.
    return NextResponse.json({ ...fallback, mode: "demo rules" });
  }
}
