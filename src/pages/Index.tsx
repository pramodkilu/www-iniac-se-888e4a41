import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChapterWheel from "@/components/ChapterWheel";
import Characters from "@/components/Characters";
import RoboLigaSection from "@/components/RoboLigaSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Hero />
        <RoboLigaSection />
        <Characters />
        <ChapterWheel />
      </div>
    </div>
  );
};

export default Index;
