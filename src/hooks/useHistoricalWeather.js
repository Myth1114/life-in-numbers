import { useEffect, useState } from "react";

import { getHistoricalWeather } from "../services/weatherService";

export function useHistoricalWeather(birthDate, location) {
  const [weatherState, setWeatherState] = useState({
    status: "loading",
    data: null,
    message: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    let isActive = true;

    getHistoricalWeather({
      birthDate,
      location,
      signal: controller.signal,
    })
      .then((weather) => {
        if (!isActive) {
          return;
        }

        if (!weather.available) {
          setWeatherState({
            status: "unavailable",
            data: null,
            message: weather.reason,
          });

          return;
        }

        setWeatherState({
          status: "success",
          data: weather,
          message: "",
        });
      })
      .catch((error) => {
        if (!isActive || error.name === "AbortError") {
          return;
        }

        setWeatherState({
          status: "error",
          data: null,
          message: "The historical weather estimate could not be loaded.",
        });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [birthDate, location]);

  return weatherState;
}
