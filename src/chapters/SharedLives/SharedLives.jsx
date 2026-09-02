import { useRef } from "react";

import { ArrowUpRight } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import { useSharedBirthdays } from "../../hooks/useSharedBirthdays";

import "./SharedLives.css";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SharedLives({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const peopleState = useSharedBirthdays(lifeData.birthDate);

  return (
    <section
      ref={sectionRef}
      className="data-section shared-lives"
      id="shared-lives"
      aria-labelledby="shared-lives-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">08</p>

          <div>
            <p className="data-section__eyebrow">Born under the same date</p>

            <h2 className="data-section__title" id="shared-lives-title">
              You share this date with these lives.
            </h2>

            <p className="data-section__introduction">
              Different years, places and stories began on the same position in
              the calendar.
            </p>
          </div>
        </header>

        {peopleState.status === "loading" && (
          <div className="shared-lives__state" role="status" data-reveal>
            <p>Looking through the calendar…</p>
          </div>
        )}

        {(peopleState.status === "unavailable" ||
          peopleState.status === "error") && (
          <div className="shared-lives__state" role="status" data-reveal>
            <p>{peopleState.message}</p>

            <span>The rest of your story is still available.</span>
          </div>
        )}

        {peopleState.status === "success" && (
          <div className="shared-lives__list" data-reveal>
            {peopleState.people.map((person) => (
              <article className="shared-lives__person" key={person.id}>
                <div className="shared-lives__portrait" aria-hidden="true">
                  <span>{getInitials(person.name)}</span>

                  {person.image && (
                    <img
                      src={person.image}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  )}
                </div>

                <div className="shared-lives__identity">
                  <h3>{person.name}</h3>

                  <p>{person.description}</p>
                </div>

                <p className="shared-lives__year">
                  {person.isSameYear ? "Your year" : person.year}
                </p>

                {person.articleUrl && (
                  <a
                    className="shared-lives__link"
                    href={person.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Read about ${person.name} on Wikipedia`}
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

            <footer className="shared-lives__source">
              <p>
                Birth dates and biographical descriptions provided by{" "}
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
          <p className="data-note__label">A shared calendar date</p>

          <div>
            <p className="data-note__title">
              Sharing a birthday does not mean sharing the same year.
            </p>

            <p className="data-note__description">
              “Your year” marks someone born in the same year. Everyone else
              shares only the month and day. Wikimedia records can be incomplete
              or change over time.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default SharedLives;
