export async function getHistoricalPrices(birthDate, signal) {
  if (!(birthDate instanceof Date) || !Number.isFinite(birthDate.getTime())) {
    throw new TypeError("A valid birth date is required.");
  }

  const birthYear = birthDate.getUTCFullYear();

  const birthMonth = birthDate.getUTCMonth() + 1;

  const parameters = new URLSearchParams({
    year: String(birthYear),
    month: String(birthMonth),
    version: "2",
  });

  const response = await fetch(`/api/prices?${parameters.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "The price API did not return JSON. Run the project using `npx vercel dev`."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Historical price data could not be loaded.");
  }

  return data;
}
