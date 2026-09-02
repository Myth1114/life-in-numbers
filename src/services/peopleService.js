const WIKIMEDIA_FEED_ENDPOINT =
  "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births";

function getPrimaryPage(entry) {
  if (!Array.isArray(entry.pages) || entry.pages.length === 0) {
    return null;
  }

  return entry.pages[0];
}

function normalizePerson(entry, birthYear) {
  const page = getPrimaryPage(entry);

  if (!page) {
    return null;
  }

  const name = page.normalizedtitle ?? page.title ?? "";

  if (!name) {
    return null;
  }

  return {
    id: page.pageid ?? `${name}-${entry.year}`,

    name,

    year: entry.year,

    description:
      page.description ?? entry.text ?? "Biography available on Wikipedia.",

    image: page.thumbnail?.source ?? page.originalimage?.source ?? null,

    articleUrl:
      page.content_urls?.desktop?.page ??
      page.content_urls?.mobile?.page ??
      null,

    isSameYear: entry.year === birthYear,
  };
}

export async function getSharedBirthdays({ birthDate, signal }) {
  if (!(birthDate instanceof Date) || !Number.isFinite(birthDate.getTime())) {
    throw new TypeError("A valid birth date is required.");
  }

  const month = birthDate.getUTCMonth() + 1;

  const day = birthDate.getUTCDate();

  const birthYear = birthDate.getUTCFullYear();

  const response = await fetch(`${WIKIMEDIA_FEED_ENDPOINT}/${month}/${day}`, {
    signal,

    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Shared birthdays could not be retrieved.");
  }

  const data = await response.json();

  if (!Array.isArray(data.births)) {
    return [];
  }

  const people = data.births
    .map((entry) => normalizePerson(entry, birthYear))
    .filter(Boolean);

  const uniquePeople = [
    ...new Map(people.map((person) => [person.name, person])).values(),
  ];

  const sameYearPeople = uniquePeople.filter((person) => person.isSameYear);

  const otherPeople = uniquePeople.filter((person) => !person.isSameYear);

  /*
   * Preserve Wikimedia's curated ordering,
   * but ensure exact-year matches appear first.
   */
  return [...sameYearPeople, ...otherPeople].slice(0, 6);
}
