import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import PlatformFeatures from "@/components/PlatformFeatures";
import StatsSection from "@/components/StatsSection";
import Characters from "@/components/Characters";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <HeroSlider />
        <PlatformFeatures />
        <StatsSection />
        <Characters />
      </div>
    </div>
  );
};

export default Index;
