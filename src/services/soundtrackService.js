const ARCHIVE_BASE_URL =
  "https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main";

const FIRST_HOT_100_DATE = "1958-08-04";

let validChartDatesPromise = null;

function formatDateForChart(date) {
  const year = date.getUTCFullYear();

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function fetchValidChartDates(signal) {
  /*
   * Cache the completed dates request for the
   * lifetime of the page. If it fails, clear
   * the cache so a later submission can retry.
   */
  if (!validChartDatesPromise) {
    validChartDatesPromise = fetch(`${ARCHIVE_BASE_URL}/valid_dates.json`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Chart dates could not be retrieved.");
        }

        return response.json();
      })
      .then((dates) => {
        if (!Array.isArray(dates)) {
          throw new Error("Chart dates were returned in an unexpected format.");
        }

        return [...dates].sort();
      })
      .catch((error) => {
        validChartDatesPromise = null;
        throw error;
      });
  }

  if (signal?.aborted) {
    throw new DOMException("The request was aborted.", "AbortError");
  }

  return validChartDatesPromise;
}

function findLatestChartDate(dates, dateValue) {
  let lowerIndex = 0;
  let upperIndex = dates.length - 1;

  let match = null;

  while (lowerIndex <= upperIndex) {
    const middleIndex = Math.floor((lowerIndex + upperIndex) / 2);

    const candidate = dates[middleIndex];

    if (candidate <= dateValue) {
      match = candidate;
      lowerIndex = middleIndex + 1;
    } else {
      upperIndex = middleIndex - 1;
    }
  }

  return match;
}

function createSearchLinks(song, artist) {
  const query = `${song} ${artist}`;

  return {
    spotify: `https://open.spotify.com/search/${encodeURIComponent(query)}`,

    youtube:
      "https://www.youtube.com/results" +
      `?search_query=${encodeURIComponent(query)}`,
  };
}

export async function getBirthWeekSoundtrack({ birthDate, signal }) {
  if (!(birthDate instanceof Date) || !Number.isFinite(birthDate.getTime())) {
    throw new TypeError("A valid birth date is required.");
  }

  const birthDateValue = formatDateForChart(birthDate);

  if (birthDateValue < FIRST_HOT_100_DATE) {
    return {
      available: false,

      reason: "The Billboard Hot 100 began on August 4, 1958.",
    };
  }

  const validDates = await fetchValidChartDates(signal);

  const chartDate = findLatestChartDate(validDates, birthDateValue);

  if (!chartDate) {
    return {
      available: false,

      reason: "No Billboard Hot 100 chart was available for this date.",
    };
  }

  const response = await fetch(`${ARCHIVE_BASE_URL}/date/${chartDate}.json`, {
    signal,

    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("The birth-week chart could not be retrieved.");
  }

  const chart = await response.json();

  const numberOne = chart.data?.find((entry) => entry.this_week === 1);

  if (!numberOne?.song || !numberOne?.artist) {
    return {
      available: false,

      reason: "The number-one song was unavailable for this chart.",
    };
  }

  return {
    available: true,

    chartDate,

    song: numberOne.song,

    artist: numberOne.artist,

    weeksOnChart: numberOne.weeks_on_chart ?? null,

    previousPosition: numberOne.last_week ?? null,

    chartName: "U.S. Billboard Hot 100",

    officialChartUrl: `https://www.billboard.com/charts/hot-100/${chartDate}/`,

    archiveUrl: `https://github.com/mhollingshead/billboard-hot-100/blob/main/date/${chartDate}.json`,

    links: createSearchLinks(numberOne.song, numberOne.artist),
  };
}
