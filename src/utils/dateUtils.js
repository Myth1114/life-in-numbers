const EARLIEST_ALLOWED_YEAR = 1900;

/**
 * Converts the date input value into a timezone-safe Date.
 *
 * Input:
 * "1997-04-26"
 *
 * Output:
 * Date representing 26 April 1997
 */
export function parseDateInput(dateValue) {
  if (!dateValue) {
    return null;
  }

  const parts = dateValue.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  const isValidDate =
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day;

  return isValidDate ? parsedDate : null;
}

/**
 * Returns today's date at UTC midnight while preserving
 * the visitor's local calendar day.
 */
export function getTodayUTC(currentDate = new Date()) {
  return new Date(
    Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
  );
}

/**
 * Creates the YYYY-MM-DD format required by
 * an HTML date input's max attribute.
 */
export function getTodayInputValue(currentDate = new Date()) {
  const year = currentDate.getFullYear();

  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Validates a DOB and returns a friendly error message.
 * An empty string means the date is valid.
 */
export function validateBirthDate(dateValue, currentDate = new Date()) {
  if (!dateValue) {
    return "Choose the day you arrived first.";
  }

  const birthDate = parseDateInput(dateValue);

  if (!birthDate) {
    return "That date doesn't look quite right.";
  }

  const today = getTodayUTC(currentDate);

  if (birthDate > today) {
    return "That date hasn't happened yet.";
  }

  if (birthDate.getUTCFullYear() < EARLIEST_ALLOWED_YEAR) {
    return "Please choose a date from 1900 onwards.";
  }

  return "";
}
