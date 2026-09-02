import { useEffect, useState } from "react";

import { getBirthWeekSoundtrack } from "../services/soundtrackService";

export function useBirthWeekSoundtrack(birthDate) {
  const [soundtrackState, setSoundtrackState] = useState({
    status: "loading",
    data: null,
    message: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    let isActive = true;

    getBirthWeekSoundtrack({
      birthDate,
      signal: controller.signal,
    })
      .then((soundtrack) => {
        if (!isActive) {
          return;
        }

        if (!soundtrack.available) {
          setSoundtrackState({
            status: "unavailable",
            data: null,
            message: soundtrack.reason,
          });

          return;
        }

        setSoundtrackState({
          status: "success",
          data: soundtrack,
          message: "",
        });
      })
      .catch((error) => {
        if (!isActive || error.name === "AbortError") {
          return;
        }

        setSoundtrackState({
          status: "error",
          data: null,
          message: "The birth-week soundtrack could not be loaded.",
        });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [birthDate]);

  return soundtrackState;
}
