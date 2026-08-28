import { getTodayUTC, parseDateInput } from "./dateUtils";

const MILLISECONDS_PER_DAY = 86_400_000;

const DAYS_PER_YEAR = 365.2425;

const SYNODIC_MONTH_DAYS = 29.53059;

const HEARTBEATS_PER_MINUTE = 72;
const BREATHS_PER_MINUTE = 16;

const DEFAULT_LIFESPAN = 80;
const MINIMUM_LIFESPAN = 1;
const MAXIMUM_LIFESPAN = 130;

function validateDate(date, name) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new TypeError(`${name} must be a valid Date.`);
  }
}

function validateLifespan(lifespan) {
  if (
    !Number.isInteger(lifespan) ||
    lifespan < MINIMUM_LIFESPAN ||
    lifespan > MAXIMUM_LIFESPAN
  ) {
    throw new RangeError("Lifespan must be a whole number between 1 and 130.");
  }

  return lifespan;
}

export function calculateDaysLived(birthDate, today) {
  validateDate(birthDate, "Birth date");

  validateDate(today, "Today");

  const difference = today.getTime() - birthDate.getTime();

  return Math.max(0, Math.floor(difference / MILLISECONDS_PER_DAY));
}

export function calculateAge(birthDate, today) {
  validateDate(birthDate, "Birth date");

  validateDate(today, "Today");

  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

  const currentMonth = today.getUTCMonth();

  const birthMonth = birthDate.getUTCMonth();

  const birthdayHasNotPassed =
    currentMonth < birthMonth ||
    (currentMonth === birthMonth &&
      today.getUTCDate() < birthDate.getUTCDate());

  if (birthdayHasNotPassed) {
    age -= 1;
  }

  return Math.max(0, age);
}

export function calculateMonthsLived(birthDate, today) {
  validateDate(birthDate, "Birth date");

  validateDate(today, "Today");

  let months = (today.getUTCFullYear() - birthDate.getUTCFullYear()) * 12;

  months += today.getUTCMonth() - birthDate.getUTCMonth();

  if (today.getUTCDate() < birthDate.getUTCDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function calculateWeeksLived(daysLived) {
  return Math.floor(Math.max(0, daysLived) / 7);
}

export function calculateHoursLived(daysLived) {
  return Math.max(0, daysLived) * 24;
}

export function calculateMinutesLived(daysLived) {
  return Math.max(0, daysLived) * 24 * 60;
}

export function estimateHeartbeats(minutesLived) {
  return Math.max(0, minutesLived) * HEARTBEATS_PER_MINUTE;
}

export function estimateBreaths(minutesLived) {
  return Math.max(0, minutesLived) * BREATHS_PER_MINUTE;
}

export function calculateFullMoons(daysLived) {
  return Math.floor(Math.max(0, daysLived) / SYNODIC_MONTH_DAYS);
}

export function calculateSeasons(daysLived) {
  const averageSeasonLength = DAYS_PER_YEAR / 4;

  return Math.floor(Math.max(0, daysLived) / averageSeasonLength);
}

export function countWeekdayOccurrences(birthDate, today, targetWeekday) {
  validateDate(birthDate, "Birth date");

  validateDate(today, "Today");

  if (
    !Number.isInteger(targetWeekday) ||
    targetWeekday < 0 ||
    targetWeekday > 6
  ) {
    throw new RangeError("Target weekday must be between 0 and 6.");
  }

  const firstOccurrence = new Date(birthDate.getTime());

  const daysUntilTarget = (targetWeekday - firstOccurrence.getUTCDay() + 7) % 7;

  firstOccurrence.setUTCDate(firstOccurrence.getUTCDate() + daysUntilTarget);

  /*
   * Today is excluded because lived days
   * represent completed days before today.
   */
  if (firstOccurrence >= today) {
    return 0;
  }

  const difference = today.getTime() - firstOccurrence.getTime();

  return Math.floor((difference - 1) / (7 * MILLISECONDS_PER_DAY)) + 1;
}

export function calculateNewYears(birthDate, today) {
  validateDate(birthDate, "Birth date");

  validateDate(today, "Today");

  return Math.max(0, today.getUTCFullYear() - birthDate.getUTCFullYear());
}

export function calculateCalendarData(birthDate, today, completedAge) {
  return {
    mondays: countWeekdayOccurrences(birthDate, today, 1),

    /*
     * One Saturday represents one
     * completed weekend.
     */
    weekends: countWeekdayOccurrences(birthDate, today, 6),

    birthdays: Math.max(0, completedAge),

    newYears: calculateNewYears(birthDate, today),
  };
}

/**
 * February 29 follows March 1 in a
 * non-leap reference year. This matches
 * calculateAge(), where the completed age
 * changes after February has ended.
 */
function createReferenceDate(birthDate, lifespan) {
  const referenceYear = birthDate.getUTCFullYear() + lifespan;

  return new Date(
    Date.UTC(referenceYear, birthDate.getUTCMonth(), birthDate.getUTCDate())
  );
}

export function calculateReferenceData(
  birthDate,
  today,
  lifespan = DEFAULT_LIFESPAN
) {
  validateDate(birthDate, "Birth date");

  validateDate(today, "Today");

  const validatedLifespan = validateLifespan(lifespan);

  const referenceDate = createReferenceDate(birthDate, validatedLifespan);

  const difference = referenceDate.getTime() - today.getTime();

  const remainingDays = Math.max(
    0,
    Math.floor(difference / MILLISECONDS_PER_DAY)
  );

  const remainingWeeks = Math.floor(remainingDays / 7);

  const remainingYears = remainingDays / DAYS_PER_YEAR;

  return {
    lifespan: validatedLifespan,

    referenceDate,

    remainingDays,
    remainingWeeks,

    remainingWeekends: remainingWeeks,

    remainingYears,

    remainingSummers: Math.floor(remainingYears),
  };
}

export function calculatePerspectiveData(referenceData, completedAge) {
  const remainingYears = Math.max(0, referenceData.remainingYears);

  const birthdaysRemaining = Math.max(0, referenceData.lifespan - completedAge);

  return {
    booksAtOnePerMonth: Math.floor(remainingYears * 12),

    tripsAtFourPerYear: Math.floor(remainingYears * 4),

    annualGatherings: Math.round(remainingYears),

    birthdays: birthdaysRemaining,
  };
}

export function calculateLifeData(
  dateValue,
  lifespan = DEFAULT_LIFESPAN,
  currentDate = new Date()
) {
  const birthDate = parseDateInput(dateValue);

  if (!birthDate) {
    throw new Error("A valid birth date is required.");
  }

  const today = getTodayUTC(currentDate);

  if (birthDate > today) {
    throw new Error("Birth date cannot be in the future.");
  }

  const validatedLifespan = validateLifespan(lifespan);

  const days = calculateDaysLived(birthDate, today);

  const years = calculateAge(birthDate, today);

  const months = calculateMonthsLived(birthDate, today);

  const weeks = calculateWeeksLived(days);

  const hours = calculateHoursLived(days);

  const minutes = calculateMinutesLived(days);

  const reference = calculateReferenceData(birthDate, today, validatedLifespan);

  const perspective = calculatePerspectiveData(reference, years);

  return {
    birthDate,
    today,

    lived: {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
    },

    estimated: {
      heartbeats: estimateHeartbeats(minutes),

      breaths: estimateBreaths(minutes),

      fullMoons: calculateFullMoons(days),

      sunrises: days,

      seasons: calculateSeasons(days),
    },

    calendar: calculateCalendarData(birthDate, today, years),

    reference,
    perspective,
  };
}
