import { useState } from "react";

import { ArrowUpRight, CircleHelp, RotateCcw } from "lucide-react";

import { formatDisplayDate, formatWholeNumber } from "../../utils/numberFormat";

import "./Today.css";

function Today({ lifeData, onReadAgain, onAnotherDate, onStartOver }) {
  const [showExplanation, setShowExplanation] = useState(false);

  const formattedBirthDate = formatDisplayDate(lifeData.birthDate);

  const formattedDays = formatWholeNumber(lifeData.lived.days);

  return (
    <section className="today" id="today" aria-labelledby="today-title">
      <div className="today__container">
        <div className="today__visual-area">
          <div className="today__visual" aria-hidden="true">
            <p className="today__word">Today</p>

            <p className="today__number">1</p>
          </div>
          {/* 
          <button
            className="today__explain-button"
            type="button"
            aria-expanded={showExplanation}
            aria-controls="today-explanation"
            onClick={() => setShowExplanation((current) => !current)}
          >
            <CircleHelp size={20} strokeWidth={1.5} aria-hidden="true" />

            <span>Explain this</span>
          </button>

          {showExplanation && (
            <p className="today__explanation" id="today-explanation">
              Future figures were reference points. Today is different: it is
              the one unit of time currently available to you.
            </p>
          )} */}
        </div>

        <div className="today__summary">
          <p className="today__summary-label">A personal summary</p>

          <h2 className="today__title" id="today-title">
            You have been here for approximately <em>{formattedDays} days</em>,
            since {formattedBirthDate}.
          </h2>

          <p className="today__description">
            The future figures were only a reference. This one is more certain:
            today is the only square asking to be noticed.
          </p>

          <div className="today__actions">
            <button
              className="today__primary-action"
              type="button"
              onClick={onReadAgain}
            >
              <span>Read it again</span>

              <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <button
              className="today__secondary-action"
              type="button"
              onClick={onAnotherDate}
            >
              <RotateCcw size={20} strokeWidth={1.5} aria-hidden="true" />

              <span>Another date</span>
            </button>
          </div>
        </div>

        <footer className="today__footer">
          <p>Life in Numbers / An almanac for the living.</p>

          <p className="today__privacy">No data leaves this page.</p>
        </footer>
      </div>

      <div className="today__bottom-bar">
        <button
          className="today__start-over"
          type="button"
          onClick={onStartOver}
        >
          <RotateCcw size={19} strokeWidth={1.5} aria-hidden="true" />

          <span>Start over</span>
        </button>

        {/* <div className="today__progress" aria-label="Journey complete">
          <span />
          <span />
          <span />
          <span />
          <span className="is-active" />
        </div> */}
      </div>
    </section>
  );
}

export default Today;
