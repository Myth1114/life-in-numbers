import { forwardRef } from "react";

import { formatDisplayDate, formatWholeNumber } from "../../utils/numberFormat";

import "./ShareCard.css";

function getText(value) {
  if (typeof value === "string") {
    return value;
  }

  return value?.name ?? value?.label ?? value?.sign ?? "";
}

const ShareCard = forwardRef(function ShareCard({ lifeData }, ref) {
  const location = lifeData.arrival?.location;

  const locationName = [location?.name, location?.country]
    .filter(Boolean)
    .join(", ");

  const generation = getText(lifeData.arrivalContext?.generation);

  const westernZodiac = getText(lifeData.arrivalContext?.zodiac);

  const chineseZodiac = getText(lifeData.arrivalContext?.chineseZodiac);

  const entertainment = lifeData.entertainment;

  const nextMilestone = lifeData.milestones?.nextDay;

  const milestoneDate =
    nextMilestone?.milestoneDate instanceof Date
      ? formatDisplayDate(nextMilestone.milestoneDate)
      : "";

  const metrics = [
    {
      label: "Days lived",
      value: lifeData.lived.days,
    },
    {
      label: "Weeks lived",
      value: lifeData.lived.weeks,
    },
    {
      label: "Estimated heartbeats",
      value: lifeData.estimated.heartbeats,
    },
    {
      label: "Full moons",
      value: lifeData.estimated.fullMoons,
    },
  ];

  const details = [
    locationName && {
      label: "I arrived in",
      value: locationName,
    },

    generation && {
      label: "Generation",
      value: generation,
    },

    westernZodiac && {
      label: "Star sign",
      value: westernZodiac,
    },

    chineseZodiac && {
      label: "Chinese zodiac",
      value: chineseZodiac,
    },

    entertainment?.bestPicture && {
      label: "Best Picture that year",
      value: entertainment.bestPicture,
    },

    entertainment?.notableGame && {
      label: "A notable game",
      value: entertainment.notableGame,
    },
  ].filter(Boolean);

  return (
    <article className="share-card" ref={ref} aria-hidden="true">
      <header className="share-card__header">
        <p className="share-card__brand">Life in Numbers</p>

        <p className="share-card__edition">A personal almanac</p>
      </header>

      <div className="share-card__statement">
        <div>
          <p className="share-card__eyebrow">My life, measured differently</p>

          <h2 className="share-card__title">
            I have been here for approximately
          </h2>
        </div>

        <div className="share-card__primary">
          <p className="share-card__primary-number">
            {formatWholeNumber(lifeData.lived.days)}
          </p>

          <p className="share-card__primary-label">completed days</p>
        </div>
      </div>

      <div className="share-card__metrics">
        {metrics.map((metric) => (
          <div className="share-card__metric" key={metric.label}>
            <p className="share-card__metric-label">{metric.label}</p>

            <p className="share-card__metric-value">
              {formatWholeNumber(metric.value)}
            </p>
          </div>
        ))}
      </div>

      {details.length > 0 && (
        <div className="share-card__details">
          {details.slice(0, 6).map((detail) => (
            <div className="share-card__detail" key={detail.label}>
              <p className="share-card__detail-label">{detail.label}</p>

              <p className="share-card__detail-value">{detail.value}</p>
            </div>
          ))}
        </div>
      )}

      {nextMilestone && (
        <div className="share-card__milestone">
          <div>
            <p className="share-card__milestone-label">
              The next round-number milestone
            </p>

            <p className="share-card__milestone-value">
              {formatWholeNumber(nextMilestone.targetDays)} days
            </p>
          </div>

          {milestoneDate && (
            <p className="share-card__milestone-date">{milestoneDate}</p>
          )}
        </div>
      )}

      <footer className="share-card__footer">
        <p>
          The numbers describe the time behind me. Today remains the usable one.
        </p>

        <p className="share-card__today">Today / 1</p>
      </footer>
    </article>
  );
});

export default ShareCard;
