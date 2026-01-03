import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChapterWheel from "@/components/ChapterWheel";
import Characters from "@/components/Characters";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Hero />
        <Characters />
        <ChapterWheel />
      </div>
    </div>
  );
};

export default Index;
