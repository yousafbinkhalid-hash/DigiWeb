import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import ServicesSection from "./components/ServicesSection";
import StepsSection from "./components/StepsSection";

function App() {
  return (
    <>
      <Navbar brand="DigiWeb" />
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <StepsSection />
    </>
  );
}

export default App;
