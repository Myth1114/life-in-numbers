import { useEffect, useState } from "react";

import { getHistoricalPrices } from "../services/priceService";

function createInitialState() {
  return {
    priceData: null,
    isLoading: false,
    error: "",
  };
}

export function useHistoricalPrices(birthDate) {
  const [state, setState] = useState(createInitialState);

  useEffect(() => {
    if (!(birthDate instanceof Date) || !Number.isFinite(birthDate.getTime())) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadPrices() {
      setState({
        priceData: null,
        isLoading: true,
        error: "",
      });

      try {
        const result = await getHistoricalPrices(birthDate, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setState({
          priceData: result,
          isLoading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted || error?.name === "AbortError") {
          return;
        }

        console.error("Unable to load historical prices:", error);

        setState({
          priceData: null,
          isLoading: false,
          error: "Historical U.S. price data is temporarily unavailable.",
        });
      }
    }

    loadPrices();

    return () => {
      controller.abort();
    };
  }, [birthDate]);

  return state;
}
