import { useRef } from "react";

import LifeGridCanvas from "../../visaulizations/LifeGridCanvas";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import "./LifeWeeks.css";

function LifeWeeks({ lifeData }) {
  const lifespan = lifeData.reference.lifespan;

  const totalReferenceWeeks = lifespan * 52;

  const livedWeeks = Math.min(lifeData.lived.weeks, totalReferenceWeeks);

  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="data-section life-weeks"
      id="life-weeks"
      aria-labelledby="life-weeks-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">05</p>

          <div>
            <p className="data-section__eyebrow">One square, one week</p>

            <h2 className="data-section__title" id="life-weeks-title">
              The life grid
            </h2>

            <p className="data-section__introduction">
              A day is easy to lose inside a number. Weeks leave a more visible
              pattern.
            </p>
          </div>
        </header>

        <div className="life-weeks__information" data-reveal>
          <p>One square = one week</p>

          <p>
            {livedWeeks.toLocaleString()}
            {" of "}
            {totalReferenceWeeks.toLocaleString()}
            {" reference weeks marked"}
          </p>
        </div>

        <div className="life-weeks__legend" data-reveal>
          <div className="life-weeks__legend-item">
            <span
              className="
                life-weeks__mark
                life-weeks__mark--lived
              "
              aria-hidden="true"
            />

            <span>Lived</span>
          </div>

          <div className="life-weeks__legend-item">
            <span
              className="
                life-weeks__mark
                life-weeks__mark--current
              "
              aria-hidden="true"
            />

            <span>Current week</span>
          </div>

          <div className="life-weeks__legend-item">
            <span
              className="
                life-weeks__mark
                life-weeks__mark--reference
              "
              aria-hidden="true"
            />

            <span>Reference future</span>
          </div>
        </div>

        <div className="life-weeks__canvas-container">
          <LifeGridCanvas livedWeeks={livedWeeks} lifespan={lifespan} />
        </div>

        <aside className="data-note" data-reveal>
          <p className="data-note__label">Reference, not prediction</p>

          <div>
            <p className="data-note__title">
              This grid uses age {lifespan} as a line on the page.
            </p>

            <p className="data-note__description">
              The outlined weeks do not claim to know the future. They exist
              only to make scale visible.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default LifeWeeks;
