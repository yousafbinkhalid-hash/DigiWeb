import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import StepsSection from "./components/StepsSection";

function App() {
  return (
    <>
      <Navbar brand="DigiWeb" />
      <HeroSection />
      <IntroSection />
      <StepsSection />
    </>
  );
}

export default App;
