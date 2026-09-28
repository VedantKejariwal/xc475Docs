"use client";

import { useState } from "react";
import { areas, liveListingUrl, type Home } from "@/lib/demo-data";
import { estimatedStayTotal, money, type Preferences } from "@/lib/logic";

type Props = {
  home: Home;
  preferences: Preferences;
  saved: boolean;
  compared: boolean;
  onClose: () => void;
  onSave: () => void;
  onCompare: () => void;
  onAddPaintPreference: () => void;
};

export function HomeDetails({
  home,
  preferences,
  saved,
  compared,
  onClose,
  onSave,
  onCompare,
  onAddPaintPreference,
}: Props) {
  const [tab, setTab] = useState<"review" | "evidence" | "terms">("review");
  const area = areas.find((item) => item.id === home.area);
  const fitsStay =
    preferences.stayWeeks === null ||
    home.minLeaseWeeks <= preferences.stayWeeks;

  return (
    <section className="home-drawer" aria-label={`${home.name} details`}>
      <div className="drawer-top">
        <span className="eyebrow">EXAMPLE HOME · NOT A LIVE LISTING</span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close home details"
        >
          ×
        </button>
      </div>
      <h2>{home.name}</h2>
      <p className="drawer-sub">
        {area?.name} · {home.beds} bed · {money(home.rent)}/mo
      </p>
      <div className="metric-row">
        <span>
          <b>{home.commute} min</b> to BU*
        </span>
        <span>
          <b>{home.transitWalk} min</b> to T*
        </span>
        <span>
          <b>{home.minLeaseWeeks} wk</b> min term*
        </span>
      </div>
      <p className="micro-note">
        *Illustrative estimates, not verified routes or lease terms.
      </p>
      <div className="drawer-tabs" role="tablist" aria-label="Home details">
        {(["review", "evidence", "terms"] as const).map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
            role="tab"
            aria-selected={tab === item}
          >
            {item === "review"
              ? "AI review"
              : item === "evidence"
                ? "Evidence"
                : "Stay & cost"}
          </button>
        ))}
      </div>

      {tab === "review" && (
        <div className="drawer-body">
          <p className="section-intro">
            An educational review of sample facts. ABUJA explains; you decide.
          </p>
          <div className="review-card positive">
            <span className="card-kicker">01 / MATCHES</span>
            <strong>{home.highlight}</strong>
            <p>
              It matches some of your stated needs. Check the exact route and
              budget yourself.
            </p>
          </div>
          <div className="review-card caution">
            <span className="card-kicker">02 / CONDITION CLUE</span>
            <strong>
              {home.paintYears === null
                ? "Condition record unavailable"
                : home.paintYears >= 8
                  ? "Older paint entry in the sample"
                  : "Sample paint entry available"}
            </strong>
            <p>{home.maintenance}</p>
          </div>
          <div className="review-card neutral">
            <span className="card-kicker">03 / EVERYDAY SCENARIO</span>
            <strong>What could this mean for you?</strong>
            <p>
              {home.paintYears !== null && home.paintYears >= 8
                ? "Imagine moving in and noticing scuffed walls. Ask who will repaint and inspect the walls before signing. Old paint data alone does not prove the present condition."
                : "Before signing, ask for current photos, confirm the lease terms, and visit if you can. A sample record is only one part of the picture."}
            </p>
          </div>
          <button className="text-action" onClick={() => setTab("evidence")}>
            See the source dates and unknowns →
          </button>
          {home.paintYears !== null && home.paintYears >= 8 && (
            <button className="text-action" onClick={onAddPaintPreference}>
              Add “ask about recent paint” to my preferences →
            </button>
          )}
        </div>
      )}

      {tab === "evidence" && (
        <div className="drawer-body">
          <p className="section-intro">
            Claim: “{home.listingClaim}.” Look at dates and unknowns before
            drawing conclusions.
          </p>
          {home.evidence.map((item) => (
            <div className="evidence-row" key={item.title}>
              <span className={`evidence-mark ${item.status}`} />
              <div>
                <strong>{item.title}</strong>
                <small>{item.date}</small>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
          <div className="question-box">
            <span>ASK THE LANDLORD</span>
            <p>
              What work was done, when was it completed, and can I see current
              photos or a record for this exact unit?
            </p>
          </div>
          <p className="micro-note">
            A missing matching record does not prove work never happened. Unit
            and address matching can fail.
          </p>
        </div>
      )}

      {tab === "terms" && (
        <div className="drawer-body">
          <div className={`term-banner ${fitsStay ? "fits" : "mismatch"}`}>
            <strong>
              {fitsStay
                ? "Sample stay length could fit"
                : "Sample term mismatch"}
            </strong>
            <span>
              {preferences.stayWeeks
                ? `Your stay: ${preferences.stayWeeks} weeks · Sample minimum: ${home.minLeaseWeeks} weeks`
                : "Enter your stay length in the sidebar to check this home."}
            </span>
          </div>
          <div className="cost-line">
            <span>Monthly rent</span>
            <b>{money(home.rent)}</b>
          </div>
          <div className="cost-line">
            <span>Listed example fees</span>
            <b>{money(home.fees)}</b>
          </div>
          {preferences.stayWeeks && (
            <div className="cost-line total">
              <span>Rough stay estimate</span>
              <b>{money(estimatedStayTotal(home, preferences.stayWeeks))}</b>
            </div>
          )}
          <p className="micro-note">
            Estimate uses rounded months and listed sample fees. Deposits,
            utilities, availability and refund terms are unknown. Verify the
            original listing.
          </p>
        </div>
      )}

      <div className="drawer-actions">
        <button className="primary-button" onClick={onSave}>
          {saved ? "Saved to shortlist ✓" : "Save this home"}
        </button>
        <button className="secondary-button" onClick={onCompare}>
          {compared ? "Added to compare ✓" : "Add to compare"}
        </button>
      </div>
      <a
        className="handoff-link"
        href={liveListingUrl}
        target="_blank"
        rel="noreferrer"
      >
        Browse current listings on BU’s housing site ↗
      </a>
      <p className="micro-note">
        This is a general external handoff, not a link to this fictional home.
      </p>
    </section>
  );
}
