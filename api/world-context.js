const WORLD_BANK_API = "https://api.worldbank.org/v2";

const INDICATORS = [
  {
    key: "worldPopulation",
    indicatorId: "SP.POP.TOTL",
    label: "World population",
    scope: "world",
    unit: "people",
  },
  {
    key: "countryPopulation",
    indicatorId: "SP.POP.TOTL",
    label: "Country population",
    scope: "country",
    unit: "people",
  },
  {
    key: "internet",
    indicatorId: "IT.NET.USER.ZS",
    label: "People using the internet",
    scope: "world",
    unit: "percent",
  },
  {
    key: "mobile",
    indicatorId: "IT.CEL.SETS.P2",
    label: "Mobile subscriptions",
    scope: "world",
    unit: "per 100 people",
  },
  {
    key: "electricity",
    indicatorId: "EG.ELC.ACCS.ZS",
    label: "Access to electricity",
    scope: "country",
    unit: "percent",
  },
  {
    key: "lifeExpectancy",
    indicatorId: "SP.DYN.LE00.IN",
    label: "Life expectancy at birth",
    scope: "country",
    unit: "years",
  },
  {
    key: "airTravel",
    indicatorId: "IS.AIR.PSGR",
    label: "Air passenger journeys",
    scope: "world",
    unit: "passengers",
  },
];

const INDICATOR_IDS = [
  ...new Set(INDICATORS.map((indicator) => indicator.indicatorId)),
];

function isWorldRecord(record) {
  return (
    record.countryiso3code === "WLD" ||
    record.country?.id === "WLD" ||
    record.country?.value === "World"
  );
}

function matchesScope(record, scope) {
  return scope === "world" ? isWorldRecord(record) : !isWorldRecord(record);
}

function findBirthObservation(records, definition, birthYear) {
  const record = records.find(
    (item) =>
      item.indicator?.id === definition.indicatorId &&
      matchesScope(item, definition.scope) &&
      Number(item.date) === birthYear &&
      typeof item.value === "number"
  );

  if (!record) {
    return null;
  }

  return {
    value: record.value,
    year: Number(record.date),
    country: record.country?.value ?? "",
  };
}

function findLatestObservation(records, definition) {
  const record = records
    .filter(
      (item) =>
        item.indicator?.id === definition.indicatorId &&
        matchesScope(item, definition.scope) &&
        typeof item.value === "number"
    )
    .sort((first, second) => Number(second.date) - Number(first.date))[0];

  if (!record) {
    return null;
  }

  return {
    value: record.value,
    year: Number(record.date),
    country: record.country?.value ?? "",
  };
}

function createContextItem(records, definition, birthYear) {
  const birthObservation = findBirthObservation(records, definition, birthYear);

  const latestObservation = findLatestObservation(records, definition);

  if (!birthObservation || !latestObservation) {
    return null;
  }

  return {
    key: definition.key,
    indicatorId: definition.indicatorId,
    label: definition.label,
    scope: definition.scope,
    unit: definition.unit,

    birthValue: birthObservation.value,

    birthYear: birthObservation.year,

    latestValue: latestObservation.value,

    latestYear: latestObservation.year,

    country: birthObservation.country || latestObservation.country,

    sourceUrl: `https://data.worldbank.org/indicator/${definition.indicatorId}`,
  };
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  const birthYear = Number(request.query.year);

  const countryCode = String(request.query.country ?? "")
    .trim()
    .toUpperCase();

  const currentYear = new Date().getUTCFullYear();

  if (
    !Number.isInteger(birthYear) ||
    birthYear < 1900 ||
    birthYear > currentYear
  ) {
    return response.status(400).json({
      error: "A valid birth year is required.",
    });
  }

  if (!/^[A-Z]{2,3}$/.test(countryCode)) {
    return response.status(400).json({
      error: "A valid country code is required.",
    });
  }

  const countries = `${countryCode};WLD`;

  const indicators = INDICATOR_IDS.join(";");

  const query = new URLSearchParams({
    source: "2",
    date: `${birthYear}:${currentYear}`,
    format: "json",
    per_page: "2000",
  });

  const requestUrl =
    `${WORLD_BANK_API}` +
    `/country/${countries}` +
    `/indicator/${indicators}` +
    `?${query.toString()}`;

  try {
    const worldBankResponse = await fetch(requestUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!worldBankResponse.ok) {
      throw new Error(`World Bank returned ${worldBankResponse.status}.`);
    }

    const payload = await worldBankResponse.json();

    const records =
      Array.isArray(payload) && Array.isArray(payload[1]) ? payload[1] : [];

    const items = INDICATORS.map((definition) =>
      createContextItem(records, definition, birthYear)
    ).filter(Boolean);

    const countryItem = items.find((item) => item.scope === "country");

    const countryName = countryItem?.country ?? "";

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );

    return response.status(200).json({
      available: items.length > 0,
      birthYear,
      countryCode,
      countryName,
      items,

      source: "World Bank Open Data",

      sourceUrl: "https://data.worldbank.org/",

      note: "Values are annual national or global statistics. The latest year can differ between indicators because publication schedules vary.",

      reason:
        items.length > 0
          ? null
          : "Comparable World Bank indicators were unavailable for this birth year and country.",
    });
  } catch (error) {
    console.error("World context request failed:", error);

    return response.status(502).json({
      error: "World context data is temporarily unavailable.",
    });
  }
}
