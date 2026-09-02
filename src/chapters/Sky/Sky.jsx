import { useRef } from "react";

import { CloudSun, Droplets, Leaf, Moon, Sunrise, Sunset } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";

import { useHistoricalWeather } from "../../hooks/useHistoricalWeather";

import { formatWholeNumber } from "../../utils/numberFormat";
import { calculateMoonPhase } from "../../utils/moonCalculations";
import "./Sky.css";

function formatTemperature(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${Math.round(value)}°`;
}

function formatMeasurement(value, unit) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(1)} ${unit}`;
}

function formatClockTime(value) {
  if (!value || !value.includes("T")) {
    return "—";
  }

  const time = value.split("T")[1];

  if (!time) {
    return "—";
  }

  const [hourValue, minute] = time.split(":");

  const hour = Number(hourValue);

  if (!Number.isFinite(hour)) {
    return "—";
  }

  const period = hour >= 12 ? "PM" : "AM";

  const twelveHour = hour % 12 || 12;

  return `${twelveHour}:${minute} ${period}`;
}

function formatDaylight(seconds) {
  if (!Number.isFinite(seconds)) {
    return "";
  }

  const totalMinutes = Math.round(seconds / 60);

  const hours = Math.floor(totalMinutes / 60);

  const minutes = totalMinutes % 60;

  return `${hours} hours and ${minutes} minutes of daylight`;
}

function Sky({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const weatherState = useHistoricalWeather(
    lifeData.birthDate,
    lifeData.arrival.location
  );
  const birthMoon = calculateMoonPhase(lifeData.birthDate);
  const moonName = birthMoon.name.toLowerCase();
  const moonDescription = moonName.endsWith("moon")
    ? moonName
    : `${moonName} moon`;

  const skyMetrics = [
    {
      key: "sunrises",
      label: "Sunrises",
      value: lifeData.estimated.sunrises,
      description:
        "An approximate count of mornings since the day you arrived.",
      icon: Sunrise,
    },
    {
      key: "full-moons",
      label: "Full moons",
      value: lifeData.estimated.fullMoons,
      description: "Estimated using the average length of a lunar cycle.",
      icon: Moon,
    },
    {
      key: "seasons",
      label: "Seasons",
      value: lifeData.estimated.seasons,
      description: "Spring, summer, autumn and winter returning in sequence.",
      icon: Leaf,
    },
  ];

  const weather = weatherState.data;

  return (
    <section
      ref={sectionRef}
      className="data-section sky"
      id="sky"
      aria-labelledby="sky-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">04</p>

          <div>
            <p className="data-section__eyebrow">Above your beginning</p>

            <h2 className="data-section__title" id="sky-title">
              The sky was already in motion.
            </h2>

            <p className="data-section__introduction">
              There was weather over the place you arrived. Morning became
              evening, and the cycles continued from there.
            </p>
          </div>
        </header>
        <div className="sky__birth-moon" data-reveal>
          <Moon
            className="sky__birth-moon-icon"
            size={32}
            strokeWidth={1.25}
            aria-hidden="true"
          />

          <div>
            <p className="sky__birth-moon-label">The moon that day</p>

            <p className="sky__birth-moon-statement">
              A {moonDescription} hung over {lifeData.arrival.location.name}.
            </p>
          </div>

          <p className="sky__birth-moon-value">
            <strong>{birthMoon.illuminationPercentage}%</strong>

            <span>illuminated</span>
          </p>
        </div>
        <div className="sky__weather" data-reveal>
          <div className="sky__weather-heading">
            <div>
              <p className="sky__weather-eyebrow">The air around you</p>

              <h3 className="sky__weather-title">
                The weather you arrived to.
              </h3>
            </div>

            <CloudSun
              className="sky__weather-icon"
              size={30}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </div>

          {weatherState.status === "loading" && (
            <div className="sky__weather-state" role="status">
              <p>Returning to the weather of that day…</p>
            </div>
          )}

          {(weatherState.status === "unavailable" ||
            weatherState.status === "error") && (
            <div className="sky__weather-state" role="status">
              <p>{weatherState.message}</p>

              <span>Your other life calculations are still available.</span>
            </div>
          )}

          {weatherState.status === "success" && weather && (
            <>
              <div className="sky__weather-main">
                <div>
                  <p className="sky__condition">{weather.description}</p>

                  <p className="sky__weather-place">
                    {lifeData.arrival.location.name},{" "}
                    {lifeData.arrival.location.country}
                  </p>
                </div>

                <div className="sky__temperature">
                  <p>
                    {formatTemperature(weather.minimumTemperature)}/{" "}
                    {formatTemperature(weather.maximumTemperature)}
                  </p>

                  <span>Celsius</span>
                </div>
              </div>

              <div className="sky__weather-details">
                <article className="sky__weather-detail">
                  <Droplets size={18} strokeWidth={1.5} aria-hidden="true" />

                  <div>
                    <p>Precipitation</p>

                    <strong>
                      {formatMeasurement(weather.precipitation, "mm")}
                    </strong>
                  </div>
                </article>

                <article className="sky__weather-detail">
                  <Sunrise size={18} strokeWidth={1.5} aria-hidden="true" />

                  <div>
                    <p>Sunrise</p>

                    <strong>{formatClockTime(weather.sunrise)}</strong>
                  </div>
                </article>

                <article className="sky__weather-detail">
                  <Sunset size={18} strokeWidth={1.5} aria-hidden="true" />

                  <div>
                    <p>Sunset</p>

                    <strong>{formatClockTime(weather.sunset)}</strong>
                  </div>
                </article>
              </div>

              <p className="sky__daylight">
                {formatDaylight(weather.daylightDuration)}.
              </p>

              <p className="sky__weather-source">
                Reconstructed historical estimate using reanalysis data.{" "}
                <a
                  href="https://open-meteo.com/en/docs/historical-weather-api"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source: Open-Meteo
                </a>
              </p>
            </>
          )}
        </div>

        <div className="sky__lifetime-heading" data-reveal>
          <p>And the sky kept returning</p>

          <span>Approximate lifetime totals</span>
        </div>

        <div className="data-grid">
          {skyMetrics.map((metric) => {
            const MetricIcon = metric.icon;

            return (
              <article className="data-metric" key={metric.key} data-reveal>
                <div className="data-metric__top">
                  <p className="data-metric__label">{metric.label}</p>

                  <MetricIcon
                    className="data-metric__icon"
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                <p className="data-metric__value">
                  {formatWholeNumber(metric.value)}
                </p>

                <p className="data-metric__description">{metric.description}</p>
              </article>
            );
          })}
        </div>

        <aside className="data-note" data-reveal>
          <p className="data-note__label">Approximate by design</p>

          <div>
            <p className="data-note__title">
              Weather and astronomical cycles require context.
            </p>

            <p className="data-note__description">
              The birth-day moon uses noon UTC because no exact birth time was
              entered. Historical weather is a modelled reconstruction for the
              selected coordinates. Lifetime totals communicate scale rather
              than astronomical precision.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Sky;
