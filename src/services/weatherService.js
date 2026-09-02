const HISTORICAL_WEATHER_ENDPOINT =
  "https://archive-api.open-meteo.com/v1/archive";

const EARLIEST_WEATHER_YEAR = 1940;

const WEATHER_CODE_LABELS = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light rain showers",
  81: "Rain showers",
  82: "Heavy rain showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorms",
  96: "Thunderstorms with hail",
  99: "Heavy thunderstorms with hail",
};

function formatDateForAPI(date) {
  const year = date.getUTCFullYear();

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getWeatherDescription(weatherCode) {
  return WEATHER_CODE_LABELS[weatherCode] ?? "Conditions unavailable";
}

export async function getHistoricalWeather({ birthDate, location, signal }) {
  if (!(birthDate instanceof Date)) {
    throw new TypeError("Birth date must be a valid Date.");
  }

  if (
    !location ||
    !Number.isFinite(location.latitude) ||
    !Number.isFinite(location.longitude)
  ) {
    throw new TypeError("A valid location is required.");
  }

  const birthYear = birthDate.getUTCFullYear();

  if (birthYear < EARLIEST_WEATHER_YEAR) {
    return {
      available: false,

      reason: "Historical weather estimates are available from 1940 onward.",
    };
  }

  const dateValue = formatDateForAPI(birthDate);

  const parameters = new URLSearchParams({
    latitude: String(location.latitude),

    longitude: String(location.longitude),

    start_date: dateValue,
    end_date: dateValue,

    timezone: location.timezone || "UTC",

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "wind_speed_10m_max",
      "sunrise",
      "sunset",
      "daylight_duration",
    ].join(","),

    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const response = await fetch(`${HISTORICAL_WEATHER_ENDPOINT}?${parameters}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Historical weather could not be retrieved.");
  }

  const data = await response.json();

  const daily = data.daily;

  if (!daily || !Array.isArray(daily.time) || daily.time.length === 0) {
    return {
      available: false,

      reason:
        "No historical weather estimate was found for this place and date.",
    };
  }

  const weatherCode = daily.weather_code?.[0];

  return {
    available: true,

    source: "Open-Meteo",

    methodology: "Historical weather reconstruction based on reanalysis data.",

    timezone: data.timezone ?? location.timezone ?? "UTC",

    weatherCode,

    description: getWeatherDescription(weatherCode),

    maximumTemperature: daily.temperature_2m_max?.[0] ?? null,

    minimumTemperature: daily.temperature_2m_min?.[0] ?? null,

    precipitation: daily.precipitation_sum?.[0] ?? null,

    maximumWindSpeed: daily.wind_speed_10m_max?.[0] ?? null,

    sunrise: daily.sunrise?.[0] ?? null,

    sunset: daily.sunset?.[0] ?? null,

    daylightDuration: daily.daylight_duration?.[0] ?? null,
  };
}
