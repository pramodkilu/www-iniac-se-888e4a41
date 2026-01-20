import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RoboLigaSection from "@/components/RoboLigaSection";
import PlatformFeatures from "@/components/PlatformFeatures";
import StatsSection from "@/components/StatsSection";
import Characters from "@/components/Characters";
import ChapterWheel from "@/components/ChapterWheel";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Hero />
        <RoboLigaSection />
        <PlatformFeatures />
        <StatsSection />
        <Characters />
        <ChapterWheel />
      </div>
    </div>
  );
};

export default Index;
