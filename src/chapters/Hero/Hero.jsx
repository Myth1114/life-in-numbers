import "./Hero.css";

function Hero() {
  return (
    <section className="chapter hero" id="home">
      <div className="chapter__inner hero__inner">
        <header className="hero__header">
          <p className="site-name">Life in Numbers</p>
          <p className="eyebrow">An interactive story about time</p>
        </header>
        <div className="hero__content">
          <div className="hero__heading-group">
            <p className="hero__index">Est. now</p>
            <h1 className="display-title hero__title">
              Your life, measured differently.
            </h1>
          </div>
          <div className="hero__information">
            <p className="editorial-text hero__description">
              A cinematic journey that turns the time you have lived into days,
              weeks, seasons, heartbeats and ordinary moments you can see.
            </p>

            <p className="body-text hero__privacy">
              No prediction. No account. Your date of birth is calculated
              locally and never leaves your browser.
            </p>

            <a className="hero__start" href="#arrival">
              <span>Begin the story</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <footer className="hero__footer">
          <div className="hero__scroll">
            <div className="scroll-line" aria-hidden="true" />
            <span>Scroll to begin</span>
          </div>
          <p className="hero__format">Days become dots. Weeks become years.</p>
        </footer>
      </div>
    </section>
  );
}

export default Hero;
