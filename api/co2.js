const NOAA_DATA_URL =
  "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.txt";

const NOAA_SOURCE_URL = "https://gml.noaa.gov/ccgg/trends/data.html";

function parseAnnualRecords(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const columns = line.split(/\s+/);

      const year = Number(columns[0]);

      const value = Number(columns[1]);

      if (!Number.isInteger(year) || !Number.isFinite(value)) {
        return null;
      }

      return {
        year,
        value,
      };
    })
    .filter(Boolean)
    .sort((first, second) => first.year - second.year);
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  const birthYear = Number(request.query.year);

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

  try {
    const noaaResponse = await fetch(NOAA_DATA_URL, {
      headers: {
        Accept: "text/plain",
      },
    });

    if (!noaaResponse.ok) {
      throw new Error(`NOAA returned ${noaaResponse.status}.`);
    }

    const text = await noaaResponse.text();

    const records = parseAnnualRecords(text);

    const birthRecord = records.find((record) => record.year === birthYear);

    const latestRecord = records.at(-1);

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );

    if (!birthRecord || !latestRecord) {
      return response.status(200).json({
        available: false,
        birthYear,
        reason:
          "Direct annual Mauna Loa CO₂ measurements were unavailable for this birth year.",
        source: "NOAA Global Monitoring Laboratory",
        sourceUrl: NOAA_SOURCE_URL,
      });
    }

    return response.status(200).json({
      available: true,

      item: {
        key: "atmosphericCo2",
        label: "Atmospheric CO₂",
        scope: "world",
        unit: "ppm",

        birthValue: birthRecord.value,

        birthYear: birthRecord.year,

        latestValue: latestRecord.value,

        latestYear: latestRecord.year,

        country: "Mauna Loa Observatory",

        sourceUrl: NOAA_SOURCE_URL,
      },

      source: "NOAA Global Monitoring Laboratory",

      note: "Annual atmospheric carbon dioxide measured at Mauna Loa Observatory, expressed in parts per million.",
    });
  } catch (error) {
    console.error("NOAA CO2 request failed:", error);

    return response.status(502).json({
      error: "Atmospheric CO₂ data is temporarily unavailable.",
    });
  }
}
