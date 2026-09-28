/**
 * All addresses, prices, dates, people, and signals below are fictional demo data.
 * Keeping them in one file makes it hard to mistake a mock record for a live feed.
 */

export type AreaId = "allston" | "central" | "fenway" | "brookline";
export type Feel = "quiet" | "social";

export type Evidence = {
  title: string;
  detail: string;
  date: string;
  status: "sample" | "unknown";
};

export type Home = {
  id: string;
  name: string;
  area: AreaId;
  rent: number;
  beds: number;
  transitWalk: number;
  commute: number;
  minLeaseWeeks: number;
  fees: number;
  feel: Feel;
  mapX: number;
  mapY: number;
  highlight: string;
  tradeoff: string;
  maintenance: string;
  paintYears: number | null;
  listingClaim: string;
  evidence: Evidence[];
};

export const areas: {
  id: AreaId;
  name: string;
  feel: Feel;
  note: string;
  transit: string;
  places: string;
  x: number;
  y: number;
}[] = [
  {
    id: "allston",
    name: "Allston / West BU",
    feel: "social",
    note: "More venues in the sample map",
    transit: "Green Line B",
    places: "Cafes + groceries",
    x: 24,
    y: 43,
  },
  {
    id: "central",
    name: "Central BU",
    feel: "social",
    note: "Campus and transit close together",
    transit: "Green Line B",
    places: "Food + campus",
    x: 48,
    y: 50,
  },
  {
    id: "fenway",
    name: "Fenway / East BU",
    feel: "social",
    note: "Busy corridors, park access",
    transit: "Green Line C/D",
    places: "Parks + venues",
    x: 75,
    y: 36,
  },
  {
    id: "brookline",
    name: "Brookline edge",
    feel: "quiet",
    note: "Fewer venues in the sample map",
    transit: "Green Line C",
    places: "Parks + groceries",
    x: 60,
    y: 72,
  },
];

export const homes: Home[] = [
  {
    id: "a",
    name: "Home A · West BU",
    area: "allston",
    rent: 1950,
    beds: 2,
    transitWalk: 5,
    commute: 14,
    minLeaseWeeks: 52,
    fees: 180,
    feel: "social",
    mapX: 26,
    mapY: 48,
    highlight: "Short walk to the T",
    tradeoff: "Maintenance history needs a closer look",
    maintenance:
      "No repaint is documented in the sample record for 10 years. This does not prove today's wall condition.",
    paintYears: 10,
    listingClaim: "Recently refreshed",
    evidence: [
      {
        title: "Listing description",
        detail: "Claims the unit was recently refreshed.",
        date: "Sample listing · Sep 2026",
        status: "sample",
      },
      {
        title: "Paint record",
        detail:
          "No repaint appears in this small demo record set. Ask the landlord what was done.",
        date: "Sample record · Sep 2026",
        status: "sample",
      },
      {
        title: "Current unit condition",
        detail: "No inspection or current photos verified by ABUJA.",
        date: "Unknown",
        status: "unknown",
      },
    ],
  },
  {
    id: "b",
    name: "Home B · Central BU",
    area: "central",
    rent: 2050,
    beds: 2,
    transitWalk: 3,
    commute: 9,
    minLeaseWeeks: 52,
    fees: 120,
    feel: "social",
    mapX: 49,
    mapY: 52,
    highlight: "Closest campus commute",
    tradeoff: "Higher monthly rent",
    maintenance:
      "A recent paint entry appears in the sample data, but the unit still needs a visit.",
    paintYears: 2,
    listingClaim: "Painted two years ago",
    evidence: [
      {
        title: "Sample property entry",
        detail: "A paint entry appears in this fictional record set.",
        date: "Sample record · 2024",
        status: "sample",
      },
      {
        title: "Listing terms",
        detail: "A 12-month minimum is shown for this example.",
        date: "Sample listing · Sep 2026",
        status: "sample",
      },
      {
        title: "Current unit condition",
        detail: "Photos and an in-person visit are still needed.",
        date: "Unknown",
        status: "unknown",
      },
    ],
  },
  {
    id: "c",
    name: "Home C · Brookline edge",
    area: "brookline",
    rent: 1880,
    beds: 1,
    transitWalk: 9,
    commute: 21,
    minLeaseWeeks: 10,
    fees: 230,
    feel: "quiet",
    mapX: 61,
    mapY: 73,
    highlight: "Short-stay terms in this example",
    tradeoff: "Longer trip to BU",
    maintenance:
      "The sample has too little condition data to make a confident statement.",
    paintYears: null,
    listingClaim: "Flexible stay",
    evidence: [
      {
        title: "Sample listing terms",
        detail: "A 10-week minimum is shown for demo purposes.",
        date: "Sample listing · Sep 2026",
        status: "sample",
      },
      {
        title: "Public-record coverage",
        detail:
          "No condition record in this sample. Absence is not proof of good or bad condition.",
        date: "Unknown",
        status: "unknown",
      },
    ],
  },
  {
    id: "d",
    name: "Home D · Fenway",
    area: "fenway",
    rent: 2190,
    beds: 1,
    transitWalk: 6,
    commute: 17,
    minLeaseWeeks: 26,
    fees: 90,
    feel: "social",
    mapX: 76,
    mapY: 40,
    highlight: "Parks and transit nearby",
    tradeoff: "Above a $2,000 target",
    maintenance: "No current unit inspection is available in this demo.",
    paintYears: null,
    listingClaim: "Newly renovated",
    evidence: [
      {
        title: "Listing claim",
        detail: "The sample listing says newly renovated.",
        date: "Sample listing · Sep 2026",
        status: "sample",
      },
      {
        title: "Matching public record",
        detail:
          "No matching record in this limited sample. Work could have been cosmetic or filed differently.",
        date: "Unknown",
        status: "unknown",
      },
    ],
  },
  {
    id: "e",
    name: "Home E · Allston",
    area: "allston",
    rent: 1740,
    beds: 1,
    transitWalk: 12,
    commute: 23,
    minLeaseWeeks: 52,
    fees: 260,
    feel: "social",
    mapX: 18,
    mapY: 60,
    highlight: "Lower sample rent",
    tradeoff: "Transit is farther away",
    maintenance:
      "A sample 311-style note exists, but it does not diagnose the unit.",
    paintYears: null,
    listingClaim: "Simple, sunny apartment",
    evidence: [
      {
        title: "Sample area note",
        detail:
          "One illustrative complaint-like entry. It may not describe this unit.",
        date: "Sample record · 2025",
        status: "sample",
      },
      {
        title: "Lease and availability",
        detail: "Check exact terms on the live listing.",
        date: "Unknown",
        status: "unknown",
      },
    ],
  },
  {
    id: "f",
    name: "Home F · Brookline edge",
    area: "brookline",
    rent: 1995,
    beds: 2,
    transitWalk: 7,
    commute: 19,
    minLeaseWeeks: 16,
    fees: 140,
    feel: "quiet",
    mapX: 69,
    mapY: 80,
    highlight: "Quieter sample setting",
    tradeoff: "Short stay still needs negotiation",
    maintenance: "This sample has no recent paint information.",
    paintYears: null,
    listingClaim: "Near local shops",
    evidence: [
      {
        title: "Sample neighborhood map",
        detail:
          "Groceries and transit are mapped nearby; this does not establish how quiet it feels.",
        date: "Sample map · Sep 2026",
        status: "sample",
      },
      {
        title: "Paint record",
        detail: "Not available in this sample.",
        date: "Unknown",
        status: "unknown",
      },
    ],
  },
];

export type Roommate = {
  id: string;
  name: string;
  initials: string;
  budget: string;
  budgetMin: number;
  budgetMax: number;
  area: string;
  areaIds: AreaId[];
  schedule: "early" | "late" | "regular";
  habits: "quiet" | "social" | "tidy";
};
export const roommates: Roommate[] = [
  {
    id: "r1",
    name: "Alex · demo profile",
    initials: "A",
    budget: "$1,000–$1,350 / person",
    budgetMin: 1000,
    budgetMax: 1350,
    area: "Near BU",
    areaIds: ["allston", "central"],
    schedule: "early",
    habits: "quiet",
  },
  {
    id: "r2",
    name: "Sam · demo profile",
    initials: "S",
    budget: "$1,150–$1,500 / person",
    budgetMin: 1150,
    budgetMax: 1500,
    area: "Allston / Central",
    areaIds: ["allston", "central"],
    schedule: "late",
    habits: "social",
  },
  {
    id: "r3",
    name: "Jordan · demo profile",
    initials: "J",
    budget: "$900–$1,250 / person",
    budgetMin: 900,
    budgetMax: 1250,
    area: "Brookline edge",
    areaIds: ["brookline"],
    schedule: "regular",
    habits: "tidy",
  },
];

export const liveListingUrl = "https://offcampus.bu.edu/housing";
