import { useEffect, useState } from "react";

import { getDateHistory } from "../services/historyService";

export function useDateHistory(birthDate) {
  const [historyState, setHistoryState] = useState({
    status: "loading",
    events: [],
    message: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    let isActive = true;

    getDateHistory({
      birthDate,
      signal: controller.signal,
    })
      .then((events) => {
        if (!isActive) {
          return;
        }

        if (events.length === 0) {
          setHistoryState({
            status: "unavailable",
            events: [],
            message: "No historical events were found for this date.",
          });

          return;
        }

        setHistoryState({
          status: "success",
          events,
          message: "",
        });
      })
      .catch((error) => {
        if (!isActive || error.name === "AbortError") {
          return;
        }

        setHistoryState({
          status: "error",
          events: [],
          message: "Historical events could not be loaded.",
        });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [birthDate]);

  return historyState;
}
