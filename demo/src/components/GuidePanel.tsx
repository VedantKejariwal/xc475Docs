"use client";

import { useState, type FormEvent } from "react";
import { screenTip, type GuideAction, type GuideContext } from "@/lib/guide";

type Message = { role: "guide" | "renter"; text: string };
type Props = { context: GuideContext; onAction: (action: GuideAction) => void };

export function GuidePanel({ context, onAction }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "guide",
      text: "Hi, I’m your ABUJA guide. Tell me what you need, or tap a home. I’ll explain the tradeoffs on this screen and help you decide what to check next.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("demo rules");

  async function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setDraft("");
    setMessages((items) => [...items, { role: "renter", text: question }]);
    setBusy(true);
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, context }),
      });
      if (!response.ok) throw new Error("Guide request failed");
      const result: { text: string; action: GuideAction; mode: string } =
        await response.json();
      setMessages((items) => [...items, { role: "guide", text: result.text }]);
      setMode(result.mode);
      if (result.action !== "none") onAction(result.action);
    } catch {
      setMessages((items) => [
        ...items,
        {
          role: "guide",
          text: "I lost the connection for a moment. You can still use the map and buttons, then ask me again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(draft);
  }

  return (
    <aside className="guide-panel" aria-label="ABUJA guide">
      <div className="guide-header">
        <div className="guide-avatar">✦</div>
        <div>
          <strong>ABUJA guide</strong>
          <small>Here with you on every step</small>
        </div>
        <span
          className="guide-live"
          title={
            mode === "live AI"
              ? "OpenAI is connected"
              : "Local demo responses; no API key needed"
          }
        >
          {mode === "live AI" ? "LIVE AI" : "DEMO"}
        </span>
      </div>
      <div className="guide-context">
        <span className="pulse" /> On this screen: {screenTip(context)}
      </div>
      <div className="guide-messages" aria-live="polite">
        {messages.map((item, index) => (
          <div className={`bubble ${item.role}`} key={`${item.role}-${index}`}>
            {item.text}
          </div>
        ))}
        {busy && (
          <div className="bubble guide">Thinking through this screen…</div>
        )}
      </div>
      <div className="guide-prompts">
        {[
          "What should I check?",
          context.visibleHomeIds.length === 0
            ? "Why is the map empty?"
            : "Compare two homes",
          "Find a roommate",
        ].map((prompt) => (
          <button key={prompt} onClick={() => void ask(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
      <form className="guide-form" onSubmit={submit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about this screen…"
          maxLength={700}
          aria-label="Ask the guide"
        />
        <button
          type="submit"
          disabled={!draft.trim() || busy}
          aria-label="Send message"
        >
          ↑
        </button>
      </form>
      <p className="guide-footnote">
        Demo guide reads the page state, not your whole screen. It may use live
        AI only when a server key is configured.
      </p>
    </aside>
  );
}
