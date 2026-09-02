const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

function normalizeLocation(location) {
  return {
    id: location.id,
    name: location.name,
    admin1: location.admin1 ?? "",
    country: location.country ?? "",
    countryCode: location.country_code ?? "",
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone ?? "UTC",
  };
}

export function formatLocationLabel(location) {
  if (!location) {
    return "";
  }

  return [location.name, location.admin1, location.country]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
}

export async function searchLocations(query, signal) {
  const normalizedQuery = query.trim();

  /*
   * Open-Meteo supports shorter exact
   * searches, but three characters provide
   * more useful prefix-matching results.
   */
  if (normalizedQuery.length < 3) {
    return [];
  }

  const parameters = new URLSearchParams({
    name: normalizedQuery,
    count: "6",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_ENDPOINT}?${parameters}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("We could not search for that place.");
  }

  const data = await response.json();

  if (!Array.isArray(data.results)) {
    return [];
  }

  return data.results
    .filter(
      (location) =>
        Number.isFinite(location.latitude) &&
        Number.isFinite(location.longitude)
    )
    .map(normalizeLocation);
}
