import { useState } from "react";

import {
  EARLIEST_ALLOWED_DATE,
  getTodayInputValue,
  validateBirthDate,
} from "../../utils/dateUtils";

import "./Arrival.css";

function Arrival({ onComplete }) {
  const [birthDate, setBirthDate] = useState("");

  const [error, setError] = useState("");

  function handleDateChange(event) {
    setBirthDate(event.target.value);

    if (error) {
      setError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateBirthDate(birthDate);

    if (validationMessage) {
      setError(validationMessage);

      return;
    }

    setError("");

    onComplete(birthDate);
  }

  return (
    <section
      className="chapter arrival"
      id="arrival"
      aria-labelledby="arrival-title"
    >
      <div className="chapter__inner arrival__inner">
        <header className="arrival__header">
          <p className="site-name">Life in Numbers</p>

          <p className="chapter-label">00 / Arrival</p>
        </header>

        <div className="arrival__content">
          <div className="arrival__introduction">
            <h2 className="display-title" id="arrival-title">
              How long have you been here?
            </h2>

            <p className="editorial-text arrival__description">
              Enter the day you arrived. We will turn the time between then and
              today into something you can see.
            </p>
          </div>

          <form className="arrival__form" onSubmit={handleSubmit} noValidate>
            <div className="date-field">
              <label className="field-label" htmlFor="birth-date">
                Enter your date of birth
              </label>

              <input
                className="date-field__input"
                id="birth-date"
                name="birthDate"
                type="date"
                value={birthDate}
                min={EARLIEST_ALLOWED_DATE}
                max={getTodayInputValue()}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? "birth-date-error" : "birth-date-hint"
                }
                onChange={handleDateChange}
              />

              <p className="date-field__hint" id="birth-date-hint">
                DD / MM / YYYY
              </p>

              <p
                className="field-error"
                id="birth-date-error"
                role={error ? "alert" : undefined}
              >
                {error}
              </p>
            </div>

            <button className="primary-button" type="submit">
              <span>See my life</span>

              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        <footer className="arrival__footer">
          <p className="privacy-note">Your date stays in your browser.</p>
        </footer>
      </div>
    </section>
  );
}

export default Arrival;
