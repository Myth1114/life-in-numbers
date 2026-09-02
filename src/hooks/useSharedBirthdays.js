import { useEffect, useState } from "react";

import { getSharedBirthdays } from "../services/peopleService";

export function useSharedBirthdays(birthDate) {
  const [peopleState, setPeopleState] = useState({
    status: "loading",
    people: [],
    message: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    let isActive = true;

    getSharedBirthdays({
      birthDate,
      signal: controller.signal,
    })
      .then((people) => {
        if (!isActive) {
          return;
        }

        if (people.length === 0) {
          setPeopleState({
            status: "unavailable",
            people: [],
            message: "No shared birthdays were found for this date.",
          });

          return;
        }

        setPeopleState({
          status: "success",
          people,
          message: "",
        });
      })
      .catch((error) => {
        if (!isActive || error.name === "AbortError") {
          return;
        }

        setPeopleState({
          status: "error",
          people: [],
          message: "Shared birthdays could not be loaded.",
        });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [birthDate]);

  return peopleState;
}
