const BLS_API_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/";

const PRICE_SERIES = [
  {
    key: "bread",
    seriesId: "APU0000702111",
    label: "White bread",
    unit: "per lb",
  },
  {
    key: "milk",
    seriesId: "APU0000709112",
    label: "Whole milk",
    unit: "per gallon",
  },
  {
    key: "eggs",
    seriesId: "APU0000708111",
    label: "Large grade A eggs",
    unit: "per dozen",
  },
  {
    key: "ground-beef",
    seriesId: "APU0000703112",
    label: "Ground beef",
    unit: "per lb",
  },
  {
    key: "bananas",
    seriesId: "APU0000711211",
    label: "Bananas",
    unit: "per lb",
  },
  {
    key: "coffee",
    seriesId: "APU0000717311",
    label: "Ground roast coffee",
    unit: "per lb",
  },
  {
    key: "gasoline",
    seriesId: "APU000074714",
    label: "Regular gasoline",
    unit: "per gallon",
  },
];

const CPI_SERIES_ID = "CUUR0000SA0";

const SERIES_IDS = [
  ...PRICE_SERIES.map((series) => series.seriesId),
  CPI_SERIES_ID,
];

function createPeriod(month) {
  return `M${String(month).padStart(2, "0")}`;
}

function parseValue(value) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getSeriesMap(response) {
  const series = response?.Results?.series;

  if (!Array.isArray(series)) {
    return new Map();
  }

  return new Map(series.map((item) => [item.seriesID, item.data ?? []]));
}

function findBirthValue(observations, year, month) {
  const period = createPeriod(month);

  const observation = observations.find(
    (item) => Number(item.year) === year && item.period === period
  );

  if (!observation) {
    return null;
  }

  const value = parseValue(observation.value);

  if (value === null) {
    return null;
  }

  return {
    value,
    year: Number(observation.year),
    periodName: observation.periodName,
  };
}

function findLatestValue(observations) {
  return (
    observations
      .filter((item) => /^M(0[1-9]|1[0-2])$/.test(item.period))
      .map((item) => ({
        value: parseValue(item.value),
        year: Number(item.year),
        month: Number(item.period.slice(1)),
        periodName: item.periodName,
      }))
      .filter((item) => item.value !== null && Number.isInteger(item.year))
      .sort((first, second) => {
        if (first.year !== second.year) {
          return second.year - first.year;
        }

        return second.month - first.month;
      })[0] ?? null
  );
}

async function requestBlsData(startYear, endYear) {
  const response = await fetch(BLS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      seriesid: SERIES_IDS,
      startyear: String(startYear),
      endyear: String(endYear),
    }),
  });

  if (!response.ok) {
    throw new Error(`BLS returned ${response.status}.`);
  }

  const data = await response.json();

  if (data.status !== "REQUEST_SUCCEEDED") {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(" ")
        : "The BLS request failed."
    );
  }

  return data;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  const birthYear = Number(request.query.year);

  const birthMonth = Number(request.query.month);

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

  if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
    return response.status(400).json({
      error: "A valid birth month is required.",
    });
  }

  try {
    const [birthResponse, latestResponse] = await Promise.all([
      requestBlsData(birthYear, birthYear),

      requestBlsData(currentYear - 1, currentYear),
    ]);

    const birthSeries = getSeriesMap(birthResponse);

    const latestSeries = getSeriesMap(latestResponse);

    const items = PRICE_SERIES.map((definition) => {
      const birthObservation = findBirthValue(
        birthSeries.get(definition.seriesId) ?? [],
        birthYear,
        birthMonth
      );

      const currentObservation = findLatestValue(
        latestSeries.get(definition.seriesId) ?? []
      );

      if (!birthObservation || !currentObservation) {
        return null;
      }

      return {
        key: definition.key,
        label: definition.label,
        unit: definition.unit,

        birthValue: birthObservation.value,

        currentValue: currentObservation.value,

        birthPeriod: {
          month: birthObservation.periodName,
          year: birthObservation.year,
        },

        currentPeriod: {
          month: currentObservation.periodName,
          year: currentObservation.year,
        },

        seriesId: definition.seriesId,

        sourceUrl: `https://data.bls.gov/timeseries/${definition.seriesId}`,
      };
    }).filter(Boolean);

    const birthCpi = findBirthValue(
      birthSeries.get(CPI_SERIES_ID) ?? [],
      birthYear,
      birthMonth
    );

    const currentCpi = findLatestValue(latestSeries.get(CPI_SERIES_ID) ?? []);

    const purchasingPower =
      birthCpi && currentCpi
        ? {
            birthValue: birthCpi.value,

            currentValue: currentCpi.value,

            oneDollarToday: currentCpi.value / birthCpi.value,

            birthPeriod: {
              month: birthCpi.periodName,
              year: birthCpi.year,
            },

            currentPeriod: {
              month: currentCpi.periodName,
              year: currentCpi.year,
            },

            seriesId: CPI_SERIES_ID,

            sourceUrl: `https://data.bls.gov/timeseries/${CPI_SERIES_ID}`,
          }
        : null;

    const available = items.length > 0 || Boolean(purchasingPower);

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );

    return response.status(200).json({
      available,
      birthYear,
      birthMonth,
      items,
      purchasingPower,

      geography: "U.S. city average",

      methodology:
        "Birth values use the published monthly average for the birth month. Current values use the latest monthly average available.",

      source: "U.S. Bureau of Labor Statistics",

      sourceUrl: "https://www.bls.gov/cpi/data.htm",

      reason: available
        ? null
        : "Comparable U.S. price data was not available for this birth month.",
    });
  } catch (error) {
    console.error("BLS price request failed:", error);

    return response.status(502).json({
      error: "Historical price data is temporarily unavailable.",
    });
  }
}
