import { useEffect, useRef, useState } from "react";

import { getTodayInputValue, validateBirthDate } from "../../utils/dateUtils";

import {
  formatLocationLabel,
  searchLocations,
} from "../../services/geocodingService";

import "./Arrival.css";

const SEARCH_DELAY = 350;

function Arrival({ onComplete }) {
  const [birthDate, setBirthDate] = useState("");

  const [locationQuery, setLocationQuery] = useState("");

  const [locationResults, setLocationResults] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [activeIndex, setActiveIndex] = useState(-1);

  const [isSearching, setIsSearching] = useState(false);

  const [dateError, setDateError] = useState("");

  const [locationError, setLocationError] = useState("");

  const searchTimerRef = useRef(null);
  const requestControllerRef = useRef(null);

  const listboxId = "birthplace-results";

  useEffect(() => {
    return () => {
      window.clearTimeout(searchTimerRef.current);

      requestControllerRef.current?.abort();
    };
  }, []);

  function cancelPendingSearch() {
    window.clearTimeout(searchTimerRef.current);

    requestControllerRef.current?.abort();
  }

  async function performLocationSearch(query) {
    requestControllerRef.current = new AbortController();

    setIsSearching(true);

    try {
      const results = await searchLocations(
        query,
        requestControllerRef.current.signal
      );

      setLocationResults(results);
      setActiveIndex(results.length > 0 ? 0 : -1);

      if (results.length === 0) {
        setLocationError("No matching places were found.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setLocationResults([]);
        setActiveIndex(-1);

        setLocationError(
          "We could not search for that place. Please try again."
        );
      }
    } finally {
      setIsSearching(false);
    }
  }

  function handleDateChange(event) {
    setBirthDate(event.target.value);

    if (dateError) {
      setDateError("");
    }
  }

  function handleLocationChange(event) {
    const nextQuery = event.target.value;

    cancelPendingSearch();

    setLocationQuery(nextQuery);
    setSelectedLocation(null);
    setLocationResults([]);
    setActiveIndex(-1);
    setLocationError("");

    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery.length < 3) {
      setIsSearching(false);
      return;
    }

    searchTimerRef.current = window.setTimeout(() => {
      performLocationSearch(trimmedQuery);
    }, SEARCH_DELAY);
  }

  function handleLocationSelect(location) {
    cancelPendingSearch();

    setSelectedLocation(location);

    setLocationQuery(formatLocationLabel(location));

    setLocationResults([]);
    setActiveIndex(-1);
    setIsSearching(false);
    setLocationError("");
  }

  function handleLocationKeyDown(event) {
    if (locationResults.length === 0) {
      if (event.key === "Escape") {
        setLocationResults([]);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) =>
        current >= locationResults.length - 1 ? 0 : current + 1
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        current <= 0 ? locationResults.length - 1 : current - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      handleLocationSelect(locationResults[activeIndex]);
    }

    if (event.key === "Escape") {
      event.preventDefault();

      setLocationResults([]);
      setActiveIndex(-1);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateBirthDate(birthDate);

    setDateError(validationMessage);

    if (!selectedLocation) {
      setLocationError("Choose your birthplace from the suggestions.");
    }

    if (validationMessage || !selectedLocation) {
      return;
    }

    onComplete({
      birthDate,
      location: selectedLocation,
    });
  }

  const showResults = locationResults.length > 0;

  const activeOptionId =
    activeIndex >= 0 ? `birthplace-option-${activeIndex}` : undefined;

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
              Where did your story begin?
            </h2>

            <p className="editorial-text arrival__description">
              Enter the day and place you arrived. We will return to the world
              as it was then.
            </p>
          </div>

          <form className="arrival__form" onSubmit={handleSubmit} noValidate>
            <div className="date-field">
              <label className="field-label" htmlFor="birth-date">
                Date of birth
              </label>

              <input
                className="date-field__input"
                id="birth-date"
                name="birthDate"
                type="date"
                value={birthDate}
                min="1900-01-01"
                max={getTodayInputValue()}
                required
                aria-invalid={Boolean(dateError)}
                aria-describedby={
                  dateError ? "birth-date-error" : "birth-date-hint"
                }
                onChange={handleDateChange}
              />

              <p className="date-field__hint" id="birth-date-hint">
                DD / MM / YYYY
              </p>

              <p
                className="field-error"
                id="birth-date-error"
                aria-live="polite"
              >
                {dateError}
              </p>
            </div>

            <div className="location-field">
              <label className="field-label" htmlFor="birthplace">
                Birthplace
              </label>

              <div className="location-field__control">
                <input
                  className="date-field__input location-field__input"
                  id="birthplace"
                  name="birthplace"
                  type="text"
                  value={locationQuery}
                  placeholder="Start typing a city"
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showResults}
                  aria-controls={listboxId}
                  aria-activedescendant={activeOptionId}
                  aria-invalid={Boolean(locationError)}
                  aria-describedby="birthplace-status birthplace-error"
                  onChange={handleLocationChange}
                  onKeyDown={handleLocationKeyDown}
                />

                {isSearching && (
                  <span
                    className="location-field__searching"
                    aria-hidden="true"
                  >
                    Searching…
                  </span>
                )}

                {showResults && (
                  <ul
                    className="location-field__results"
                    id={listboxId}
                    role="listbox"
                    aria-label="Birthplace suggestions"
                  >
                    {locationResults.map((location, index) => (
                      <li
                        id={`birthplace-option-${index}`}
                        key={location.id}
                        role="option"
                        aria-selected={index === activeIndex}
                      >
                        <button
                          type="button"
                          className={
                            index === activeIndex
                              ? "location-field__option is-active"
                              : "location-field__option"
                          }
                          onMouseDown={(event) => {
                            event.preventDefault();

                            handleLocationSelect(location);
                          }}
                        >
                          <span>{location.name}</span>

                          <small>
                            {[location.admin1, location.country]
                              .filter(Boolean)
                              .join(", ")}
                          </small>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p
                className="date-field__hint"
                id="birthplace-status"
                aria-live="polite"
              >
                {isSearching
                  ? "Searching for places."
                  : selectedLocation
                  ? `${formatLocationLabel(selectedLocation)} selected.`
                  : "Select a place from the suggestions."}
              </p>

              <p
                className="field-error"
                id="birthplace-error"
                aria-live="polite"
              >
                {locationError}
              </p>
            </div>

            <button className="primary-button" type="submit">
              <span>Return to that day</span>

              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        <footer className="arrival__footer">
          <button className="text-button" type="button">
            What is this?
          </button>

          <p className="privacy-note">
            No account. Nothing saved by us. Your date and selected city are
            used only to build your story.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default Arrival;
