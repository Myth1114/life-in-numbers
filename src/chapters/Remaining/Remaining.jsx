import { CalendarRange, Rows3, Umbrella, Sun } from "lucide-react";

import { formatWholeNumber } from "../../utils/numberFormat";

import "./Remaining.css";

function Remaining({ lifeData, onReferenceAgeChange }) {
  const referenceAge = lifeData.reference.lifespan;

  const livedPercentage = Math.min(
    100,
    (lifeData.lived.years / referenceAge) * 100
  );

  const remainingMetrics = [
    {
      key: "days",
      label: "Reference days",
      value: lifeData.reference.remainingDays,
      description: `Between today and age ${referenceAge}.`,
      icon: CalendarRange,
    },
    {
      key: "weeks",
      label: "Reference weeks",
      value: lifeData.reference.remainingWeeks,
      description: "Seven-day portions inside the selected horizon.",
      icon: Rows3,
    },
    {
      key: "weekends",
      label: "Reference weekends",
      value: lifeData.reference.remainingWeekends,
      description: "Approximately one weekend for every remaining week.",
      icon: Umbrella,
    },
    {
      key: "summers",
      label: "Reference summers",
      value: lifeData.reference.remainingSummers,
      description: "Seasonal returns within the selected reference.",
      icon: Sun,
    },
  ];

  function handleSliderChange(event) {
    const newAge = Number(event.target.value);

    onReferenceAgeChange(newAge);
  }

  return (
    <section
      className="data-section remaining"
      id="remaining"
      aria-labelledby="remaining-title"
    >
      <div className="data-section__container">
        <header className="data-section__header">
          <p className="data-section__number">06</p>

          <div>
            <p className="data-section__eyebrow">A hypothetical horizon</p>

            <h2 className="data-section__title" id="remaining-title">
              A longer view
            </h2>

            <p className="data-section__introduction">
              Choose a horizon. It is not an answer—only a line on the page that
              makes scale visible.
            </p>
          </div>
        </header>

        <div className="remaining__control">
          <div className="remaining__control-header">
            <div>
              <label
                className="remaining__control-label"
                htmlFor="reference-age"
              >
                Reference lifespan
              </label>

              <p className="remaining__age">
                {referenceAge}
                <span> years</span>
              </p>
            </div>

            <p className="remaining__hypothetical">Hypothetical</p>
          </div>

          <input
            className="remaining__slider"
            id="reference-age"
            type="range"
            min="70"
            max="100"
            step="1"
            value={referenceAge}
            onChange={handleSliderChange}
            aria-describedby="reference-explanation"
          />

          <div className="remaining__range-labels">
            <span>70</span>
            <span>85</span>
            <span>100</span>
          </div>
        </div>

        <div className="remaining__position">
          <div className="remaining__position-header">
            <p>Where the mark sits</p>

            <p>{livedPercentage.toFixed(1)}%</p>
          </div>

          <div
            className="remaining__progress"
            role="progressbar"
            aria-label="Percentage of selected reference age completed"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Number(livedPercentage.toFixed(1))}
          >
            <span
              style={{
                width: `${livedPercentage}%`,
              }}
            />
          </div>
        </div>

        <p className="remaining__statement" id="reference-explanation">
          At this horizon, there are roughly{" "}
          <em>{formatWholeNumber(lifeData.reference.remainingDays)}</em>{" "}
          reference days beyond today.
        </p>

        <div className="data-grid">
          {remainingMetrics.map((metric) => {
            const MetricIcon = metric.icon;

            return (
              <article className="data-metric" key={metric.key}>
                <div className="data-metric__top">
                  <p className="data-metric__label">{metric.label}</p>

                  <MetricIcon
                    className="data-metric__icon"
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                <p className="data-metric__value">
                  {formatWholeNumber(metric.value)}
                </p>

                <p className="data-metric__description">{metric.description}</p>
              </article>
            );
          })}
        </div>

        <aside className="data-note">
          <p className="data-note__label">Reference, not prediction</p>

          <div>
            <p className="data-note__title">
              No one can know the shape of a future life.
            </p>

            <p className="data-note__description">
              Age {referenceAge} is simply a ruler placed gently beside the
              present. The figures are not a forecast.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Remaining;
