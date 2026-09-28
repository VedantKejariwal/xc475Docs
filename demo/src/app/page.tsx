"use client";

import { useMemo, useState } from "react";
import { GuidePanel } from "@/components/GuidePanel";
import { HomeDetails } from "@/components/HomeDetails";
import { MapCanvas } from "@/components/MapCanvas";
import {
  areas,
  homes,
  liveListingUrl,
  roommates,
  type AreaId,
  type Home,
} from "@/lib/demo-data";
import { type GuideAction, type GuideContext, type Screen } from "@/lib/guide";
import {
  filterHomes,
  interpretSentence,
  money,
  roommateFit,
  suggestSingleChange,
  startingPreferences,
  type Preferences,
  type RoommateSurvey,
} from "@/lib/logic";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export default function HomePage() {
  // React state is the single source of truth for filters, map pins, saved homes,
  // the comparison, and the guide's knowledge of the current screen.
  const [screen, setScreen] = useState<Screen>("explore");
  const [preferences, setPreferences] =
    useState<Preferences>(startingPreferences);
  const [sentenceDraft, setSentenceDraft] = useState(
    startingPreferences.sentence,
  );
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showAreaCards, setShowAreaCards] = useState(false);
  const [showEmptyPreview, setShowEmptyPreview] = useState(false);
  const [roommateOptIn, setRoommateOptIn] = useState(false);
  const [roommateSurvey, setRoommateSurvey] = useState<RoommateSurvey>({
    maxShare: 1100,
    schedule: "flexible",
    habits: "quiet",
  });
  const [contactIntent, setContactIntent] = useState<string | null>(null);

  const visibleHomes = useMemo(() => filterHomes(preferences), [preferences]);
  const chosenHome = homes.find((home) => home.id === selectedHomeId) || null;
  const preview = suggestSingleChange(preferences);
  const roommateResults = useMemo(
    () =>
      roommates
        .map((person) => ({
          person,
          fit: roommateFit(person, roommateSurvey, preferences.area),
        }))
        .sort((a, b) => b.fit.score - a.fit.score),
    [roommateSurvey, preferences.area],
  );
  const guideContext: GuideContext = {
    screen,
    selectedHomeId,
    visibleHomeIds: visibleHomes.map((home) => home.id),
    shortlistCount: savedIds.length,
    compareCount: compareIds.length,
    roommateOptIn,
    preferences,
  };

  function updatePreferences(next: Partial<Preferences>) {
    setPreferences((current) => ({ ...current, ...next }));
  }
  function chooseHome(id: string) {
    setSelectedHomeId(id);
    setDetailOpen(true);
    setScreen("explore");
  }
  function toggleSaved(id: string) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function toggleCompared(id: string) {
    setCompareIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 2
          ? [...current, id]
          : [current[1], id],
    );
  }
  function handleGuideAction(action: GuideAction) {
    if (["explore", "compare", "roommates", "shortlist"].includes(action))
      setScreen(action as Screen);
    if (action === "widen") {
      setScreen("explore");
      setShowEmptyPreview(true);
    }
    if (action === "neighborhoods") {
      setScreen("explore");
      setShowAreaCards(true);
    }
    if (action === "condition" && selectedHomeId) {
      setScreen("explore");
      setDetailOpen(true);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">
            a<span>•</span>
          </span>
          <div>
            <strong>ABUJA</strong>
            <small>Find your place. Know your place.</small>
          </div>
        </div>
        <nav aria-label="Main navigation" className="main-nav">
          {(["explore", "shortlist", "compare", "roommates"] as const).map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  setScreen(item);
                  setDetailOpen(false);
                }}
                className={screen === item ? "selected" : ""}
              >
                {item === "explore"
                  ? "Explore map"
                  : item === "shortlist"
                    ? `Shortlist ${savedIds.length ? `(${savedIds.length})` : ""}`
                    : item === "compare"
                      ? `Compare ${compareIds.length ? `(${compareIds.length})` : ""}`
                      : "Roommates"}
              </button>
            ),
          )}
        </nav>
        <div className="header-right">
          <span className="demo-badge">✦ MENTOR DEMO</span>
          <span className="avatar">V</span>
        </div>
      </header>

      <div className="intro-bar">
        <div>
          <Label>ONE FOCUSED MAP</Label>
          <h1>
            Boston housing, with the context you wish you knew to ask for.
          </h1>
        </div>
        <div className="journey">
          <span className="journey-active">1 · Understand & narrow</span>
          <span>2 · Explore & learn</span>
          <span>3 · Compare & connect</span>
        </div>
      </div>

      <main className="workspace">
        <aside className="filters-panel">
          <div className="panel-heading">
            <div>
              <Label>YOUR STARTING POINT</Label>
              <h2>Make it yours.</h2>
            </div>
            <span className="step-circle">01</span>
          </div>
          <p className="panel-help">
            Tell us what matters in one sentence. Review and change the labels
            before you explore.
          </p>
          <label className="field-label" htmlFor="sentence">
            Your housing needs
          </label>
          <textarea
            id="sentence"
            value={sentenceDraft}
            onChange={(event) => setSentenceDraft(event.target.value)}
            rows={3}
            placeholder="Near BU, close to the T, and under $2,000…"
          />
          <button
            className="interpret-button"
            onClick={() => {
              updatePreferences({
                sentence: sentenceDraft,
                ...interpretSentence(sentenceDraft),
              });
              setShowEmptyPreview(false);
            }}
          >
            ✦ Interpret my preferences
          </button>
          <div className="label-section">
            <div className="section-row">
              <Label>EDITABLE LABELS</Label>
              <span>{preferences.labels.length} found</span>
            </div>
            <div className="chips">
              {preferences.labels.map((label, index) => (
                <button
                  key={label}
                  className="chip"
                  onClick={() =>
                    updatePreferences({
                      labels: preferences.labels.filter(
                        (item) => item !== label,
                      ),
                    })
                  }
                  title={`Remove ${label}`}
                >
                  <em>{String.fromCharCode(65 + index)}</em>
                  {label} <b>×</b>
                </button>
              ))}
            </div>
            <p className="micro-note">
              Supported labels become editable controls below. “Safety” stays a
              question because this demo has no verified safety data.
            </p>
          </div>
          <div className="filter-divider" />
          <div className="section-row">
            <Label>FIND YOUR FIT</Label>
            <span>Always editable</span>
          </div>
          <label className="field-label" htmlFor="budget">
            Max monthly rent <b>{money(preferences.budget)}</b>
          </label>
          <input
            id="budget"
            type="range"
            min="1500"
            max="2500"
            step="50"
            value={preferences.budget}
            onChange={(event) =>
              updatePreferences({ budget: Number(event.target.value) })
            }
          />
          <label className="field-label" htmlFor="transit">
            Walk to the T <b>≤ {preferences.transitWalk} min</b>
          </label>
          <input
            id="transit"
            type="range"
            min="3"
            max="20"
            step="1"
            value={preferences.transitWalk}
            onChange={(event) =>
              updatePreferences({ transitWalk: Number(event.target.value) })
            }
          />
          <label className="field-label" htmlFor="stay">
            Stay length{" "}
            <b>
              {preferences.stayWeeks
                ? `${preferences.stayWeeks} weeks`
                : "Not set"}
            </b>
          </label>
          <input
            id="stay"
            type="number"
            min="1"
            max="104"
            value={preferences.stayWeeks ?? ""}
            onChange={(event) =>
              updatePreferences({
                stayWeeks: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
            placeholder="e.g. 10 for a summer internship"
          />
          <div className="field-label">
            Neighborhood feel{" "}
            <b>
              {preferences.feel === "any" ? "Open to both" : preferences.feel}
            </b>
          </div>
          <div className="segmented">
            <button
              className={preferences.feel === "any" ? "on" : ""}
              onClick={() => updatePreferences({ feel: "any" })}
            >
              Either
            </button>
            <button
              className={preferences.feel === "quiet" ? "on" : ""}
              onClick={() => updatePreferences({ feel: "quiet" })}
            >
              Quieter
            </button>
            <button
              className={preferences.feel === "social" ? "on" : ""}
              onClick={() => updatePreferences({ feel: "social" })}
            >
              Social
            </button>
          </div>
          <button
            className="areas-link"
            onClick={() => setShowAreaCards((value) => !value)}
          >
            {showAreaCards ? "Hide" : "Compare"} neighborhood mini-maps ↗
          </button>
          <div className="sidebar-end">
            <span>✦</span>
            <p>
              <b>Your search, your choice.</b>
              <br />
              We show sample tradeoffs and unknowns; you decide what matters.
            </p>
          </div>
        </aside>

        <section className="main-panel">
          {screen === "explore" && (
            <>
              <div className="main-panel-head">
                <div>
                  <Label>EXPLORE & LEARN</Label>
                  <h2>
                    {preferences.area === "all"
                      ? "Explore near Boston University"
                      : areas.find((area) => area.id === preferences.area)
                          ?.name}
                  </h2>
                  <p>
                    {visibleHomes.length} illustrative{" "}
                    {visibleHomes.length === 1 ? "home" : "homes"} in your
                    focused map · not live availability
                  </p>
                </div>
                <button
                  className="map-reset"
                  onClick={() =>
                    updatePreferences({ area: "all", feel: "any" })
                  }
                >
                  ↺ Reset area
                </button>
              </div>
              <div className="zone-strip">
                <button
                  className={preferences.area === "all" ? "active" : ""}
                  onClick={() => updatePreferences({ area: "all" })}
                >
                  All areas
                </button>
                {areas.map((area) => (
                  <button
                    key={area.id}
                    className={preferences.area === area.id ? "active" : ""}
                    onClick={() => updatePreferences({ area: area.id })}
                  >
                    {area.name}
                  </button>
                ))}
              </div>
              {showAreaCards && (
                <div className="area-cards">
                  {areas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => {
                        updatePreferences({ area: area.id });
                        setShowAreaCards(false);
                      }}
                    >
                      <span className="area-swatch">
                        {area.feel === "quiet" ? "◌" : "✺"}
                      </span>
                      <strong>{area.name}</strong>
                      <small>
                        {area.transit} · {area.places}
                      </small>
                      <p>{area.note}. Feel is personal; visit to check.</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="map-wrap">
                <MapCanvas
                  visibleHomes={visibleHomes}
                  selectedHomeId={selectedHomeId}
                  onSelectHome={chooseHome}
                  onSelectArea={(area: AreaId) => updatePreferences({ area })}
                />
                {visibleHomes.length === 0 && (
                  <div className="empty-card">
                    <span className="empty-icon">⌕</span>
                    <h3>No homes match these filters</h3>
                    <p>
                      Your preferences are saved. Try one change at a time;
                      sample listing coverage may also be incomplete.
                    </p>
                    {preview ? (
                      <>
                        <button
                          className="secondary-button"
                          onClick={() => setShowEmptyPreview((value) => !value)}
                        >
                          Preview one useful change
                        </button>
                        {showEmptyPreview && (
                          <div className="preview-result">
                            <b>{preview.label}</b>
                            <span>
                              {preview.count} sample{" "}
                              {preview.count === 1 ? "home" : "homes"} would
                              appear. {preview.tradeoff}
                            </span>
                            <button
                              onClick={() => {
                                updatePreferences(preview.update);
                                setShowEmptyPreview(false);
                              }}
                            >
                              Apply this one change
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="preview-result">
                        <b>No single change is enough here.</b>
                        <span>
                          Try adjusting two controls or check a broader live
                          listing source.
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {detailOpen && chosenHome && (
                  <HomeDetails
                    key={chosenHome.id}
                    home={chosenHome}
                    preferences={preferences}
                    saved={savedIds.includes(chosenHome.id)}
                    compared={compareIds.includes(chosenHome.id)}
                    onClose={() => setDetailOpen(false)}
                    onSave={() => toggleSaved(chosenHome.id)}
                    onCompare={() => toggleCompared(chosenHome.id)}
                    onAddPaintPreference={() =>
                      updatePreferences({
                        labels: [
                          ...new Set([
                            ...preferences.labels,
                            "Ask about recent paint",
                          ]),
                        ],
                      })
                    }
                  />
                )}
              </div>
              <div className="results-head">
                <div>
                  <Label>HOMES TO EXPLORE</Label>
                  <span>Tap a home to see the evidence behind it.</span>
                </div>
                <button onClick={() => setScreen("compare")}>
                  Compare selected{" "}
                  {compareIds.length ? `(${compareIds.length})` : ""} →
                </button>
              </div>
              <div className="result-cards">
                {visibleHomes.map((home) => (
                  <button
                    className={`result-card ${selectedHomeId === home.id ? "selected" : ""}`}
                    key={home.id}
                    onClick={() => chooseHome(home.id)}
                  >
                    <span className="result-art">
                      {home.feel === "quiet" ? "◌" : "✺"}
                      <em>
                        {areas.find((area) => area.id === home.area)?.name}
                      </em>
                    </span>
                    <span className="result-info">
                      <strong>{home.name}</strong>
                      <b>
                        {money(home.rent)}
                        <small>/mo</small>
                      </b>
                      <span>
                        {home.commute} min to BU* · {home.transitWalk} min to T*
                      </span>
                      <i>{home.highlight}</i>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {screen === "shortlist" && (
            <div className="flow-screen">
              <Label>YOUR SHORTLIST</Label>
              <h2>Keep a few realistic options close.</h2>
              <p>
                Saved homes stay in this browser session. Use them to compare,
                or reopen the evidence.
              </p>
              {savedIds.length ? (
                <div className="flow-card-grid">
                  {savedIds
                    .map((id) => homes.find((home) => home.id === id))
                    .filter((home): home is Home => !!home)
                    .map((home) => (
                      <div className="flow-card" key={home.id}>
                        <span className="card-kicker">
                          {areas.find((area) => area.id === home.area)?.name}
                        </span>
                        <h3>{home.name}</h3>
                        <p>
                          {money(home.rent)}/month · {home.commute} min to BU*
                        </p>
                        <div className="mini-callout">{home.tradeoff}</div>
                        <button
                          className="secondary-button"
                          onClick={() => chooseHome(home.id)}
                        >
                          Review this home
                        </button>
                        <button
                          className="text-action"
                          onClick={() => toggleCompared(home.id)}
                        >
                          {compareIds.includes(home.id)
                            ? "Remove from comparison"
                            : "Add to comparison"}
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="blank-state">
                  <strong>No saved homes yet.</strong>
                  <p>Open a map pin, review its context, then save it here.</p>
                  <button
                    className="primary-button"
                    onClick={() => setScreen("explore")}
                  >
                    Explore the map
                  </button>
                </div>
              )}
            </div>
          )}

          {screen === "compare" && (
            <div className="flow-screen">
              <Label>COMPARE & CONNECT</Label>
              <h2>Home A, meet Home B.</h2>
              <p>
                Aligned facts and unknowns, without a system-selected winner.
              </p>
              {compareIds.length < 2 ? (
                <div className="blank-state">
                  <strong>Select two homes to compare.</strong>
                  <p>
                    You have {compareIds.length} of 2 selected. Open a map pin
                    and tap “Add to compare.”
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => setScreen("explore")}
                  >
                    Choose homes on the map
                  </button>
                </div>
              ) : (
                <CompareView
                  homeA={homes.find((item) => item.id === compareIds[0])!}
                  homeB={homes.find((item) => item.id === compareIds[1])!}
                  onOpen={chooseHome}
                />
              )}
            </div>
          )}

          {screen === "roommates" && (
            <div className="flow-screen roommates-screen">
              <Label>OPT-IN MATCHING</Label>
              <h2>Find a roommate you can actually picture living with.</h2>
              <p>
                Only preferences you choose below affect these fictional
                matches. A score cannot guarantee compatibility.
              </p>
              <div className="optin-card">
                <div>
                  <strong>Show sample roommate matches</strong>
                  <p>
                    For the demo, nothing is stored or sent to another person.
                  </p>
                </div>
                <button
                  className={`switch ${roommateOptIn ? "on" : ""}`}
                  role="switch"
                  aria-checked={roommateOptIn}
                  aria-label="Show roommate matches"
                  onClick={() => setRoommateOptIn((value) => !value)}
                >
                  <span />
                </button>
              </div>
              {roommateOptIn ? (
                <>
                  <div className="roommate-survey">
                    <label>
                      My maximum share{" "}
                      <input
                        type="number"
                        min="500"
                        max="4000"
                        step="50"
                        value={roommateSurvey.maxShare}
                        onChange={(event) =>
                          setRoommateSurvey((current) => ({
                            ...current,
                            maxShare: Number(event.target.value),
                          }))
                        }
                      />
                    </label>
                    <label>
                      My schedule{" "}
                      <select
                        value={roommateSurvey.schedule}
                        onChange={(event) =>
                          setRoommateSurvey((current) => ({
                            ...current,
                            schedule: event.target
                              .value as RoommateSurvey["schedule"],
                          }))
                        }
                      >
                        <option value="flexible">Flexible</option>
                        <option value="early">Early</option>
                        <option value="late">Late</option>
                        <option value="regular">Regular</option>
                      </select>
                    </label>
                    <label>
                      Living style{" "}
                      <select
                        value={roommateSurvey.habits}
                        onChange={(event) =>
                          setRoommateSurvey((current) => ({
                            ...current,
                            habits: event.target
                              .value as RoommateSurvey["habits"],
                          }))
                        }
                      >
                        <option value="flexible">Flexible</option>
                        <option value="quiet">Quiet weekdays</option>
                        <option value="social">Social</option>
                        <option value="tidy">Shared cleaning plan</option>
                      </select>
                    </label>
                  </div>
                  <div className="flow-card-grid">
                    {roommateResults.map(({ person, fit }) => (
                      <div className="flow-card roommate-card" key={person.id}>
                        <div className="roommate-title">
                          <span className="roommate-avatar">
                            {person.initials}
                          </span>
                          <div>
                            <h3>{person.name}</h3>
                            <p>{person.budget}</p>
                          </div>
                        </div>
                        <div className="shared-tags">
                          {fit.reasons.map((item) => (
                            <span key={item}>✓ {item}</span>
                          ))}
                        </div>
                        <p>
                          <b>Why this appeared:</b>{" "}
                          {fit.reasons.length
                            ? fit.reasons.join(", ")
                            : "Sample profile for you to review"}
                          .
                        </p>
                        <p>
                          <b>Differences to discuss:</b>{" "}
                          {fit.differences.length
                            ? fit.differences.join(", ")
                            : "No differences in the limited demo fields"}
                          .
                        </p>
                        <button
                          className="secondary-button"
                          onClick={() => setContactIntent(person.id)}
                        >
                          {contactIntent === person.id
                            ? "Interest noted in demo ✓"
                            : "Express contact interest"}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="blank-state">
                  <strong>Matching is off.</strong>
                  <p>Opt in to see sample profiles and transparent reasons.</p>
                </div>
              )}
            </div>
          )}
        </section>

        <GuidePanel context={guideContext} onAction={handleGuideAction} />
      </main>
      <footer className="site-footer">
        <span>
          ABUJA concept demo · fictional homes, people, prices and records · no
          live inventory or safety rating
        </span>
        <a href={liveListingUrl} target="_blank" rel="noreferrer">
          Go to BU’s live housing search ↗
        </a>
      </footer>
    </div>
  );
}

function CompareView({
  homeA,
  homeB,
  onOpen,
}: {
  homeA: Home;
  homeB: Home;
  onOpen: (id: string) => void;
}) {
  const rows: { label: string; a: string; b: string }[] = [
    { label: "Monthly rent*", a: money(homeA.rent), b: money(homeB.rent) },
    {
      label: "BU commute*",
      a: `${homeA.commute} min`,
      b: `${homeB.commute} min`,
    },
    {
      label: "Walk to T*",
      a: `${homeA.transitWalk} min`,
      b: `${homeB.transitWalk} min`,
    },
    {
      label: "Min lease*",
      a: `${homeA.minLeaseWeeks} weeks`,
      b: `${homeB.minLeaseWeeks} weeks`,
    },
    { label: "What stands out", a: homeA.highlight, b: homeB.highlight },
    { label: "Tradeoff", a: homeA.tradeoff, b: homeB.tradeoff },
    { label: "Condition context", a: homeA.maintenance, b: homeB.maintenance },
    {
      label: "Unknown",
      a: "Current unit condition; exact lease terms",
      b: "Current unit condition; exact lease terms",
    },
  ];
  return (
    <div className="comparison">
      <div className="comparison-head">
        <span>FACTOR</span>
        <div>
          <b>HOME A</b>
          <strong>{homeA.name}</strong>
        </div>
        <div>
          <b>HOME B</b>
          <strong>{homeB.name}</strong>
        </div>
      </div>
      {rows.map((row) => (
        <div className="comparison-row" key={row.label}>
          <span>{row.label}</span>
          <p>{row.a}</p>
          <p>{row.b}</p>
        </div>
      ))}
      <div className="compare-actions">
        <button className="secondary-button" onClick={() => onOpen(homeA.id)}>
          Review Home A
        </button>
        <button className="secondary-button" onClick={() => onOpen(homeB.id)}>
          Review Home B
        </button>
      </div>
      <p className="micro-note">
        *Illustrative values. Verify price, route, condition and terms on a real
        listing before deciding.
      </p>
    </div>
  );
}
