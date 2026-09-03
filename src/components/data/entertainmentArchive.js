const ENTERTAINMENT_ARCHIVE = {
  1980: {
    bestPicture: "Ordinary People",
    notableGame: "Pac-Man",
  },
  1981: {
    bestPicture: "Chariots of Fire",
    notableGame: "Donkey Kong",
  },
  1982: {
    bestPicture: "Gandhi",
    notableGame: "Ms. Pac-Man",
  },
  1983: {
    bestPicture: "Terms of Endearment",
    notableGame: "Mario Bros.",
  },
  1984: {
    bestPicture: "Amadeus",
    notableGame: "Tetris",
  },
  1985: {
    bestPicture: "Out of Africa",
    notableGame: "Super Mario Bros.",
  },
  1986: {
    bestPicture: "Platoon",
    notableGame: "The Legend of Zelda",
  },
  1987: {
    bestPicture: "The Last Emperor",
    notableGame: "Final Fantasy",
  },
  1988: {
    bestPicture: "Rain Man",
    notableGame: "Super Mario Bros. 3",
  },
  1989: {
    bestPicture: "Driving Miss Daisy",
    notableGame: "SimCity",
  },
  1990: {
    bestPicture: "Dances with Wolves",
    notableGame: "Super Mario World",
  },
  1991: {
    bestPicture: "The Silence of the Lambs",
    notableGame: "Sonic the Hedgehog",
  },
  1992: {
    bestPicture: "Unforgiven",
    notableGame: "Mortal Kombat",
  },
  1993: {
    bestPicture: "Schindler’s List",
    notableGame: "Doom",
  },
  1994: {
    bestPicture: "Forrest Gump",
    notableGame: "Super Metroid",
  },
  1995: {
    bestPicture: "Braveheart",
    notableGame: "Chrono Trigger",
  },
  1996: {
    bestPicture: "The English Patient",
    notableGame: "Super Mario 64",
  },
  1997: {
    bestPicture: "Titanic",
    notableGame: "Final Fantasy VII",
  },
  1998: {
    bestPicture: "Shakespeare in Love",
    notableGame: "The Legend of Zelda: Ocarina of Time",
  },
  1999: {
    bestPicture: "American Beauty",
    notableGame: "Age of Empires II",
  },
  2000: {
    bestPicture: "Gladiator",
    notableGame: "Deus Ex",
  },
  2001: {
    bestPicture: "A Beautiful Mind",
    notableGame: "Halo: Combat Evolved",
  },
  2002: {
    bestPicture: "Chicago",
    notableGame: "Grand Theft Auto: Vice City",
  },
  2003: {
    bestPicture: "The Lord of the Rings: The Return of the King",
    notableGame: "Prince of Persia: The Sands of Time",
  },
  2004: {
    bestPicture: "Million Dollar Baby",
    notableGame: "Half-Life 2",
  },
  2005: {
    bestPicture: "Crash",
    notableGame: "Resident Evil 4",
  },
  2006: {
    bestPicture: "The Departed",
    notableGame: "Wii Sports",
  },
  2007: {
    bestPicture: "No Country for Old Men",
    notableGame: "BioShock",
  },
  2008: {
    bestPicture: "Slumdog Millionaire",
    notableGame: "Grand Theft Auto IV",
  },
  2009: {
    bestPicture: "The Hurt Locker",
    notableGame: "Minecraft",
  },
  2010: {
    bestPicture: "The King’s Speech",
    notableGame: "Mass Effect 2",
  },
  2011: {
    bestPicture: "The Artist",
    notableGame: "The Elder Scrolls V: Skyrim",
  },
  2012: {
    bestPicture: "Argo",
    notableGame: "Journey",
  },
  2013: {
    bestPicture: "12 Years a Slave",
    notableGame: "The Last of Us",
  },
  2014: {
    bestPicture: "Birdman",
    notableGame: "Dragon Age: Inquisition",
  },
  2015: {
    bestPicture: "Spotlight",
    notableGame: "The Witcher 3: Wild Hunt",
  },
  2016: {
    bestPicture: "Moonlight",
    notableGame: "Overwatch",
  },
  2017: {
    bestPicture: "The Shape of Water",
    notableGame: "The Legend of Zelda: Breath of the Wild",
  },
  2018: {
    bestPicture: "Green Book",
    notableGame: "God of War",
  },
  2019: {
    bestPicture: "Parasite",
    notableGame: "Sekiro: Shadows Die Twice",
  },
  2020: {
    bestPicture: "Nomadland",
    notableGame: "Hades",
  },
  2021: {
    bestPicture: "CODA",
    notableGame: "It Takes Two",
  },
  2022: {
    bestPicture: "Everything Everywhere All at Once",
    notableGame: "Elden Ring",
  },
  2023: {
    bestPicture: "Oppenheimer",
    notableGame: "Baldur’s Gate 3",
  },
  2024: {
    bestPicture: "Anora",
    notableGame: "Astro Bot",
  },
};

export function getEntertainmentContext(birthDate) {
  if (!(birthDate instanceof Date) || !Number.isFinite(birthDate.getTime())) {
    return null;
  }

  const birthYear = birthDate.getUTCFullYear();

  const record = ENTERTAINMENT_ARCHIVE[birthYear];

  if (!record) {
    return null;
  }

  return {
    birthYear,
    ...record,
  };
}
