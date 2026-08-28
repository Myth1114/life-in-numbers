import { useRef } from "react";

import { BookOpen, MapPinned, UsersRound, Cake } from "lucide-react";
import { formatWholeNumber } from "../../utils/numberFormat";

import { useChapterReveal } from "../../hooks/useChapterReveal";
function Perspective({ lifeData }) {
  const referenceAge = lifeData.reference.lifespan;
  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);
  const perspectiveMetrics = [
    {
      key: "books",
      label: "Books",
      value: lifeData.perspective.booksAtOnePerMonth,
      description: "If one book found you each month.",
      icon: BookOpen,
    },
    {
      key: "trips",
      label: "Weekend trips",
      value: lifeData.perspective.tripsAtFourPerYear,
      description: "If four weekends each year became small journeys.",
      icon: MapPinned,
    },
    {
      key: "gatherings",
      label: "Annual gatherings",
      value: lifeData.perspective.annualGatherings,
      description: "If familiar people gathered once every year.",
      icon: UsersRound,
    },
    {
      key: "birthdays",
      label: "Birthdays",
      value: lifeData.perspective.birthdays,
      description: "Returns to the day your story began.",
      icon: Cake,
    },
  ];

  return (
    <section
      className="data-section perspective"
      id="perspective"
      aria-labelledby="perspective-title"
      ref={sectionRef}
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">07</p>

          <div>
            <p className="data-section__eyebrow">Familiar scale</p>

            <h2 className="data-section__title" id="perspective-title">
              Numbers need something human.
            </h2>

            <p className="data-section__introduction">
              Large figures become easier to understand when translated into
              ordinary possibilities.
            </p>
          </div>
        </header>

        <div className="data-grid">
          {perspectiveMetrics.map((metric) => {
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
          <p className="data-note__label">Using age {referenceAge}</p>

          <div>
            <p className="data-note__title">
              Possibility is not an assignment.
            </p>

            <p className="data-note__description">
              These comparisons are not goals, deadlines or productivity advice.
              They are simply another way to understand the selected reference.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Perspective;
