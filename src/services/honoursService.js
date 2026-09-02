const NOBEL_PRIZE_ENDPOINT = "https://api.nobelprize.org/2.1/nobelPrizes";
const FORMULA_ONE_ENDPOINT = "https://api.jolpi.ca/ergast/f1";

const FIRST_FORMULA_ONE_YEAR = 1950;

function getLocalizedValue(field) {
  if (!field || typeof field !== "object") {
    return "";
  }

  return field.en ?? Object.values(field)[0] ?? "";
}

function getLaureateName(laureate) {
  return (
    getLocalizedValue(laureate.knownName) ||
    getLocalizedValue(laureate.orgName) ||
    getLocalizedValue(laureate.fullName) ||
    "Unnamed laureate"
  );
}

function normalizeLaureate(laureate) {
  const sourceLink = laureate.links?.find((link) => link.rel === "laureate");

  return {
    id: laureate.id ?? getLaureateName(laureate),

    name: getLaureateName(laureate),

    motivation: getLocalizedValue(laureate.motivation),

    sourceUrl: sourceLink?.href ?? null,
  };
}

export async function getNobelPeacePrize({ year, signal }) {
  if (!Number.isInteger(year) || year < 1901) {
    return {
      available: false,

      reason: "The Nobel Prizes were first awarded in 1901.",
    };
  }

  const parameters = new URLSearchParams({
    nobelPrizeCategory: "pea",
    nobelPrizeYear: String(year),
  });

  const response = await fetch(`${NOBEL_PRIZE_ENDPOINT}?${parameters}`, {
    signal,

    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Nobel Prize information could not be retrieved.");
  }

  const data = await response.json();

  const prize = data.nobelPrizes?.[0];

  if (
    !prize ||
    !Array.isArray(prize.laureates) ||
    prize.laureates.length === 0
  ) {
    return {
      available: false,

      reason: "No Nobel Peace Prize laureate was recorded for this year.",
    };
  }

  return {
    available: true,

    year: Number(prize.awardYear ?? year),

    category:
      getLocalizedValue(prize.categoryFullName) || "The Nobel Peace Prize",

    laureates: prize.laureates.map(normalizeLaureate),

    sourceUrl: `https://www.nobelprize.org/prizes/peace/${year}/summary/`,
  };
}

export async function getFormulaOneChampion({ year, signal }) {
  if (!Number.isInteger(year)) {
    throw new TypeError("A valid championship year is required.");
  }

  if (year < FIRST_FORMULA_ONE_YEAR) {
    return {
      available: false,

      reason: "The Formula One World Championship began in 1950.",
    };
  }

  const currentYear = new Date().getUTCFullYear();

  if (year >= currentYear) {
    return {
      available: false,

      reason:
        "The Formula One champion for this season has not been confirmed.",
    };
  }

  const response = await fetch(
    `${FORMULA_ONE_ENDPOINT}/${year}/driverstandings/1/`,
    {
      signal,

      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Formula One championship information could not be retrieved."
    );
  }

  const data = await response.json();

  const standing =
    data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0];

  if (!standing?.Driver) {
    return {
      available: false,

      reason: "No Formula One World Drivers’ Champion was found for this year.",
    };
  }

  const driver = standing.Driver;
  const constructor = standing.Constructors?.[0];
  const driverName = [driver.givenName, driver.familyName]
    .filter(Boolean)
    .join(" ");

  return {
    available: true,
    year,
    driver: driverName,
    constructor: constructor?.name ?? "",
    nationality: driver.nationality ?? "",
    points: Number(standing.points) || null,
    wins: Number(standing.wins) || 0,
    sourceUrl: `https://www.formula1.com/en/results/${year}/drivers`,
  };
}
