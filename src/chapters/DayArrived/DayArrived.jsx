import { useRef } from "react";

import { formatDisplayDate, formatWeekday } from "../../utils/numberFormat";

import { formatLocationLabel } from "../../services/geocodingService";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import "./DayArrived.css";

function DayArrived({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const birthDate = lifeData.birthDate;

  const location = lifeData.arrival.location;

  const formattedDate = formatDisplayDate(birthDate);

  const weekday = formatWeekday(birthDate);

  const birthYear = birthDate.getUTCFullYear();

  const locationLabel = formatLocationLabel(location);

  return (
    <section
      className="chapter day-arrived"
      id="day-arrived"
      ref={sectionRef}
      aria-labelledby="day-arrived-title"
    >
      <div className="chapter__inner day-arrived__inner">
        <header className="day-arrived__header" data-reveal>
          <p className="site-name">Life in Numbers</p>

          <p className="chapter-label">01 / The beginning</p>
        </header>

        <div className="day-arrived__content">
          <div className="day-arrived__introduction" data-reveal>
            <p className="day-arrived__eyebrow">The day, made yours</p>

            <h2 className="day-arrived__title" id="day-arrived-title">
              You entered the world on
            </h2>
          </div>

          <div className="day-arrived__date" data-reveal>
            <p>{formattedDate}</p>

            <span>{locationLabel}</span>
          </div>

          <div className="day-arrived__details" data-reveal>
            <article className="day-arrived__detail">
              <p className="day-arrived__detail-label">Day</p>

              <p className="day-arrived__detail-value">{weekday}</p>
            </article>

            <article className="day-arrived__detail">
              <p className="day-arrived__detail-label">Year</p>

              <p className="day-arrived__detail-value">{birthYear}</p>
            </article>

            <article className="day-arrived__detail">
              <p className="day-arrived__detail-label">Place</p>

              <p className="day-arrived__detail-value">{location.name}</p>

              <p className="day-arrived__detail-note">
                {[location.admin1, location.country]
                  .filter(Boolean)
                  .filter(
                    (value, index, values) => values.indexOf(value) === index
                  )
                  .join(", ")}
              </p>
            </article>
          </div>
        </div>

        <footer className="day-arrived__footer" data-reveal>
          <p>The world was already in motion.</p>

          <p>Then this date became part of your story.</p>
        </footer>
      </div>
    </section>
  );
}

export default DayArrived;
