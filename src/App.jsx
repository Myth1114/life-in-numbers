import { useState } from "react";
import Hero from "./chapters/Hero/Hero";
import Arrival from "./chapters/Arrival/Arrival";
import { calculateLifeData } from "./utils/lifeCalculations";

function App() {
  const [lifeData, setLifeData] = useState(null);

  function handleBirthDateSubmit(birthDate) {
    const result = calculateLifeData(birthDate);

    setLifeData(result);

    console.log("Life data:", result);
  }

  return (
    <main className="home">
      <Hero />

      <Arrival onComplete={handleBirthDateSubmit} />
    </main>
  );
}

export default App;
