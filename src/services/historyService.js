const WIKIMEDIA_EVENTS_ENDPOINT =
  "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events";

function getPrimaryPage(event) {
  if (!Array.isArray(event.pages) || event.pages.length === 0) {
    return null;
  }

  return event.pages[0];
}

function normalizeEvent(event, birthYear) {
  if (typeof event.text !== "string" || !Number.isInteger(event.year)) {
    return null;
  }

  const page = getPrimaryPage(event);

  return {
    id: [event.year, event.text.slice(0, 40)].join("-"),

    year: event.year,

    description: event.text,

    isBirthYear: event.year === birthYear,

    articleTitle: page?.normalizedtitle ?? page?.title ?? "",

    articleUrl:
      page?.content_urls?.desktop?.page ??
      page?.content_urls?.mobile?.page ??
      null,

    image: page?.thumbnail?.source ?? page?.originalimage?.source ?? null,
  };
}

export async function getDateHistory({ birthDate, signal }) {
  if (!(birthDate instanceof Date) || !Number.isFinite(birthDate.getTime())) {
    throw new TypeError("A valid birth date is required.");
  }

  const month = birthDate.getUTCMonth() + 1;

  const day = birthDate.getUTCDate();

  const birthYear = birthDate.getUTCFullYear();

  const response = await fetch(`${WIKIMEDIA_EVENTS_ENDPOINT}/${month}/${day}`, {
    signal,

    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Historical events could not be retrieved.");
  }

  const data = await response.json();

  if (!Array.isArray(data.events)) {
    return [];
  }

  const events = data.events
    .map((event) => normalizeEvent(event, birthYear))
    .filter(Boolean)

    /*
     * Only show events that had already
     * happened when the visitor was born.
     */
    .filter((event) => event.year <= birthYear)

    /*
     * Recent events appear first, meaning an
     * event from the birth year is prioritised.
     */
    .sort((first, second) => second.year - first.year);

  const uniqueEvents = [
    ...new Map(events.map((event) => [event.description, event])).values(),
  ];

  return uniqueEvents.slice(0, 5);
}
