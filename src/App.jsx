import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import ServicesSection from "./components/ServicesSection";
import StepsSection from "./components/StepsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar brand="DigiWeb" />
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <StepsSection />
      <ContactSection />
      <Footer brand="DigiWeb" />
    </>
  );
}

export default App;
