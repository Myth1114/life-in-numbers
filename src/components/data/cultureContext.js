const ERA_CONTEXTS = [
  {
    start: 1900,
    end: 1919,
    description:
      "Mass production, electric light, recorded sound and early cinema were changing everyday life.",
  },
  {
    start: 1920,
    end: 1939,
    description:
      "Radio entered homes, cinema found its voice and commercial aviation began connecting distant places.",
  },
  {
    start: 1940,
    end: 1959,
    description:
      "The world moved through war and reconstruction as television began becoming part of domestic life.",
  },
  {
    start: 1960,
    end: 1979,
    description:
      "The space race, colour television, civil-rights movements and global popular culture reshaped public life.",
  },
  {
    start: 1980,
    end: 1989,
    description:
      "Personal computers, cable television, video games and portable music entered more homes.",
  },
  {
    start: 1990,
    end: 1999,
    description:
      "The public web arrived, mobile phones spread and digital life began moving beyond specialist spaces.",
  },
  {
    start: 2000,
    end: 2009,
    description:
      "Broadband, search engines, digital cameras and early social networks changed how people found one another.",
  },
  {
    start: 2010,
    end: 2019,
    description:
      "Smartphones, streaming and social platforms became ordinary parts of daily communication.",
  },
  {
    start: 2020,
    end: 2029,
    description:
      "Remote connection, artificial intelligence and accelerating climate concerns shaped a rapidly changing decade.",
  },
];

const FIFA_WORLD_CUPS = [
  {
    date: "1930-07-30",
    winner: "Uruguay",
  },
  {
    date: "1934-06-10",
    winner: "Italy",
  },
  {
    date: "1938-06-19",
    winner: "Italy",
  },
  {
    date: "1950-07-16",
    winner: "Uruguay",
  },
  {
    date: "1954-07-04",
    winner: "West Germany",
  },
  {
    date: "1958-06-29",
    winner: "Brazil",
  },
  {
    date: "1962-06-17",
    winner: "Brazil",
  },
  {
    date: "1966-07-30",
    winner: "England",
  },
  {
    date: "1970-06-21",
    winner: "Brazil",
  },
  {
    date: "1974-07-07",
    winner: "West Germany",
  },
  {
    date: "1978-06-25",
    winner: "Argentina",
  },
  {
    date: "1982-07-11",
    winner: "Italy",
  },
  {
    date: "1986-06-29",
    winner: "Argentina",
  },
  {
    date: "1990-07-08",
    winner: "West Germany",
  },
  {
    date: "1994-07-17",
    winner: "Brazil",
  },
  {
    date: "1998-07-12",
    winner: "France",
  },
  {
    date: "2002-06-30",
    winner: "Brazil",
  },
  {
    date: "2006-07-09",
    winner: "Italy",
  },
  {
    date: "2010-07-11",
    winner: "Spain",
  },
  {
    date: "2014-07-13",
    winner: "Germany",
  },
  {
    date: "2018-07-15",
    winner: "France",
  },
  {
    date: "2022-12-18",
    winner: "Argentina",
  },
];

const CRICKET_WORLD_CUPS = [
  {
    date: "1975-06-21",
    winner: "West Indies",
  },
  {
    date: "1979-06-23",
    winner: "West Indies",
  },
  {
    date: "1983-06-25",
    winner: "India",
  },
  {
    date: "1987-11-08",
    winner: "Australia",
  },
  {
    date: "1992-03-25",
    winner: "Pakistan",
  },
  {
    date: "1996-03-17",
    winner: "Sri Lanka",
  },
  {
    date: "1999-06-20",
    winner: "Australia",
  },
  {
    date: "2003-03-23",
    winner: "Australia",
  },
  {
    date: "2007-04-28",
    winner: "Australia",
  },
  {
    date: "2011-04-02",
    winner: "India",
  },
  {
    date: "2015-03-29",
    winner: "Australia",
  },
  {
    date: "2019-07-14",
    winner: "England",
  },
  {
    date: "2023-11-19",
    winner: "Australia",
  },
];

function validateBirthDate(date) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new TypeError("A valid birth date is required.");
  }
}

function getDateValue(date) {
  const year = date.getUTCFullYear();

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getReigningChampion(tournaments, birthDate) {
  const birthDateValue = getDateValue(birthDate);

  let reigningTournament = null;

  for (const tournament of tournaments) {
    if (tournament.date <= birthDateValue) {
      reigningTournament = tournament;
    } else {
      break;
    }
  }

  return reigningTournament;
}

export function getEraContext(year) {
  const context = ERA_CONTEXTS.find(
    (entry) => year >= entry.start && year <= entry.end
  );

  return (
    context ?? {
      start: year,
      end: year,
      description: "No era description is available for this year.",
    }
  );
}

export function getTournamentChampions(birthDate) {
  validateBirthDate(birthDate);

  const champions = [];

  const fifaTournament = getReigningChampion(FIFA_WORLD_CUPS, birthDate);

  if (fifaTournament) {
    champions.push({
      id: "fifa-world-cup",

      competition: "Reigning FIFA World Cup champion",

      winner: fifaTournament.winner,

      titleYear: Number(fifaTournament.date.slice(0, 4)),

      titleDate: fifaTournament.date,

      sourceUrl: "https://www.fifa.com/tournaments/mens/worldcup",
    });
  }

  const cricketTournament = getReigningChampion(CRICKET_WORLD_CUPS, birthDate);

  if (cricketTournament) {
    champions.push({
      id: "cricket-world-cup",

      competition: "Reigning Cricket World Cup champion",

      winner: cricketTournament.winner,

      titleYear: Number(cricketTournament.date.slice(0, 4)),

      titleDate: cricketTournament.date,

      sourceUrl: "https://www.icc-cricket.com/tournaments/cricketworldcup",
    });
  }

  return champions;
}

export function calculateCultureContext(birthDate) {
  validateBirthDate(birthDate);

  const year = birthDate.getUTCFullYear();

  return {
    year,

    era: getEraContext(year),

    tournamentChampions: getTournamentChampions(birthDate),
  };
}
