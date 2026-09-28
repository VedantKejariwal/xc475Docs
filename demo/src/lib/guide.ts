import { areas, homes } from "./demo-data";
import { suggestSingleChange, type Preferences } from "./logic";

export type Screen = "explore" | "shortlist" | "compare" | "roommates";
export type GuideAction =
  | "none"
  | "explore"
  | "compare"
  | "roommates"
  | "shortlist"
  | "widen"
  | "condition"
  | "neighborhoods";
export type GuideContext = {
  screen: Screen;
  selectedHomeId: string | null;
  visibleHomeIds: string[];
  shortlistCount: number;
  compareCount: number;
  roommateOptIn: boolean;
  preferences: Preferences;
};

export function screenTip(context: GuideContext): string {
  if (context.screen === "roommates")
    return context.roommateOptIn
      ? "These sample matches show shared preferences and differences. You decide whether to connect."
      : "Roommate profiles stay hidden until you opt in.";
  if (context.screen === "compare")
    return "Look across both columns. A blank or unknown field is a question to check, not a score against a home.";
  if (context.screen === "shortlist")
    return "Save promising homes, then compare two side by side.";
  if (context.visibleHomeIds.length === 0)
    return "The map is empty. I can show which one filter to relax and what that would change.";
  if (context.selectedHomeId)
    return "I can explain this home's fit, its condition clue, and what remains unknown.";
  return "Try a sentence about what matters, choose an area, or tap a home dot. I can guide the next step.";
}

/**
 * Local responses keep the whole demo usable without an API key.
 * They are rules over the same state that renders the screen, not a hidden model.
 */
export function fallbackGuide(
  message: string,
  context: GuideContext,
): { text: string; action: GuideAction } {
  const ask = message.toLowerCase();
  const chosen = homes.find((home) => home.id === context.selectedHomeId);
  if (/roommate|housemate/.test(ask))
    return {
      text: "Let's open roommate matching. It is opt-in, uses only stated preferences, and shows why each sample profile appeared.",
      action: "roommates",
    };
  if (/compare|difference|side.by.side/.test(ask))
    return {
      text:
        context.compareCount < 2
          ? "Pick two homes using their Compare buttons, then I can show price, commute, terms, and open questions side by side."
          : "Opening your A/B comparison. You choose which tradeoffs matter; ABUJA does not declare a winner.",
      action: "compare",
    };
  if (/shortlist|saved|favorite/.test(ask))
    return {
      text: "Opening your shortlist. Saved homes are kept in this browser session for the demo.",
      action: "shortlist",
    };
  if (/empty|zero|no homes|more results|widen|relax/.test(ask)) {
    const suggestion = suggestSingleChange(context.preferences);
    return suggestion
      ? {
          text: `Your current filters show ${context.visibleHomeIds.length} sample homes. Preview “${suggestion.label}”: ${suggestion.count} sample home${suggestion.count === 1 ? "" : "s"} would appear. ${suggestion.tradeoff} Nothing changes until you apply it.`,
          action: "widen",
        }
      : {
          text: "No single filter change reveals a home in this small demo set. Try two changes or keep your needs and check a broader live listing source.",
          action: "widen",
        };
  }
  if (/quiet|social|neighborhood|area|vibe/.test(ask))
    return {
      text: `The sample map offers ${areas.map((area) => area.name).join(", ")}. Transit stops and nearby places are map context; whether an area feels quiet or social needs an in-person check.`,
      action: "neighborhoods",
    };
  if (/paint|repair|maintenance|condition|renov/.test(ask))
    return {
      text: chosen
        ? `${chosen.name}: ${chosen.maintenance} A useful next question is: what work was done, when, and can I see current photos or visit?`
        : "Tap a home dot to see a condition clue beside its source date and unknowns. A missing record does not prove a home is well maintained.",
      action: "condition",
    };
  if (/cost|fee|lease|summer|weeks|short.stay/.test(ask))
    return {
      text: chosen
        ? `${chosen.name} shows a ${chosen.minLeaseWeeks}-week minimum in the sample and ${chosen.rent.toLocaleString("en-US")} dollars monthly rent plus listed fees. Verify exact dates, deposits, and terms on the live listing.`
        : "Enter your stay length, then open a home to compare it with the sample lease term and rough total cost.",
      action: "none",
    };
  if (/show|map|explore|find/.test(ask))
    return {
      text: "Opening the focused map. Choose an area and tap a home dot; the pins are examples, not live vacancies.",
      action: "explore",
    };
  return {
    text: chosen
      ? `${chosen.name} fits some of your stated needs. Its main upside is ${chosen.highlight.toLowerCase()}; the tradeoff is ${chosen.tradeoff.toLowerCase()}. Open its evidence to see dates and unknowns before deciding.`
      : screenTip(context),
    action: "none",
  };
}
