import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Hero from "./Hero";
import RoboLigaSection from "./RoboLigaSection";
import ChapterWheel from "./ChapterWheel";

interface Slide {
  id: string;
  label: string;
  component: React.ReactNode;
}

const slides: Slide[] = [
  { id: "iniac", label: "INIAC", component: <Hero /> },
  { id: "roboliga", label: "SweSkola", component: <RoboLigaSection /> },
  { id: "chapters", label: "Explore", component: <ChapterWheel /> },
];

const SWIPE_THRESHOLD = 50;

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Touch/swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-play on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsAutoPlaying(false);
    // Resume after 30 seconds of no interaction
    const timeout = setTimeout(() => setIsAutoPlaying(true), 30000);
    return () => clearTimeout(timeout);
  }, []);

  // Touch event handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      handleUserInteraction();
      if (diff > 0) {
        // Swiped left - go to next slide
        nextSlide();
      } else {
        // Swiped right - go to previous slide
        prevSlide();
      }
    }
    
    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  }, [nextSlide, prevSlide, handleUserInteraction]);

  return (
    <div 
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className="w-full flex-shrink-0"
          >
            {slide.component}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => { prevSlide(); handleUserInteraction(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-2 md:p-3 shadow-lg hover:bg-background transition-colors group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-primary transition-colors" />
      </button>
      
      <button
        onClick={() => { nextSlide(); handleUserInteraction(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-2 md:p-3 shadow-lg hover:bg-background transition-colors group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => { goToSlide(index); handleUserInteraction(); }}
            className="group flex flex-col items-center gap-1"
            aria-label={`Go to ${slide.label} slide`}
          >
            <span 
              className={cn(
                "text-xs font-medium transition-all duration-300",
                currentSlide === index 
                  ? "text-primary opacity-100" 
                  : "text-foreground/60 opacity-0 group-hover:opacity-100"
              )}
            >
              {slide.label}
            </span>
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSlide === index 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-foreground/30 group-hover:bg-foreground/50"
              )}
            />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10 z-20">
          <div 
            className="h-full bg-primary transition-none"
            style={{
              animation: 'progress-fill 8s linear infinite',
              animationPlayState: isTransitioning ? 'paused' : 'running'
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
