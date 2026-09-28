# ABUJA mentor demo

A small, map-first Next.js prototype for feedback on the renter journey. It is a **front-end demo**, not a live rental search, safety rating, inspection system, or payment flow. Every home, roommate, price, source date, and record on screen is **fictional**. The map is an interactive sketch of the BU area rather than geographic data.

## Run it

Use Node.js 20.9 or newer.

```bash
cd demo
npm install
npm run dev
```

Open `http://localhost:3000`. No account or API key is needed. To turn on live AI wording in the guide, copy `.env.example` to `.env.local`, set `OPENAI_API_KEY`, and restart the server. Never put the key in a `NEXT_PUBLIC_` variable or commit `.env.local`. The guide still works with local rules if no key is present or the API fails.

## Walkthrough for mentors

1. Type “Near BU, close to the T, safe area, under $2,000” and click **Interpret my preferences**. The editable labels show what the sentence was understood to mean.
2. Adjust budget, walking time, stay length, or neighborhood feel. Choose a zone and tap a price pin on the map.
3. In the home panel, read **Matches → Condition clue → Everyday scenario**, then check **Evidence** for source dates and unknowns. The paint example teaches a question to ask; it does not diagnose a home.
4. Save two homes and open **Compare** for aligned left/right details. Try entering 10 weeks to see a lease-length mismatch.
5. Opt into **Roommates** and inspect reasons and differences for fictional profiles. The “interest” button stays in this browser; it sends no message.
6. Lower the budget until the map is empty. Preview one filter change before applying it. The sample count changes because filters narrow *visible results*; no fixed “100% → 10%” quota exists.
7. Keep the guide open throughout. Ask about the selected home, maintenance, the empty map, a neighborhood, comparison, or roommates. With a key configured, it uses the OpenAI Responses API for wording; navigation actions remain simple local rules.

The external handoff opens [BU's current off-campus search](https://offcampus.bu.edu/housing). It is a general search link, **not** a listing for any fictional home; there is no affiliate tracking or payment.

## Tech stack and code tour

- **Next.js 16 App Router:** pages and the optional server endpoint live in `src/app/`. The server route keeps a possible API key off the browser.
- **React 19 + TypeScript:** `useState` stores editable preferences, selected home, shortlist, comparison, and roommate opt-in. Changing state causes React to redraw the relevant parts of the page.
- **Plain CSS:** `src/app/globals.css` controls the three-column layout, map treatment, cards, typography, and mobile layout. No UI framework is required.
- **SVG sketch map:** `MapCanvas.tsx` draws roads, water, area buttons, and home pins. It supports dragging and zoom buttons without map credentials.

Read these files in this order if you are learning the logic:

1. `src/lib/demo-data.ts` declares the **types** and fictional example records. A `type` describes what fields each object must contain.
2. `src/lib/logic.ts` has small **pure functions**: text-to-label interpretation, filtering, empty-map preview, and an estimated short-stay total. A pure function returns an answer from its inputs without changing the app.
3. `src/app/page.tsx` owns the React **state** and assembles the screens. `filterHomes(preferences)` is recalculated when preferences change. Event handlers such as `chooseHome` update state after a click.
4. `src/components/MapCanvas.tsx`, `HomeDetails.tsx`, and `GuidePanel.tsx` render focused pieces of the UI from **props** passed by the page. Props are inputs to a component.
5. `src/lib/guide.ts` defines the fallback guide's screen-aware rules. `src/app/api/guide/route.ts` optionally calls the OpenAI Responses API on the server. It sends only the current demo state, not a screenshot or a user's browser history.

For example, the flow `sentence → labels → map` is:

```ts
const parsed = interpretSentence(sentenceDraft);  // Converts words to editable labels.
setPreferences((current) => ({ ...current, ...parsed })); // React updates the saved preferences.
const results = filterHomes(preferences);           // The map shows only matching sample homes.
```

The labels are **not** claimed to be a real trained AI router. They are readable prototype rules, and the renter can remove them. The guide's `DEMO` badge makes the local fallback visible; it changes to `LIVE AI` when a server key is connected and a response succeeds.

## What the market scan changed

The team should not claim that map pins, comparison, AI rental guidance, or roommate search are absent elsewhere. [Zillow documents map pins, saved homes, and side-by-side comparison](https://www.zillow.com/learn/zillow-advanced-search/); [Apartments.com describes an AI rental advisor, filters, map tools, and unit details](https://www.apartments.com/blog/the-most-important-aspects-of-your-apartment-search); [BU's off-campus site offers listings and roommate search](https://offcampus.bu.edu/). The ABUJA demo tests a narrower idea: can dated evidence, visible unknowns, and a plain-language “what should I ask?” explanation help a newcomer make a clearer decision? That is a product hypothesis, not a validated advantage.

## Limits and next build steps

- No live listings, geocoding, City of Boston records, incident data, or address joins. The source labels on cards are sample text only.
- No actual roommate identities, messaging, payments, user accounts, saved data across visits, or partner/affiliate integration.
- “Safe,” “quiet,” “social,” “well maintained,” and “good landlord” should never be automated verdicts from these examples. A real version needs careful source coverage, uncertainty display, consent/privacy design, and user testing.
- The AI route is optional and has no autonomous browsing or clicking. Local action rules respond to explicit chat requests; the model only writes the explanation.

Good next steps after mentor feedback: test the wording and user flow with renters, connect a **small** verified listing/record sample with correct address matching, and check whether people understand the evidence before expanding the city footprint.
