import { useRef } from "react";

import { ArrowUpRight, Music2 } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import { useBirthWeekSoundtrack } from "../../hooks/useBirthWeekSoundtrack";

import { formatDisplayDate } from "../../utils/numberFormat";

import "./Soundtrack.css";

function formatChartDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00Z`);

  return formatDisplayDate(date);
}

function Soundtrack({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const soundtrackState = useBirthWeekSoundtrack(lifeData.birthDate);

  const soundtrack = soundtrackState.data;

  return (
    <section
      ref={sectionRef}
      className="data-section soundtrack"
      id="soundtrack"
      aria-labelledby="soundtrack-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">06</p>

          <div>
            <p className="data-section__eyebrow">The soundtrack</p>

            <h2 className="data-section__title" id="soundtrack-title">
              The song leading the chart.
            </h2>

            <p className="data-section__introduction">
              While your story was beginning, another song was sitting at number
              one in the United States.
            </p>
          </div>
        </header>

        {soundtrackState.status === "loading" && (
          <div className="soundtrack__state" role="status" data-reveal>
            <p>Finding the chart from that week…</p>
          </div>
        )}

        {(soundtrackState.status === "unavailable" ||
          soundtrackState.status === "error") && (
          <div className="soundtrack__state" role="status" data-reveal>
            <p>{soundtrackState.message}</p>

            <span>The rest of your story is still available.</span>
          </div>
        )}

        {soundtrackState.status === "success" && soundtrack && (
          <article className="soundtrack__feature" data-reveal>
            <div className="soundtrack__symbol" aria-hidden="true">
              <Music2 size={42} strokeWidth={1.2} />

              <span />
            </div>

            <div className="soundtrack__information">
              <p className="soundtrack__chart-label">
                #1 on the {soundtrack.chartName}
              </p>

              <h3 className="soundtrack__song">“{soundtrack.song}”</h3>

              <p className="soundtrack__artist">{soundtrack.artist}</p>

              <p className="soundtrack__week">
                Chart dated {formatChartDate(soundtrack.chartDate)}
              </p>

              <div className="soundtrack__actions">
                <a
                  href={soundtrack.links.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Find on Spotify</span>

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={soundtrack.links.youtube}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Find on YouTube</span>

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            <footer className="soundtrack__sources">
              <a
                href={soundtrack.officialChartUrl}
                target="_blank"
                rel="noreferrer"
              >
                View official Billboard chart
              </a>

              <a href={soundtrack.archiveUrl} target="_blank" rel="noreferrer">
                View archive record
              </a>
            </footer>
          </article>
        )}

        <aside className="data-note" data-reveal>
          <p className="data-note__label">A U.S. chart reference</p>

          <div>
            <p className="data-note__title">
              Number one does not mean everyone heard the same song.
            </p>

            <p className="data-note__description">
              This uses the U.S. Billboard Hot 100 chart dated most recently on
              or before your birth date. It is a cultural reference, not a
              worldwide listening record.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Soundtrack;
