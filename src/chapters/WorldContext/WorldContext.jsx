import { useRef } from "react";

import {
  Globe2,
  HeartPulse,
  Plane,
  Smartphone,
  Users,
  Wifi,
  Zap,
  CloudSun,
} from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";
import { useWorldContext } from "../../hooks/useWorldContext";

import "./WorldContext.css";

const ICONS = {
  worldPopulation: Globe2,
  countryPopulation: Users,
  internet: Wifi,
  mobile: Smartphone,
  electricity: Zap,
  lifeExpectancy: HeartPulse,
  airTravel: Plane,
  atmosphericCo2: CloudSun,
};

const PRIMARY_KEYS = new Set([
  "worldPopulation",
  "countryPopulation",
  "internet",
  "mobile",
]);

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatValue(value, unit) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  switch (unit) {
    case "people":
    case "passengers":
      return formatCompactNumber(value);

    case "percent":
      return `${value.toFixed(1)}%`;

    case "per 100 people":
      return value.toFixed(1);

    case "years":
      return `${value.toFixed(1)} years`;

    case "ppm":
      return `${value.toFixed(1)} ppm`;
    default:
      return formatCompactNumber(value);
  }
}

function getDescription(item) {
  switch (item.key) {
    case "worldPopulation":
      return "People sharing the planet.";

    case "countryPopulation":
      return `People living in ${item.country || "your birth country"}.`;

    case "internet":
      return "Share of the world using the internet.";

    case "mobile":
      return "Mobile subscriptions for every 100 people.";

    case "electricity":
      return `Share of people with electricity in ${
        item.country || "your birth country"
      }.`;

    case "lifeExpectancy":
      return `Population average at birth in ${
        item.country || "your birth country"
      }.`;

    case "airTravel":
      return "Commercial passenger journeys worldwide.";

    case "atmosphericCo2":
      return "Annual atmospheric carbon dioxide measured at Mauna Loa Observatory.";

    default:
      return "";
  }
}

function WorldContextCard({ item, compact = false }) {
  const Icon = ICONS[item.key] ?? Globe2;

  return (
    <article
      className={
        compact
          ? "world-context__card world-context__card--compact"
          : "world-context__card"
      }
      data-reveal
    >
      <div className="world-context__card-heading">
        <p className="world-context__card-label">{item.label}</p>

        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
      </div>

      <div className="world-context__comparison">
        <div>
          <p className="world-context__year">{item.birthYear}</p>

          <p className="world-context__value">
            {formatValue(item.birthValue, item.unit)}
          </p>
        </div>

        <span className="world-context__arrow" aria-hidden="true">
          →
        </span>

        <div className="world-context__latest">
          <p className="world-context__year">{item.latestYear}</p>

          <p className="world-context__value">
            {formatValue(item.latestValue, item.unit)}
          </p>
        </div>
      </div>

      <p className="world-context__description">{getDescription(item)}</p>
    </article>
  );
}

function WorldContext({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const location = lifeData.arrival?.location;

  const { worldContext, isLoading, error } = useWorldContext(
    lifeData.birthDate,
    location
  );

  const primaryItems =
    worldContext?.items.filter((item) => PRIMARY_KEYS.has(item.key)) ?? [];

  const secondaryItems =
    worldContext?.items.filter((item) => !PRIMARY_KEYS.has(item.key)) ?? [];

  return (
    <section
      ref={sectionRef}
      className="data-section world-context"
      id="world-context"
      aria-labelledby="world-context-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">10</p>

          <div>
            <p className="data-section__eyebrow">The world you entered</p>

            <h2 className="data-section__title" id="world-context-title">
              Change happened quietly.
            </h2>

            <p className="data-section__introduction">
              Some of the largest changes happened slowly enough to feel
              ordinary while you were living through them.
            </p>
          </div>
        </header>

        {isLoading && (
          <div className="world-context__status" role="status">
            <span className="world-context__loading-mark" aria-hidden="true" />

            <p>Reconstructing the world you arrived in…</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="world-context__status" role="status">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && worldContext && !worldContext.available && (
          <div className="world-context__status">
            <p>
              Comparable world data was unavailable for this birth year and
              country.
            </p>
          </div>
        )}

        {!isLoading && !error && worldContext?.available && (
          <>
            {primaryItems.length > 0 && (
              <div className="world-context__primary-grid">
                {primaryItems.map((item) => (
                  <WorldContextCard item={item} key={item.key} />
                ))}
              </div>
            )}

            {secondaryItems.length > 0 && (
              <div className="world-context__secondary-grid">
                {secondaryItems.map((item) => (
                  <WorldContextCard item={item} key={item.key} compact />
                ))}
              </div>
            )}
          </>
        )}

        <aside className="data-note" data-reveal>
          <p className="data-note__label">Historical context</p>

          <div>
            <p className="data-note__title">
              These are population statistics, not personal predictions.
            </p>

            <p className="data-note__description">
              Values are annual World Bank statistics. The latest year can
              differ between indicators because publication schedules vary. Life
              expectancy is a population average from that period—not an
              estimate of your lifespan.
            </p>

            <a
              className="world-context__source"
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noreferrer"
            >
              View World Bank Open Data
              <span aria-hidden="true"> ↗</span>
            </a>
            {worldContext?.additionalSources?.map((source) => (
              <a
                className="world-context__source"
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.url}
              >
                View {source.name}
                <span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default WorldContext;
