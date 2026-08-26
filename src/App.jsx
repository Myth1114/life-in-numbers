import { useState } from "react";
import Hero from "./chapters/Hero/Hero";
import Arrival from "./chapters/Arrival/Arrival";
import Time from "./chapters/Time/Time";
import Body from "./chapters/Body/Body";
import Sky from "./chapters/Sky/Sky";

import { calculateLifeData } from "./utils/lifeCalculations";
import Calendar from "./chapters/Calender/Calender";
import LifeWeeks from "./chapters/LifeWeeks/LifeWeeks";
import Remaining from "./chapters/Remaining/Remaining";
import Perspective from "./chapters/Perspective/Perspective";
import Today from "./chapters/Today/Today";

function App() {
  const [lifeData, setLifeData] = useState(null);

  const [birthDateValue, setBirthDateValue] = useState("");
  const [referenceAge, setReferenceAge] = useState(80);
  const [arrivalKey, setArrivalKey] = useState(0);

  function handleBirthDateSubmit(birthDate) {
    const result = calculateLifeData(birthDate, referenceAge);

    setBirthDateValue(birthDate);
    setLifeData(result);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    requestAnimationFrame(() => {
      document.getElementById("time")?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",

        block: "start",
      });
    });
  }
  function handleReferenceAgeChange(newReferenceAge) {
    setReferenceAge(newReferenceAge);

    if (!birthDateValue) {
      return;
    }

    const updatedLifeData = calculateLifeData(birthDateValue, newReferenceAge);

    setLifeData(updatedLifeData);
  }

  function scrollToSection(sectionId) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",

      block: "start",
    });
  }

  function handleReadAgain() {
    scrollToSection("time");
  }

  function handleAnotherDate() {
    setLifeData(null);
    setBirthDateValue("");
    setReferenceAge(80);

    setArrivalKey((current) => current + 1);

    requestAnimationFrame(() => {
      scrollToSection("arrival");
    });
  }

  function handleStartOver() {
    setLifeData(null);
    setBirthDateValue("");
    setReferenceAge(80);

    setArrivalKey((current) => current + 1);

    requestAnimationFrame(() => {
      scrollToSection("home");
    });
  }
  return (
    <main className="home">
      <Hero />

      <Arrival key={arrivalKey} onComplete={handleBirthDateSubmit} />

      {lifeData && (
        <>
          <Time lifeData={lifeData} />
          <Body lifeData={lifeData} />
          <Sky lifeData={lifeData} />
          <Calendar lifeData={lifeData} />
          <LifeWeeks lifeData={lifeData} />
          <Remaining
            lifeData={lifeData}
            onReferenceAgeChange={handleReferenceAgeChange}
          />
          <Perspective lifeData={lifeData} />
          <Today
            lifeData={lifeData}
            onReadAgain={handleReadAgain}
            onAnotherDate={handleAnotherDate}
            onStartOver={handleStartOver}
          />
        </>
      )}
    </main>
  );
}

export default App;
