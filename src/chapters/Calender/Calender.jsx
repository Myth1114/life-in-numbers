import { useRef } from "react";
import { CalendarCheck, Cake, PartyPopper, Coffee } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";
import { formatWholeNumber } from "../../utils/numberFormat";

function Calendar({ lifeData }) {
  const calendarMetrics = [
    {
      key: "weekends",
      label: "Weekends",
      value: lifeData.calendar.weekends,
      description: "Saturdays marking the arrival of another weekend.",
      icon: CalendarCheck,
    },
    {
      key: "birthdays",
      label: "Birthdays",
      value: lifeData.calendar.birthdays,
      description: "Completed returns to the date you arrived.",
      icon: Cake,
    },
    {
      key: "newYears",
      label: "New Years",
      value: lifeData.calendar.newYears,
      description: "Calendar years that changed their names.",
      icon: PartyPopper,
    },
    {
      key: "mondays",
      label: "Mondays",
      value: lifeData.calendar.mondays,
      description: "Somehow, you survived all of them.",
      icon: Coffee,
    },
  ];
  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);

  return (
    <section
      className="data-section calendar"
      id="calendar"
      aria-labelledby="calendar-title"
      ref={sectionRef}
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">05</p>

          <div>
            <p className="data-section__eyebrow">Familiar measures</p>

            <h2 className="data-section__title" id="calendar-title">
              Calendar moments
            </h2>

            <p className="data-section__introduction">
              Dates give names to time. Some become celebrations, some become
              routines, and some are simply Mondays.
            </p>
          </div>
        </header>

        <div className="data-grid">
          {calendarMetrics.map((metric) => {
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
          <p className="data-note__label">A human calendar</p>

          <div>
            <p className="data-note__title">
              We gave the passing days names so we could find them again.
            </p>

            <p className="data-note__description">
              A Monday and a birthday contain the same number of hours. What
              changes is the meaning we place around them.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Calendar;
