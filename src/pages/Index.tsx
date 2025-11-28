import Hero from "@/components/Hero";
import ChapterGrid from "@/components/ChapterGrid";
import Characters from "@/components/Characters";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Characters />
      <ChapterGrid />
    </div>
  );
};

export default Index;
