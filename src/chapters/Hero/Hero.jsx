import "./Hero.css";

function Hero() {
  const reflections = [
    "The thing you still call “recent” may already be years behind you.",

    "Some people once filled every day. Now they live in a handful of memories.",

    "Some years changed everything. Others disappeared almost unnoticed.",
  ];

  return (
    <section className="chapter hero" id="home" aria-labelledby="hero-title">
      <div className="chapter__inner hero__inner">
        <header className="hero__header">
          <p className="site-name">Life in Numbers</p>

          <p className="eyebrow">A quiet record of time</p>
        </header>

        <div className="hero__content">
          <div className="hero__heading-group">
            <p className="hero__index">You probably know the feeling.</p>

            <h1 className="display-title hero__title" id="hero-title">
              Where did all that time go?
            </h1>

            <p className="editorial-text hero__description">
              You remember waiting to grow up. Now entire years can feel like
              they happened between one ordinary morning and the next.
            </p>
          </div>

          <div className="hero__information">
            <p className="hero__reflection-label">Things time does quietly</p>

            <div className="hero__reflections">
              {reflections.map((reflection, index) => (
                <blockquote className="hero__reflection" key={reflection}>
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <p>{reflection}</p>
                </blockquote>
              ))}
            </div>

            <a className="hero__start" href="#arrival">
              <span>See my life in numbers</span>

              <span aria-hidden="true">↓</span>
            </a>

            <p className="hero__privacy">
              One date. No account. Nothing stored.
            </p>
          </div>
        </div>

        <footer className="hero__footer">
          <div className="hero__scroll">
            <div className="scroll-line" aria-hidden="true" />

            <span>Scroll to begin</span>
          </div>

          <p className="hero__format">
            The numbers may surprise you. The memories probably will not.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default Hero;
