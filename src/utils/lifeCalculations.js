import { getTodayUTC, parseDateInput } from "./dateUtils";

const MILLISECONDS_PER_DAY = 86_400_000;
const DAYS_PER_YEAR = 365.2425;
const SYNODIC_MONTH_DAYS = 29.53059;

const HEARTBEATS_PER_MINUTE = 72;
const BREATHS_PER_MINUTE = 16;

export function calculateDaysLived(birthDate, today) {
  const difference = today.getTime() - birthDate.getTime();

  return Math.floor(difference / MILLISECONDS_PER_DAY);
}

export function calculateAge(birthDate, today) {
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

  return age;
}

export function calculateMonthsLived(birthDate, today) {
  let months = (today.getUTCFullYear() - birthDate.getUTCFullYear()) * 12;

  months += today.getUTCMonth() - birthDate.getUTCMonth();

  if (today.getUTCDate() < birthDate.getUTCDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function calculateWeeksLived(daysLived) {
  return Math.floor(daysLived / 7);
}

export function calculateHoursLived(daysLived) {
  return daysLived * 24;
}

export function calculateMinutesLived(daysLived) {
  return daysLived * 24 * 60;
}

export function estimateHeartbeats(minutesLived) {
  return minutesLived * HEARTBEATS_PER_MINUTE;
}

export function estimateBreaths(minutesLived) {
  return minutesLived * BREATHS_PER_MINUTE;
}

export function calculateFullMoons(daysLived) {
  return Math.floor(daysLived / SYNODIC_MONTH_DAYS);
}

export function calculateSeasons(daysLived) {
  const averageSeasonLength = DAYS_PER_YEAR / 4;

  return Math.floor(daysLived / averageSeasonLength);
}

export function countWeekdayOccurrences(birthDate, today, targetWeekday) {
  const firstOccurrence = new Date(birthDate);

  const daysUntilTarget = (targetWeekday - firstOccurrence.getUTCDay() + 7) % 7;

  firstOccurrence.setUTCDate(firstOccurrence.getUTCDate() + daysUntilTarget);

  if (firstOccurrence >= today) {
    return 0;
  }

  const remainingTime = today.getTime() - firstOccurrence.getTime();

  return Math.floor((remainingTime - 1) / (7 * MILLISECONDS_PER_DAY)) + 1;
}
export function calculateNewYears(birthDate, today) {
  return Math.max(0, today.getUTCFullYear() - birthDate.getUTCFullYear());
}

export function calculateCalendarData(birthDate, today, completedAge) {
  return {
    mondays: countWeekdayOccurrences(birthDate, today, 1),

    weekends: countWeekdayOccurrences(birthDate, today, 6),

    birthdays: completedAge,

    newYears: calculateNewYears(birthDate, today),
  };
}

function createReferenceDate(birthDate, lifespan) {
  const referenceDate = new Date(birthDate);

  referenceDate.setUTCFullYear(birthDate.getUTCFullYear() + lifespan);

  return referenceDate;
}

export function calculateReferenceData(birthDate, today, lifespan = 80) {
  const referenceDate = createReferenceDate(birthDate, lifespan);

  const remainingMilliseconds = referenceDate.getTime() - today.getTime();

  const remainingDays = Math.max(
    0,
    Math.floor(remainingMilliseconds / MILLISECONDS_PER_DAY)
  );

  const remainingWeeks = Math.floor(remainingDays / 7);

  const remainingYears = remainingDays / DAYS_PER_YEAR;

  return {
    lifespan,
    referenceDate,
    remainingDays,
    remainingWeeks,

    remainingWeekends: Math.floor(remainingDays / 7),

    remainingYears: Math.max(0, remainingYears),

    remainingSummers: Math.max(0, Math.floor(remainingYears)),
  };
}
export function calculateLifeData(
  dateValue,
  lifespan = 80,
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

  const days = calculateDaysLived(birthDate, today);

  const years = calculateAge(birthDate, today);

  const months = calculateMonthsLived(birthDate, today);

  const weeks = calculateWeeksLived(days);

  const hours = calculateHoursLived(days);

  const minutes = calculateMinutesLived(days);

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

    reference: calculateReferenceData(birthDate, today, lifespan),
  };
}
