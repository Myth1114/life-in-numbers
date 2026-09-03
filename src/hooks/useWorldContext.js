import { useEffect, useState } from "react";

import { getWorldContext } from "../services/worldContextService";

function createInitialState() {
  return {
    worldContext: null,
    isLoading: false,
    error: "",
  };
}

export function useWorldContext(birthDate, location) {
  const [state, setState] = useState(createInitialState);

  const countryCode = location?.countryCode ?? location?.country_code ?? "";

  useEffect(() => {
    if (
      !(birthDate instanceof Date) ||
      !Number.isFinite(birthDate.getTime()) ||
      !countryCode
    ) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadWorldContext() {
      setState({
        worldContext: null,
        isLoading: true,
        error: "",
      });

      try {
        const result = await getWorldContext(
          birthDate,
          {
            countryCode,
          },
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        setState({
          worldContext: result,
          isLoading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted || error?.name === "AbortError") {
          return;
        }

        console.error("Unable to load world context:", error);

        setState({
          worldContext: null,
          isLoading: false,
          error: "World context data is temporarily unavailable.",
        });
      }
    }

    loadWorldContext();

    return () => {
      controller.abort();
    };
  }, [birthDate, countryCode]);

  return state;
}
