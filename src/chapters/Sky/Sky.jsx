import { Sunrise, Moon, CloudSun } from "lucide-react";

import { formatWholeNumber } from "../../utils/numberFormat";

function Sky({ lifeData }) {
  const skyMetrics = [
    {
      key: "sunrises",
      label: "Sunrises",
      value: lifeData.estimated.sunrises,
      description:
        "The sun has risen roughly this many times since you arrived.",
      icon: Sunrise,
    },
    {
      key: "fullMoons",
      label: "Full moons",
      value: lifeData.estimated.fullMoons,
      description: "Calculated using the average lunar cycle of 29.53 days.",
      icon: Moon,
    },
    {
      key: "seasons",
      label: "Seasons",
      value: lifeData.estimated.seasons,
      description: "Quiet changes from one part of the year into another.",
      icon: CloudSun,
    },
  ];

  return (
    <section className="data-section sky" id="sky" aria-labelledby="sky-title">
      <div className="data-section__container">
        <header className="data-section__header">
          <p className="data-section__number">03</p>

          <div>
            <p className="data-section__eyebrow">The sky above</p>

            <h2 className="data-section__title" id="sky-title">
              The world kept turning.
            </h2>

            <p className="data-section__introduction">
              Above the calendar, larger cycles continued—the sun, the moon and
              the changing seasons.
            </p>
          </div>
        </header>

        <div className="data-grid data-grid--three">
          {skyMetrics.map((metric) => {
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
          <p className="data-note__label">One ordinary sunrise</p>

          <div>
            <p className="data-note__title">
              Most of them probably felt ordinary.
            </p>

            <p className="data-note__description">
              That is not what made them unimportant. Ordinary repetition is how
              a life quietly accumulates.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Sky;
