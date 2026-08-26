import { HeartPulse, Wind } from "lucide-react";

import { formatWholeNumber } from "../../utils/numberFormat";

import "./Body.css";

function Body({ lifeData }) {
  const bodyMetrics = [
    {
      key: "heartbeats",
      label: "Heartbeats",
      value: lifeData.estimated.heartbeats,
      description: "Using a resting reference of 72 beats per minute.",
      icon: HeartPulse,
    },
    {
      key: "breaths",
      label: "Breaths",
      value: lifeData.estimated.breaths,
      description: "Using a gentle reference of 16 breaths per minute.",
      icon: Wind,
    },
  ];

  return (
    <section
      className="data-section body-chapter"
      id="body"
      aria-labelledby="body-title"
    >
      <div className="data-section__container">
        <header className="data-section__header">
          <p className="data-section__number">02</p>

          <div>
            <p className="data-section__eyebrow">The body clock</p>

            <h2 className="data-section__title" id="body-title">
              A million tiny keeps.
            </h2>

            <p className="data-section__introduction">
              The body keeps its own calendar. These are some of the cycles that
              have carried you here.
            </p>
          </div>
        </header>

        <div className="data-grid">
          {bodyMetrics.map((metric) => {
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

                <p className="data-metric__value body-chapter__value">
                  <span
                    className="body-chapter__approximation"
                    aria-label="Approximately"
                  >
                    ~
                  </span>

                  {formatWholeNumber(metric.value)}
                </p>

                <p className="data-metric__description">{metric.description}</p>
              </article>
            );
          })}
        </div>

        <aside className="data-note">
          <p className="data-note__label">About these figures</p>

          <div>
            <p className="data-note__description">
              These are estimates based on general reference rates. They are not
              personal health measurements.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Body;
