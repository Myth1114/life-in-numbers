import { useRef } from "react";

import { Flower2, Gem, Orbit, Sparkles } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import "./ArrivalContext.css";

function ArrivalContext({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const { generation, westernZodiac, chineseZodiac, traditions } =
    lifeData.arrivalContext;

  return (
    <section
      ref={sectionRef}
      className="data-section arrival-context"
      id="arrival-context"
      aria-labelledby="arrival-context-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">09</p>

          <div>
            <p className="data-section__eyebrow">The year, made personal</p>

            <h2 className="data-section__title" id="arrival-context-title">
              Small things attached to your beginning.
            </h2>

            <p className="data-section__introduction">
              Generations and traditions are imperfect ways of grouping a life.
              Still, these were some of the labels waiting when you arrived.
            </p>
          </div>
        </header>

        <article className="arrival-context__generation" data-reveal>
          <div className="arrival-context__generation-heading">
            <p className="arrival-context__label">Your generation</p>

            <Sparkles size={22} strokeWidth={1.4} aria-hidden="true" />
          </div>

          <p className="arrival-context__generation-name">{generation.name}</p>

          <p className="arrival-context__generation-years">
            {generation.start}
            {" — "}
            {generation.end}
          </p>

          <p className="arrival-context__generation-description">
            {generation.description}
          </p>
        </article>

        <div className="arrival-context__traditions">
          <article className="arrival-context__tradition" data-reveal>
            <div className="arrival-context__tradition-heading">
              <p className="arrival-context__label">Western zodiac</p>

              <Orbit size={20} strokeWidth={1.4} aria-hidden="true" />
            </div>

            <p className="arrival-context__value">{westernZodiac.name}</p>

            <p className="arrival-context__secondary">
              {westernZodiac.element}
            </p>
          </article>

          <article className="arrival-context__tradition" data-reveal>
            <div className="arrival-context__tradition-heading">
              <p className="arrival-context__label">Chinese zodiac</p>

              <Sparkles size={20} strokeWidth={1.4} aria-hidden="true" />
            </div>

            <p className="arrival-context__value">
              Year of the {chineseZodiac.animal}
            </p>

            <p className="arrival-context__secondary">
              {chineseZodiac.element}
              {" · "}
              {chineseZodiac.year}
            </p>
          </article>

          <article className="arrival-context__tradition" data-reveal>
            <div className="arrival-context__tradition-heading">
              <p className="arrival-context__label">Birthstone</p>

              <Gem size={20} strokeWidth={1.4} aria-hidden="true" />
            </div>

            <p className="arrival-context__value">{traditions.stone}</p>
          </article>

          <article className="arrival-context__tradition" data-reveal>
            <div className="arrival-context__tradition-heading">
              <p className="arrival-context__label">Birth flower</p>

              <Flower2 size={20} strokeWidth={1.4} aria-hidden="true" />
            </div>

            <p className="arrival-context__value">{traditions.flower}</p>
          </article>
        </div>

        <aside className="data-note" data-reveal>
          <p className="data-note__label">Traditions, not measurements</p>

          <div>
            <p className="data-note__title">
              These labels do not define a person.
            </p>

            <p className="data-note__description">
              Generation boundaries, zodiac systems, birthstones and birth
              flowers vary between sources and cultures. They are included as
              historical traditions, not scientific conclusions.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ArrivalContext;
