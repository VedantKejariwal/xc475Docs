"use client";

import { useRef, useState, type PointerEvent } from "react";
import { areas, type Home } from "@/lib/demo-data";

type Props = {
  visibleHomes: Home[];
  selectedHomeId: string | null;
  onSelectHome: (id: string) => void;
  onSelectArea: (id: Home["area"]) => void;
};

export function MapCanvas({
  visibleHomes,
  selectedHomeId,
  onSelectHome,
  onSelectArea,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      startX: pan.x,
      startY: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    setPan({
      x: drag.current.startX + event.clientX - drag.current.x,
      y: drag.current.startY + event.clientY - drag.current.y,
    });
  }

  return (
    <div
      className="map-viewport"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={() => {
        drag.current = null;
      }}
    >
      <div
        className="map-art"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* A self-contained schematic Boston map. It has no network tiles or implied live geodata. */}
        <svg
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="map-svg"
        >
          <rect width="1000" height="700" fill="#e9eee7" />
          <path
            d="M0 0 H1000 V116 C876 133 790 94 695 150 C574 218 460 179 339 114 C207 45 107 54 0 90 Z"
            fill="#b8dbe0"
          />
          <path
            d="M0 170 C145 153 186 216 330 207 S568 274 700 220 S882 202 1000 235"
            stroke="#fffdf7"
            strokeWidth="30"
            fill="none"
          />
          <path
            d="M0 349 C172 288 278 334 404 350 S680 350 1000 320"
            stroke="#fffdf7"
            strokeWidth="24"
            fill="none"
          />
          <path
            d="M75 690 C194 574 245 508 327 348 S410 133 448 0"
            stroke="#fffdf7"
            strokeWidth="17"
            fill="none"
          />
          <path
            d="M346 700 C404 541 473 433 547 322 S636 80 663 0"
            stroke="#fffdf7"
            strokeWidth="18"
            fill="none"
          />
          <path
            d="M625 700 C674 574 754 446 829 302 S882 92 920 0"
            stroke="#fffdf7"
            strokeWidth="18"
            fill="none"
          />
          <path
            d="M0 530 C130 471 226 475 369 521 S676 582 1000 535"
            stroke="#fffdf7"
            strokeWidth="17"
            fill="none"
          />
          <path
            d="M567 485 C625 453 703 451 768 510 C812 554 777 630 682 636 C571 642 509 550 567 485Z"
            fill="#cde4c7"
          />
          <path
            d="M776 136 C852 105 936 140 967 201 C973 245 908 275 816 246 C747 220 736 158 776 136Z"
            fill="#cde4c7"
          />
          <path
            d="M0 334 C172 273 273 321 398 336 S680 334 1000 305"
            stroke="#f1c78c"
            strokeWidth="5"
            fill="none"
            strokeDasharray="9 8"
          />
          <text x="38" y="60" className="water-label">
            CHARLES RIVER
          </text>
          <text x="382" y="311" className="road-label">
            COMMONWEALTH AVE · GREEN LINE B
          </text>
          <text x="620" y="567" className="park-label">
            GREEN SPACE
          </text>
          <text x="820" y="187" className="park-label">
            FENWAY PARKS
          </text>
        </svg>
        {areas.map((area) => (
          <button
            className="area-marker"
            key={area.id}
            style={{ left: `${area.x}%`, top: `${area.y - 17}%` }}
            onClick={() => {
              setZoom(1.25);
              onSelectArea(area.id);
            }}
            title={`Zoom into ${area.name}`}
          >
            <span>{area.name}</span>
          </button>
        ))}
        {visibleHomes.map((home) => (
          <button
            key={home.id}
            className={`home-pin ${selectedHomeId === home.id ? "active" : ""}`}
            style={{ left: `${home.mapX}%`, top: `${home.mapY}%` }}
            onClick={() => onSelectHome(home.id)}
            aria-label={`Open ${home.name}, $${home.rent} monthly`}
          >
            ${Math.round(home.rent / 100) / 10}k
          </button>
        ))}
      </div>
      <div className="map-scale-controls">
        <button
          onClick={() => setZoom((value) => Math.min(1.75, value + 0.15))}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((value) => Math.max(0.8, value - 0.15))}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          aria-label="Reset map"
        >
          ↺
        </button>
      </div>
      <div className="map-caption">
        <span className="map-caption-dot" /> Illustrative Boston area map ·
        drag, zoom, choose a zone or home
      </div>
    </div>
  );
}
