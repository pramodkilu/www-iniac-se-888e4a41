import { useState, useEffect } from "react";
import { X, Lock, CheckCircle2, Play, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Chapter {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  locked?: boolean;
  completed?: boolean;
  icon: string;
  color: string;
}

interface Grade {
  id: number;
  label: string;
  color: string;
  chapters: Chapter[];
}

const generateChapters = (gradeId: number): Chapter[] => {
  const icons = ["🚗", "💨", "🎨", "🔧", "📐", "🏰", "🛞", "📏", "🍝", "🚀", "🖼️", "⚡", "🎠", "🔩", "🏗️", "💨", "⚖️", "💪", "☀️", "🔭", "⚡", "🌉", "🔄", "⚙️", "🎯", "🤖", "🌬️", "🌁", "🔧", "🏆"];
  const colors = ["#E53935", "#1E88E5", "#8E24AA", "#D81B60", "#FDD835", "#43A047", "#FB8C00", "#00ACC1", "#7CB342", "#3949AB", "#AB47BC", "#FFB300", "#EC407A", "#E53935", "#FF7043", "#26A69A", "#5C6BC0", "#00897B", "#FFA000", "#7B1FA2", "#C62828", "#455A64", "#6D4C41", "#37474F", "#D32F2F", "#1976D2", "#0097A7", "#512DA8", "#F57C00", "#FFD700"];
  const titles = [
    "Cart With Wheels", "Aerodynamic Car", "Sign Boards", "Bottle Opener", "Challenge Ladder",
    "Trebuchet", "Suspension Car", "Trundle Wheel", "Pasta Maker", "Launcher",
    "Flipping Picture", "Zip Line", "Merry-Go-Round", "Screw Press", "Crane",
    "Windmill", "Balance Scale", "Hydraulic Arm", "Solar Oven", "Periscope",
    "Electric Motor", "Bridge Builder", "Pulley System", "Gear Train", "Catapult Pro",
    "Robotic Arm", "Wind Turbine", "Suspension Bridge", "Compound Machine", "Final Project"
  ];
  const categories = ["Mechanics", "Physics", "Design", "Engineering", "Math", "Energy", "Art", "Electronics", "Robotics", "Creative"];
  const difficulties: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];
  
  return Array.from({ length: 30 }, (_, i) => ({
    id: (gradeId - 1) * 30 + i + 1,
    title: titles[i],
    description: `Chapter ${i + 1} of Grade ${gradeId} - Learn exciting STEM concepts through hands-on projects.`,
    difficulty: difficulties[Math.floor(i / 10)],
    category: categories[i % categories.length],
    completed: gradeId === 1 && i === 0,
    locked: i > 5,
    icon: icons[i],
    color: colors[i],
  }));
};

const grades: Grade[] = [
  { id: 1, label: "Grade 1", color: "#4CAF50", chapters: generateChapters(1) },
  { id: 2, label: "Grade 2", color: "#FFC107", chapters: generateChapters(2) },
  { id: 3, label: "Grade 3", color: "#FF9800", chapters: generateChapters(3) },
  { id: 4, label: "Grade 4", color: "#F44336", chapters: generateChapters(4) },
  { id: 5, label: "Grade 5", color: "#9C27B0", chapters: generateChapters(5) },
  { id: 6, label: "Grade 6", color: "#2196F3", chapters: generateChapters(6) },
  { id: 7, label: "Grade 7", color: "#00BCD4", chapters: generateChapters(7) },
  { id: 8, label: "Grade 8", color: "#607D8B", chapters: generateChapters(8) },
  { id: 9, label: "Grade 9", color: "#795548", chapters: generateChapters(9) },
];

const ChapterWheel = () => {
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animate rotation
  useEffect(() => {
    if (selectedGrade || isHovered) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [selectedGrade, isHovered]);

  const getPositionOnCircle = (index: number, total: number, radius: number, offsetAngle = -90, extraRotation = 0) => {
    const angle = ((index / total) * 360 + offsetAngle + extraRotation) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  // Floating particles data
  const particles = [
    { icon: "⚙️", radius: 235, speed: 0.8, offset: 0, size: 16 },
    { icon: "🔧", radius: 240, speed: -0.5, offset: 45, size: 14 },
    { icon: "💡", radius: 230, speed: 0.6, offset: 90, size: 18 },
    { icon: "🚀", radius: 245, speed: -0.7, offset: 135, size: 16 },
    { icon: "⚡", radius: 238, speed: 0.9, offset: 180, size: 15 },
    { icon: "🔬", radius: 242, speed: -0.4, offset: 225, size: 14 },
    { icon: "🌟", radius: 232, speed: 0.7, offset: 270, size: 17 },
    { icon: "📐", radius: 248, speed: -0.6, offset: 315, size: 15 },
  ];

  // Small dot particles
  const dotParticles = Array.from({ length: 20 }, (_, i) => ({
    radius: 210 + Math.random() * 50,
    speed: (Math.random() - 0.5) * 1.5,
    offset: (i / 20) * 360,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  const renderGradeCircles = () => {
    return (
      <svg 
        width="500" 
        height="500" 
        viewBox="-250 -250 500 500"
        className="max-w-full h-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating dot particles */}
        {dotParticles.map((particle, index) => {
          const angle = (particle.offset + rotation * particle.speed) * (Math.PI / 180);
          const x = Math.cos(angle) * particle.radius;
          const y = Math.sin(angle) * particle.radius;
          return (
            <circle
              key={`dot-${index}`}
              cx={x}
              cy={y}
              r={particle.size}
              fill="hsl(var(--primary))"
              opacity={particle.opacity}
            />
          );
        })}
        
        {/* Floating icon particles */}
        {particles.map((particle, index) => {
          const angle = (particle.offset + rotation * particle.speed) * (Math.PI / 180);
          const x = Math.cos(angle) * particle.radius;
          const y = Math.sin(angle) * particle.radius;
          return (
            <text
              key={`icon-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={particle.size}
              opacity={0.7}
              className="select-none pointer-events-none"
            >
              {particle.icon}
            </text>
          );
        })}
        
        {/* Animated outer rings */}
        <circle 
          r="220" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2" 
          opacity="0.2"
          strokeDasharray="10 5"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
        />
        <circle 
          r="200" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="1" 
          opacity="0.15"
          strokeDasharray="5 10"
          style={{ transform: `rotate(${-rotation * 0.5}deg)`, transformOrigin: 'center' }}
        />
        
        {/* Center hub with pulse effect */}
        <circle r="65" fill="hsl(var(--primary))" opacity="0.3" className="animate-pulse" />
        <circle r="60" fill="hsl(var(--primary))" />
        <text x="0" y="-10" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">BLIX</text>
        <text x="0" y="10" textAnchor="middle" fill="white" fontSize="11" opacity="0.9">Choose Grade</text>
        
        {/* Grade circles with rotation */}
        {grades.map((grade, index) => {
          const pos = getPositionOnCircle(index, grades.length, 150, -90, rotation);
          const completedCount = grade.chapters.filter(c => c.completed).length;
          
          return (
            <g 
              key={grade.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => setSelectedGrade(grade)}
              className="cursor-pointer"
            >
              {/* Outer glow on hover */}
              <circle
                r="48"
                fill={grade.color}
                opacity="0.2"
                className="transition-all hover:opacity-40"
              />
              
              {/* Main circle */}
              <circle
                r="40"
                fill={grade.color}
                className="transition-transform hover:scale-110 drop-shadow-lg"
              />
              
              {/* Grade number */}
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fill="white"
                fontSize="24"
                fontWeight="bold"
              >
                {grade.id}
              </text>
              
              {/* Label below */}
              <text
                x="0"
                y="60"
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="12"
                fontWeight="600"
              >
                Grade {grade.id}
              </text>
              
              {/* Chapter count */}
              <text
                x="0"
                y="74"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
              >
                {grade.chapters.length} chapters
              </text>
              
              {/* Progress indicator */}
              {completedCount > 0 && (
                <g transform="translate(28, -28)">
                  <circle r="12" fill="#4CAF50" />
                  <text x="0" y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    {completedCount}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderChapterCircles = () => {
    if (!selectedGrade) return null;
    
    const chapters = selectedGrade.chapters;
    
    // Distribute 30 chapters across 3 rings: 8, 10, 12
    const rings = [
      { count: 8, radius: 120, circleSize: 28, fontSize: 11 },
      { count: 10, radius: 200, circleSize: 32, fontSize: 12 },
      { count: 12, radius: 280, circleSize: 36, fontSize: 13 },
    ];
    
    let chapterIndex = 0;
    
    return (
      <div className="relative">
        {/* Back button */}
        <button
          onClick={() => {
            setSelectedGrade(null);
            setSelectedChapter(null);
          }}
          className="absolute top-0 left-0 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Grades</span>
        </button>
        
        <svg 
          width="700" 
          height="700" 
          viewBox="-350 -350 700 700"
          className="max-w-full h-auto mt-8"
        >
          {/* Animated decorative rings */}
          <circle 
            r="320" 
            fill="none" 
            stroke={selectedGrade.color} 
            strokeWidth="1" 
            opacity="0.15"
            strokeDasharray="8 4"
            style={{ transform: `rotate(${rotation * 0.3}deg)`, transformOrigin: 'center' }}
          />
          <circle 
            r="240" 
            fill="none" 
            stroke={selectedGrade.color} 
            strokeWidth="1" 
            opacity="0.2"
            strokeDasharray="5 8"
            style={{ transform: `rotate(${-rotation * 0.5}deg)`, transformOrigin: 'center' }}
          />
          <circle 
            r="160" 
            fill="none" 
            stroke={selectedGrade.color} 
            strokeWidth="1" 
            opacity="0.25"
            strokeDasharray="3 6"
            style={{ transform: `rotate(${rotation * 0.7}deg)`, transformOrigin: 'center' }}
          />
          
          {/* Center hub with grade info */}
          <circle r="55" fill={selectedGrade.color} opacity="0.3" className="animate-pulse" />
          <circle r="48" fill={selectedGrade.color} />
          <text x="0" y="-12" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Grade</text>
          <text x="0" y="14" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">{selectedGrade.id}</text>
          <text x="0" y="32" textAnchor="middle" fill="white" fontSize="9" opacity="0.9">30 Chapters</text>
          
          {/* Chapter circles in 3 rings */}
          {rings.map((ring, ringIndex) => {
            const ringChapters = chapters.slice(chapterIndex, chapterIndex + ring.count);
            const startIndex = chapterIndex;
            chapterIndex += ring.count;
            
            // Alternate rotation direction per ring
            const ringRotation = ringIndex % 2 === 0 ? rotation * 0.2 : -rotation * 0.15;
            
            return ringChapters.map((chapter, idx) => {
              const pos = getPositionOnCircle(idx, ring.count, ring.radius, -90, ringRotation);
              const isSelected = selectedChapter?.id === chapter.id;
              const chapterNum = startIndex + idx + 1;
              
              return (
                <g 
                  key={chapter.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedChapter(chapter)}
                  className="cursor-pointer"
                  style={{ transition: 'transform 0.3s ease' }}
                >
                  {/* Selection ring */}
                  {isSelected && (
                    <circle
                      r={ring.circleSize + 8}
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Outer glow */}
                  <circle
                    r={ring.circleSize + 4}
                    fill={chapter.locked ? "#9E9E9E" : chapter.color}
                    opacity="0.25"
                  />
                  
                  {/* Main circle */}
                  <circle
                    r={ring.circleSize}
                    fill={chapter.locked ? "#9E9E9E" : chapter.color}
                    className="transition-all duration-200 hover:brightness-110 drop-shadow-md"
                    style={{ 
                      filter: isSelected ? 'brightness(1.2) drop-shadow(0 0 8px rgba(255,215,0,0.6))' : undefined 
                    }}
                  />
                  
                  {/* Chapter number */}
                  <text
                    x="0"
                    y={-ring.circleSize * 0.15}
                    textAnchor="middle"
                    fill="white"
                    fontSize={ring.fontSize - 2}
                    fontWeight="bold"
                  >
                    {chapterNum}
                  </text>
                  
                  {/* Icon */}
                  <text
                    x="0"
                    y={ring.circleSize * 0.4}
                    textAnchor="middle"
                    fontSize={ring.fontSize}
                    className="select-none"
                  >
                    {chapter.locked ? "🔒" : chapter.icon}
                  </text>
                  
                  {/* Completed badge */}
                  {chapter.completed && (
                    <g transform={`translate(${ring.circleSize * 0.7}, ${-ring.circleSize * 0.7})`}>
                      <circle r="8" fill="#4CAF50" />
                      <text x="0" y="3" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">✓</text>
                    </g>
                  )}
                </g>
              );
            });
          })}
        </svg>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {selectedGrade ? `${selectedGrade.label} Chapters` : "Choose Your Grade"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {selectedGrade 
              ? `Explore ${selectedGrade.chapters.length} exciting STEM projects` 
              : "30 amazing STEM projects across 9 grade levels"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Circular Display */}
          <div className="relative flex-shrink-0">
            {selectedGrade ? renderChapterCircles() : renderGradeCircles()}
          </div>

          {/* Detail Panel */}
          <div className="w-full lg:w-80 min-h-[320px]">
            {selectedChapter ? (
              <div className="bg-card border rounded-2xl p-6 shadow-lg animate-fade-in relative">
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Chapter {selectedChapter.id}
                  </span>
                  <h3 className="text-2xl font-bold mt-1">{selectedChapter.title}</h3>
                </div>
                
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ backgroundColor: selectedChapter.color }}
                >
                  {selectedChapter.locked ? "🔒" : selectedChapter.icon}
                </div>
                
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {selectedChapter.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: selectedChapter.color }}
                  >
                    {selectedChapter.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
                    {selectedChapter.category}
                  </span>
                  {selectedGrade && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
                      {selectedGrade.label}
                    </span>
                  )}
                </div>
                
                {selectedChapter.completed && (
                  <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
                
                {selectedChapter.locked ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Complete previous chapters to unlock</span>
                  </div>
                ) : (
                  <Link to={`/chapter/${selectedChapter.id}`}>
                    <Button className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Start Chapter
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-muted/50 border-2 border-dashed rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">{selectedGrade ? "👆" : "🎯"}</span>
                </div>
                <p className="text-muted-foreground font-medium">
                  {selectedGrade 
                    ? "Click on a chapter to see details"
                    : "Click on a grade circle to explore chapters"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChapterWheel;
