import {
  homes,
  type AreaId,
  type Feel,
  type Home,
  type Roommate,
} from "./demo-data";

export type Preferences = {
  sentence: string;
  labels: string[];
  budget: number;
  transitWalk: number;
  area: AreaId | "all";
  feel: Feel | "any";
  stayWeeks: number | null;
};

export const startingPreferences: Preferences = {
  sentence: "Near BU, close to the T, and a place that feels safe",
  labels: ["Near BU", "Near the T", "Safety question"],
  budget: 2100,
  transitWalk: 10,
  area: "all",
  feel: "any",
  stayWeeks: null,
};

/** The prototype uses explicit rules, so a typed sentence becomes editable labels. */
export function interpretSentence(sentence: string): Partial<Preferences> {
  const lower = sentence.toLowerCase();
  const labels: string[] = [];
  if (/\bbu\b|campus|university/.test(lower)) labels.push("Near BU");
  if (/\b(t|mbta|transit|train|subway)\b/.test(lower))
    labels.push("Near the T");
  if (/safe|safety|crime/.test(lower)) labels.push("Safety question");
  if (/quiet|calm/.test(lower)) labels.push("Quieter area");
  if (/social|lively|cafes|nightlife/.test(lower)) labels.push("Social area");
  if (/paint|condition|maintenan/.test(lower))
    labels.push("Ask about condition");
  const dollars = lower.match(/\$\s?(\d[\d,]*)/);
  const budget = dollars ? Number(dollars[1].replaceAll(",", "")) : undefined;
  const weeks = lower.match(/(\d{1,2})\s*weeks?/);
  return {
    labels: labels.length ? labels : ["Tell us what matters"],
    ...(budget && budget >= 500 && budget <= 10000 ? { budget } : {}),
    ...(weeks ? { stayWeeks: Number(weeks[1]) } : {}),
    feel: /quiet|calm/.test(lower)
      ? "quiet"
      : /social|lively|cafes|nightlife/.test(lower)
        ? "social"
        : "any",
  };
}

/** Only search controls hide pins. Evidence never silently removes a home. */
export function filterHomes(preferences: Preferences): Home[] {
  return homes.filter(
    (home) =>
      home.rent <= preferences.budget &&
      home.transitWalk <= preferences.transitWalk &&
      (preferences.area === "all" || home.area === preferences.area) &&
      (preferences.feel === "any" || home.feel === preferences.feel),
  );
}

export type FilterSuggestion = {
  label: string;
  count: number;
  tradeoff: string;
  update: Partial<Preferences>;
};

/**
 * Preview a ONE-control change before it is applied. Trying each control and
 * counting actual results avoids offering a useless transit fix for a budget
 * problem. No database is shrunk or deleted.
 */
export function suggestSingleChange(
  preferences: Preferences,
): FilterSuggestion | null {
  const candidates: Omit<FilterSuggestion, "count">[] = [];
  if (preferences.area !== "all")
    candidates.push({
      label: "Look across all areas",
      tradeoff: "The search covers more neighborhoods.",
      update: { area: "all" },
    });
  if (preferences.feel !== "any")
    candidates.push({
      label: "Include both area styles",
      tradeoff: "Some areas may not match your preferred feel.",
      update: { feel: "any" },
    });
  for (let minutes = preferences.transitWalk + 1; minutes <= 20; minutes++) {
    candidates.push({
      label: `Allow up to ${minutes} min to the T`,
      tradeoff: "The walk to transit may be longer.",
      update: { transitWalk: minutes },
    });
  }
  for (const rent of [
    ...new Set(
      homes
        .map((home) => home.rent)
        .filter((rent) => rent > preferences.budget),
    ),
  ].sort((a, b) => a - b)) {
    candidates.push({
      label: `Raise rent cap to ${money(rent)}`,
      tradeoff: "Monthly rent may be higher; check the full cost.",
      update: { budget: rent },
    });
  }
  const useful = candidates
    .map((candidate) => ({
      ...candidate,
      count: filterHomes({ ...preferences, ...candidate.update }).length,
    }))
    .find((candidate) => candidate.count > 0);
  return useful || null;
}

export function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** This is an estimate for discussion, not a lease quote. */
export function estimatedStayTotal(home: Home, weeks: number): number {
  return Math.ceil(weeks / 4.33) * home.rent + home.fees;
}

export type RoommateSurvey = {
  maxShare: number;
  schedule: "early" | "late" | "regular" | "flexible";
  habits: "quiet" | "social" | "tidy" | "flexible";
};

/** An explainable demo match: reasons and differences stay visible. */
export function roommateFit(
  person: Roommate,
  survey: RoommateSurvey,
  area: AreaId | "all",
) {
  const reasons: string[] = [];
  const differences: string[] = [];
  if (
    survey.maxShare >= person.budgetMin &&
    survey.maxShare <= person.budgetMax
  )
    reasons.push("Budget overlap");
  else differences.push("Budget ranges differ");
  if (area === "all" || person.areaIds.includes(area))
    reasons.push("Area overlap");
  else differences.push("Different preferred area");
  if (survey.schedule === "flexible" || survey.schedule === person.schedule)
    reasons.push("Schedule could work");
  else differences.push("Different daily schedules");
  if (survey.habits === "flexible" || survey.habits === person.habits)
    reasons.push("Living habits could work");
  else differences.push("Different living habits");
  return { reasons, differences, score: reasons.length };
}
