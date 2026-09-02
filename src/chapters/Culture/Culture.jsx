import { useRef } from "react";

import { ArrowUpRight, Award, Flag, Trophy } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import { useCultureHonours } from "../../hooks/useCultureHonours";

import "./Culture.css";

function Culture({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const { year, era, tournamentChampions } = lifeData.cultureContext;

  const honoursState = useCultureHonours(year);

  const nobelPrize = honoursState.nobelPeacePrize;

  const formulaOne = honoursState.formulaOneChampion;

  const hasSports = tournamentChampions.length > 0 || formulaOne?.available;

  return (
    <section
      ref={sectionRef}
      className="data-section culture"
      id="culture"
      aria-labelledby="culture-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">10</p>

          <div>
            <p className="data-section__eyebrow">The world you joined</p>

            <h2 className="data-section__title" id="culture-title">
              A year already in motion.
            </h2>

            <p className="data-section__introduction">
              Championships were being decided, honours were being awarded and
              the culture around you was continuing to change.
            </p>
          </div>
        </header>

        <article className="culture__era" data-reveal>
          <div className="culture__heading">
            <p className="culture__label">The era you joined</p>

            <Flag size={21} strokeWidth={1.4} aria-hidden="true" />
          </div>

          <p className="culture__era-year">{year}</p>

          <p className="culture__era-description">{era.description}</p>
        </article>

        {honoursState.status === "loading" && (
          <div className="culture__state" role="status" data-reveal>
            <p>Looking through the records from {year}…</p>
          </div>
        )}

        {honoursState.status !== "loading" && (
          <div className="culture__records">
            <section
              className="culture__record-group"
              aria-labelledby="culture-champions-title"
              data-reveal
            >
              <div className="culture__heading">
                <h3 className="culture__label" id="culture-champions-title">
                  Champions when you arrived
                </h3>

                <Trophy size={21} strokeWidth={1.4} aria-hidden="true" />
              </div>

              {hasSports ? (
                <div className="culture__record-list">
                  {formulaOne?.available && (
                    <article className="culture__record">
                      <div>
                        <p className="culture__record-label">
                          Formula One Champion of your birth year
                        </p>

                        <p className="culture__record-value">
                          {formulaOne.driver}
                        </p>

                        {formulaOne.constructor && (
                          <p className="culture__record-note">
                            {formulaOne.constructor}
                          </p>
                        )}
                      </div>

                      <a
                        href={formulaOne.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View Formula One standings for ${year}`}
                      >
                        <ArrowUpRight
                          size={18}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </a>
                    </article>
                  )}

                  {tournamentChampions.map((champion) => (
                    <article className="culture__record" key={champion.id}>
                      <div>
                        <p className="culture__record-label">
                          {champion.competition}
                        </p>

                        <p className="culture__record-value">
                          {champion.winner}
                        </p>

                        <p className="culture__record-note">
                          Title won in {champion.titleYear}
                        </p>
                      </div>

                      <a
                        href={champion.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${champion.competition} records`}
                      >
                        <ArrowUpRight
                          size={18}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </a>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="culture__unavailable">
                  No selected championship record is available for this year.
                </p>
              )}
            </section>

            <section
              className="culture__record-group"
              aria-labelledby="culture-honours-title"
              data-reveal
            >
              <div className="culture__heading">
                <h3 className="culture__label" id="culture-honours-title">
                  Awards and honours
                </h3>

                <Award size={21} strokeWidth={1.4} aria-hidden="true" />
              </div>

              {nobelPrize?.available ? (
                <article className="culture__nobel">
                  <p className="culture__record-label">Nobel Peace Prize</p>

                  <div className="culture__laureates">
                    {nobelPrize.laureates.map((laureate) => (
                      <div className="culture__laureate" key={laureate.id}>
                        <p className="culture__record-value">{laureate.name}</p>

                        {laureate.motivation && (
                          <p className="culture__record-note">
                            {laureate.motivation}
                          </p>
                        )}

                        {laureate.sourceUrl && (
                          <a
                            href={laureate.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Nobel Prize profile{" "}
                            <ArrowUpRight
                              size={15}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  <a
                    className="culture__source-link"
                    href={nobelPrize.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View the official prize record
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                </article>
              ) : (
                <p className="culture__unavailable">
                  {nobelPrize?.reason ??
                    "No Nobel Peace Prize record is available."}
                </p>
              )}
            </section>
          </div>
        )}

        <aside className="data-note" data-reveal>
          <p className="data-note__label">Selected records</p>

          <div>
            <p className="data-note__title">
              A year contains more than any page can show.
            </p>

            <p className="data-note__description">
              These are selected, verifiable reference points. They are not
              intended to represent every country, sport, achievement or
              cultural experience from that year.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Culture;
