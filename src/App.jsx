import { useState } from "react";

import Hero from "./chapters/Hero/Hero";
import Arrival from "./chapters/Arrival/Arrival";
import Time from "./chapters/Time/Time";
import Body from "./chapters/Body/Body";
import Sky from "./chapters/Sky/Sky";
import Calendar from "./chapters/Calender/Calender";
import Today from "./chapters/Today/Today";

import TimeRewind from "./components/transition/TimeRewind";

import { calculateLifeData } from "./utils/lifeCalculations";
import DayArrived from "./chapters/DayArrived/DayArrived";
import SharedLives from "./chapters/SharedLives/SharedLives";
import DateHistory from "./chapters/DateHistory/DateHistory";
import Soundtrack from "./chapters/Soundtrack/Soundtrack";

function App() {
  const [lifeData, setLifeData] = useState(null);

  const [isRewinding, setIsRewinding] = useState(false);

  const [arrivalKey, setArrivalKey] = useState(0);

  function handleBirthDateSubmit(arrivalData) {
    const result = calculateLifeData(arrivalData.birthDate);

    setLifeData({
      ...result,

      arrival: {
        birthDate: result.birthDate,
        location: arrivalData.location,
      },
    });

    setIsRewinding(true);
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

  function handleRewindComplete() {
    setIsRewinding(false);

    requestAnimationFrame(() => {
      scrollToSection("day-arrived");
    });
  }

  function handleReadAgain() {
    scrollToSection("day-arrived");
  }

  function handleAnotherDate() {
    setIsRewinding(false);
    setLifeData(null);

    setArrivalKey((current) => current + 1);

    requestAnimationFrame(() => {
      scrollToSection("arrival");
    });
  }

  function handleStartOver() {
    setIsRewinding(false);
    setLifeData(null);

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
          <DayArrived lifeData={lifeData} />
          <Time lifeData={lifeData} />
          <Body lifeData={lifeData} />
          <Sky lifeData={lifeData} />
          <Calendar lifeData={lifeData} />
          <Soundtrack lifeData={lifeData} />
          <DateHistory lifeData={lifeData} />
          <SharedLives lifeData={lifeData} />
          <Today
            lifeData={lifeData}
            onReadAgain={handleReadAgain}
            onAnotherDate={handleAnotherDate}
            onStartOver={handleStartOver}
          />
        </>
      )}
      {isRewinding && lifeData && (
        <TimeRewind
          birthDate={lifeData.birthDate}
          location={lifeData.arrival.location}
          onComplete={handleRewindComplete}
        />
      )}
    </main>
  );
}

export default App;
