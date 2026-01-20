const StatsSection = () => {
  return (
    <section className="py-12 px-4 bg-muted/50">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">9</div>
            <div className="text-sm text-muted-foreground mt-1">Grade Levels</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">270</div>
            <div className="text-sm text-muted-foreground mt-1">STEM Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">AI+AR+VR</div>
            <div className="text-sm text-muted-foreground mt-1">Technologies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">∞</div>
            <div className="text-sm text-muted-foreground mt-1">Learning Fun</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
