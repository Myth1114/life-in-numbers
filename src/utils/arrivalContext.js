const GENERATIONS = [
  {
    start: 1900,
    end: 1927,
    name: "Greatest Generation",
    description:
      "A generation shaped by global conflict, economic upheaval and reconstruction.",
  },
  {
    start: 1928,
    end: 1945,
    name: "Silent Generation",
    description:
      "A generation shaped by wartime childhoods and the rebuilding that followed.",
  },
  {
    start: 1946,
    end: 1964,
    name: "Baby Boomer",
    description:
      "Born during the post-war population boom and an era of rapid social change.",
  },
  {
    start: 1965,
    end: 1980,
    name: "Generation X",
    description:
      "Came of age as personal computers, cable television and independent youth culture expanded.",
  },
  {
    start: 1981,
    end: 1996,
    name: "Millennial",
    description:
      "Came of age alongside the internet, mobile phones and the transition into a digital world.",
  },
  {
    start: 1997,
    end: 2012,
    name: "Generation Z",
    description:
      "Grew up in a world where the internet, social media and connected devices were already present.",
  },
  {
    start: 2013,
    end: 2024,
    name: "Generation Alpha",
    description:
      "Born into a world of touchscreens, streaming media and increasingly intelligent technology.",
  },
  {
    start: 2025,
    end: 2039,
    name: "Generation Beta",
    description:
      "A developing label for children born into an era shaped by artificial intelligence and automation.",
  },
];

const MONTH_TRADITIONS = [
  {
    stone: "Garnet",
    flower: "Carnation",
  },
  {
    stone: "Amethyst",
    flower: "Violet",
  },
  {
    stone: "Aquamarine",
    flower: "Daffodil",
  },
  {
    stone: "Diamond",
    flower: "Daisy",
  },
  {
    stone: "Emerald",
    flower: "Lily of the Valley",
  },
  {
    stone: "Pearl",
    flower: "Rose",
  },
  {
    stone: "Ruby",
    flower: "Larkspur",
  },
  {
    stone: "Peridot",
    flower: "Gladiolus",
  },
  {
    stone: "Sapphire",
    flower: "Aster",
  },
  {
    stone: "Opal",
    flower: "Marigold",
  },
  {
    stone: "Topaz",
    flower: "Chrysanthemum",
  },
  {
    stone: "Turquoise",
    flower: "Narcissus",
  },
];

const CHINESE_ZODIAC_ANIMALS = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

const CHINESE_ELEMENTS = [
  "Wood",
  "Wood",
  "Fire",
  "Fire",
  "Earth",
  "Earth",
  "Metal",
  "Metal",
  "Water",
  "Water",
];

function validateBirthDate(date) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new TypeError("A valid birth date is required.");
  }
}

export function getGeneration(birthYear) {
  const generation = GENERATIONS.find(
    (entry) => birthYear >= entry.start && birthYear <= entry.end
  );

  return (
    generation ?? {
      start: birthYear,
      end: birthYear,
      name: "Generation unavailable",
      description: "No generation label is available for this year.",
    }
  );
}

export function getWesternZodiac(date) {
  validateBirthDate(date);

  const month = date.getUTCMonth() + 1;

  const day = date.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      name: "Aries",
      element: "Fire",
    };
  }

  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return {
      name: "Taurus",
      element: "Earth",
    };
  }

  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return {
      name: "Gemini",
      element: "Air",
    };
  }

  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return {
      name: "Cancer",
      element: "Water",
    };
  }

  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return {
      name: "Leo",
      element: "Fire",
    };
  }

  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return {
      name: "Virgo",
      element: "Earth",
    };
  }

  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return {
      name: "Libra",
      element: "Air",
    };
  }

  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return {
      name: "Scorpio",
      element: "Water",
    };
  }

  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return {
      name: "Sagittarius",
      element: "Fire",
    };
  }

  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return {
      name: "Capricorn",
      element: "Earth",
    };
  }

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return {
      name: "Aquarius",
      element: "Air",
    };
  }

  return {
    name: "Pisces",
    element: "Water",
  };
}

function getChineseCalendarYear(date) {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-chinese", {
      year: "numeric",
      timeZone: "UTC",
    });

    const relatedYear = formatter
      .formatToParts(date)
      .find((part) => part.type === "relatedYear");

    const parsedYear = Number(relatedYear?.value);

    if (Number.isInteger(parsedYear)) {
      return parsedYear;
    }
  } catch {
    /*
     * Older browsers may not support
     * the Chinese calendar.
     */
  }

  return date.getUTCFullYear();
}

function normalizeIndex(value, length) {
  return ((value % length) + length) % length;
}

export function getChineseZodiac(date) {
  validateBirthDate(date);

  const zodiacYear = getChineseCalendarYear(date);

  const animalIndex = normalizeIndex(
    zodiacYear - 4,
    CHINESE_ZODIAC_ANIMALS.length
  );

  const elementIndex = normalizeIndex(zodiacYear - 4, CHINESE_ELEMENTS.length);

  return {
    year: zodiacYear,

    animal: CHINESE_ZODIAC_ANIMALS[animalIndex],

    element: CHINESE_ELEMENTS[elementIndex],
  };
}

export function getMonthTraditions(date) {
  validateBirthDate(date);

  return MONTH_TRADITIONS[date.getUTCMonth()];
}

export function calculateArrivalContext(birthDate) {
  validateBirthDate(birthDate);

  const birthYear = birthDate.getUTCFullYear();

  return {
    generation: getGeneration(birthYear),

    westernZodiac: getWesternZodiac(birthDate),

    chineseZodiac: getChineseZodiac(birthDate),

    traditions: getMonthTraditions(birthDate),
  };
}
