import { useEffect, useState } from "react";

import {
  getFormulaOneChampion,
  getNobelPeacePrize,
} from "../services/honoursService";

function createFailedResult(message) {
  return {
    available: false,
    reason: message,
  };
}

export function useCultureHonours(year) {
  const [honoursState, setHonoursState] = useState({
    status: "loading",

    nobelPeacePrize: null,

    formulaOneChampion: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    let isActive = true;

    Promise.allSettled([
      getNobelPeacePrize({
        year,
        signal: controller.signal,
      }),

      getFormulaOneChampion({
        year,
        signal: controller.signal,
      }),
    ]).then((results) => {
      if (!isActive) {
        return;
      }

      const [nobelResult, formulaOneResult] = results;

      const nobelPeacePrize =
        nobelResult.status === "fulfilled"
          ? nobelResult.value
          : createFailedResult(
              "Nobel Peace Prize information could not be loaded."
            );

      const formulaOneChampion =
        formulaOneResult.status === "fulfilled"
          ? formulaOneResult.value
          : createFailedResult(
              "Formula One championship information could not be loaded."
            );

      const hasAvailableResult =
        nobelPeacePrize.available || formulaOneChampion.available;

      setHonoursState({
        status: hasAvailableResult ? "success" : "unavailable",

        nobelPeacePrize,

        formulaOneChampion,
      });
    });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [year]);

  return honoursState;
}
