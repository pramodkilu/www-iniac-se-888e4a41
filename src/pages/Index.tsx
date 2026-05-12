import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingSections from "@/components/LandingSections";
import SDGSection from "@/components/SDGSection";
import PlatformFeatures from "@/components/PlatformFeatures";
import StatsSection from "@/components/StatsSection";
import Characters from "@/components/Characters";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <LandingSections />
        <SDGSection />
        <PlatformFeatures />
        <StatsSection />
        <Characters />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
