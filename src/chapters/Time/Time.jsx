import { Orbit, CalendarDays, Clock3, Sun } from "lucide-react";

import { formatWholeNumber } from "../../utils/numberFormat";

function Time({ lifeData }) {
  const timeMetrics = [
    {
      key: "years",
      label: "Years",
      value: lifeData.lived.years,
      description: "Completed turns around the sun.",
      icon: Orbit,
    },
    {
      key: "months",
      label: "Months",
      value: lifeData.lived.months,
      description: "Pages turned in the smaller calendar.",
      icon: CalendarDays,
    },
    {
      key: "weeks",
      label: "Weeks",
      value: lifeData.lived.weeks,
      description: "Seven-day parcels, each one distinct.",
      icon: Clock3,
    },
    {
      key: "days",
      label: "Days",
      value: lifeData.lived.days,
      description: "Mornings that became evenings.",
      icon: Sun,
    },
  ];

  return (
    <section
      className="data-section time"
      id="time"
      aria-labelledby="time-title"
    >
      <div className="data-section__container">
        <header className="data-section__header">
          <p className="data-section__number">01</p>

          <div>
            <h2 className="data-section__title" id="time-title">
              Small revolutions
            </h2>

            <p className="data-section__introduction">
              Time rarely arrives as one large number. It accumulates quietly,
              one ordinary unit after another.
            </p>
          </div>
        </header>

        <div className="data-grid">
          {timeMetrics.map((metric) => {
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
          <p className="data-note__label">A note on arithmetic</p>

          <div>
            <p className="data-note__title">
              The calendar is a human invention. The feeling of time is not.
            </p>

            <p className="data-note__description">
              These figures use calendar dates and completed units. Leap years
              remain part of the calculation.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Time;
