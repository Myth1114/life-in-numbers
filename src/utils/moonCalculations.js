const MILLISECONDS_PER_DAY = 86_400_000;

const SYNODIC_MONTH_DAYS = 29.53058867;

/*
 * A known new moon:
 * January 6, 2000 at 18:14 UTC.
 */
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

function normalizeCycle(value) {
  return ((value % 1) + 1) % 1;
}

function getPhaseName(cyclePosition) {
  if (cyclePosition < 0.0625 || cyclePosition >= 0.9375) {
    return "New moon";
  }

  if (cyclePosition < 0.1875) {
    return "Waxing crescent";
  }

  if (cyclePosition < 0.3125) {
    return "First quarter";
  }

  if (cyclePosition < 0.4375) {
    return "Waxing gibbous";
  }

  if (cyclePosition < 0.5625) {
    return "Full moon";
  }

  if (cyclePosition < 0.6875) {
    return "Waning gibbous";
  }

  if (cyclePosition < 0.8125) {
    return "Last quarter";
  }

  return "Waning crescent";
}

export function calculateMoonPhase(date) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new TypeError("A valid date is required.");
  }

  /*
   * No birth time is collected, so noon UTC
   * represents the middle of the selected day.
   */
  const representativeTime = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12
  );

  const daysSinceKnownNewMoon =
    (representativeTime - KNOWN_NEW_MOON) / MILLISECONDS_PER_DAY;

  const cyclePosition = normalizeCycle(
    daysSinceKnownNewMoon / SYNODIC_MONTH_DAYS
  );

  const illumination = (1 - Math.cos(2 * Math.PI * cyclePosition)) / 2;

  return {
    name: getPhaseName(cyclePosition),

    cyclePosition,

    illuminationPercentage: Math.round(illumination * 100),

    isWaxing: cyclePosition < 0.5,

    isWaning: cyclePosition >= 0.5,
  };
}
