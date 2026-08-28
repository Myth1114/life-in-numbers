import { useRef } from "react";
import { Leaf, Moon, Sunrise } from "lucide-react";
import { useChapterReveal } from "../../hooks/useChapterReveal";
import { formatWholeNumber } from "../../utils/numberFormat";

function Sky({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const skyMetrics = [
    {
      key: "sunrises",
      label: "Sunrises",
      value: lifeData.estimated.sunrises,
      description:
        "An approximate count of mornings since the day you arrived.",
      icon: Sunrise,
    },
    {
      key: "full-moons",
      label: "Full moons",
      value: lifeData.estimated.fullMoons,
      description: "Estimated using the average length of a lunar cycle.",
      icon: Moon,
    },
    {
      key: "seasons",
      label: "Seasons",
      value: lifeData.estimated.seasons,
      description: "Spring, summer, autumn and winter returning in sequence.",
      icon: Leaf,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="data-section sky"
      id="sky"
      aria-labelledby="sky-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">03</p>

          <div>
            <p className="data-section__eyebrow">Above you</p>

            <h2 className="data-section__title" id="sky-title">
              The sky kept its own record.
            </h2>

            <p className="data-section__introduction">
              Morning followed night. Moons completed their cycles. Seasons
              returned, whether or not you were paying attention.
            </p>
          </div>
        </header>

        <div className="data-grid">
          {skyMetrics.map((metric) => {
            const MetricIcon = metric.icon;

            return (
              <article className="data-metric" key={metric.key} data-reveal>
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

        <aside className="data-note" data-reveal>
          <p className="data-note__label">Approximate by design</p>

          <div>
            <p className="data-note__title">
              The sky does not follow the calendar perfectly.
            </p>

            <p className="data-note__description">
              Sunrise totals use lived days. Full moons and seasons are
              estimates based on average cycle lengths, intended to communicate
              scale rather than astronomical precision.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Sky;
