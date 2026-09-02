import { useRef } from "react";

import { ArrowUpRight } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import { useDateHistory } from "../../hooks/useDateHistory";

import "./DateHistory.css";

function formatHistoricalYear(year) {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }

  return String(year);
}

function DateHistory({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const historyState = useDateHistory(lifeData.birthDate);

  return (
    <section
      ref={sectionRef}
      className="data-section date-history"
      id="date-history"
      aria-labelledby="date-history-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">07</p>

          <div>
            <p className="data-section__eyebrow">On this date in history</p>

            <h2 className="data-section__title" id="date-history-title">
              Before it became yours.
            </h2>

            <p className="data-section__introduction">
              By the time you arrived, this position in the calendar had already
              collected stories of its own.
            </p>
          </div>
        </header>

        {historyState.status === "loading" && (
          <div className="date-history__state" role="status" data-reveal>
            <p>Looking through the archives…</p>
          </div>
        )}

        {(historyState.status === "unavailable" ||
          historyState.status === "error") && (
          <div className="date-history__state" role="status" data-reveal>
            <p>{historyState.message}</p>

            <span>The rest of your story is still available.</span>
          </div>
        )}

        {historyState.status === "success" && (
          <div className="date-history__timeline" data-reveal>
            {historyState.events.map((event) => (
              <article className="date-history__event" key={event.id}>
                <div className="date-history__year">
                  <p>{formatHistoricalYear(event.year)}</p>

                  {event.isBirthYear && <span>Your year</span>}
                </div>

                <div className="date-history__event-content">
                  <p>{event.description}</p>

                  {event.articleTitle && <span>{event.articleTitle}</span>}
                </div>

                {event.articleUrl && (
                  <a
                    className="date-history__link"
                    href={event.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Read more about the ${formatHistoricalYear(
                      event.year
                    )} event on Wikipedia`}
                  >
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                )}
              </article>
            ))}

            <footer className="date-history__source">
              <p>
                Historical entries provided by{" "}
                <a
                  href="https://www.wikipedia.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikipedia
                </a>
                .
              </p>
            </footer>
          </div>
        )}

        <aside className="data-note" data-reveal>
          <p className="data-note__label">Across history</p>

          <div>
            <p className="data-note__title">
              These events share your month and day.
            </p>

            <p className="data-note__description">
              They are not presented as news from the exact day you were born.
              Events from your birth year and earlier are shown, with the most
              recent first.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default DateHistory;
