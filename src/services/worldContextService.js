async function requestJson(url, signal) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "The API did not return JSON. Run the project using `npx vercel dev`."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "The requested data could not be loaded.");
  }

  return data;
}

export async function getWorldContext(birthDate, location, signal) {
  if (!(birthDate instanceof Date) || !Number.isFinite(birthDate.getTime())) {
    throw new TypeError("A valid birth date is required.");
  }

  const countryCode = location?.countryCode ?? location?.country_code;

  if (!countryCode) {
    throw new Error("A birthplace country is required.");
  }

  const birthYear = birthDate.getUTCFullYear();

  const worldParameters = new URLSearchParams({
    year: String(birthYear),
    country: String(countryCode).toUpperCase(),
    version: "2",
  });

  const co2Parameters = new URLSearchParams({
    year: String(birthYear),
    version: "1",
  });

  const worldRequest = requestJson(
    `/api/world-context?${worldParameters.toString()}`,
    signal
  );

  const co2Request = requestJson(
    `/api/co2?${co2Parameters.toString()}`,
    signal
  ).catch((error) => {
    if (signal?.aborted || error?.name === "AbortError") {
      throw error;
    }

    console.warn("CO2 context was unavailable:", error);

    return null;
  });

  const [worldContext, co2Context] = await Promise.all([
    worldRequest,
    co2Request,
  ]);

  const items = [...(worldContext.items ?? [])];

  if (co2Context?.available && co2Context.item) {
    items.push(co2Context.item);
  }

  return {
    ...worldContext,
    available: items.length > 0,
    items,

    additionalSources: co2Context?.available
      ? [
          {
            name: co2Context.source,
            url: co2Context.item.sourceUrl,
          },
        ]
      : [],
  };
}
