export const EARLIEST_ALLOWED_DATE = "1900-01-01";

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isValidDateObject(date) {
  return date instanceof Date && Number.isFinite(date.getTime());
}

/**
 * Converts YYYY-MM-DD into a Date at UTC
 * midnight without local-timezone shifting.
 */
export function parseDateInput(dateValue) {
  if (typeof dateValue !== "string") {
    return null;
  }

  const match = DATE_INPUT_PATTERN.exec(dateValue);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  const isExactDate =
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day;

  return isExactDate ? parsedDate : null;
}

/**
 * Returns UTC midnight representing the
 * visitor's current local calendar date.
 */
export function getTodayUTC(currentDate = new Date()) {
  if (!isValidDateObject(currentDate)) {
    throw new TypeError("A valid current date is required.");
  }

  return new Date(
    Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
  );
}

/**
 * Produces YYYY-MM-DD for a date input.
 */
export function getTodayInputValue(currentDate = new Date()) {
  if (!isValidDateObject(currentDate)) {
    throw new TypeError("A valid current date is required.");
  }

  const year = currentDate.getFullYear();

  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Returns an error message or an empty
 * string when the DOB is valid.
 */
export function validateBirthDate(dateValue, currentDate = new Date()) {
  if (!dateValue) {
    return "Choose the day you arrived first.";
  }

  const birthDate = parseDateInput(dateValue);

  if (!birthDate) {
    return "That date doesn't look quite right.";
  }

  const earliestDate = parseDateInput(EARLIEST_ALLOWED_DATE);

  if (birthDate < earliestDate) {
    return "Please choose a date from 1900 onwards.";
  }

  const today = getTodayUTC(currentDate);

  if (birthDate > today) {
    return "That date hasn't happened yet.";
  }

  return "";
}
