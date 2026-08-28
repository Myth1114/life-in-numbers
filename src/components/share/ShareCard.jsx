import { forwardRef } from "react";

import { formatWholeNumber } from "../../utils/numberFormat";

import "./ShareCard.css";

const ShareCard = forwardRef(function ShareCard({ lifeData }, ref) {
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
    {
      label: "Sunrises",
      value: lifeData.estimated.sunrises,
    },
  ];

  return (
    <article className="share-card" ref={ref} aria-hidden="true">
      <header className="share-card__header">
        <p className="share-card__brand">Life in Numbers</p>

        <p className="share-card__edition">A personal almanac</p>
      </header>

      <div className="share-card__statement">
        <p className="share-card__eyebrow">My life, measured differently</p>

        <h2 className="share-card__title">
          I have been here for approximately
        </h2>

        <p className="share-card__primary-number">
          {formatWholeNumber(lifeData.lived.days)}
        </p>

        <p className="share-card__primary-label">days</p>
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

      <footer className="share-card__footer">
        <p>The future is a reference. Today is the usable number.</p>

        <p className="share-card__today">Today / 1</p>
      </footer>
    </article>
  );
});

export default ShareCard;
