import { useState } from "react";
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

const grades: Grade[] = [
  {
    id: 1,
    label: "Grade 1",
    color: "#4CAF50",
    chapters: [
      { id: 1, title: "Cart With Wheels", description: "Learn about friction and motion by building your first wheeled vehicle.", difficulty: "Easy", category: "Mechanics", completed: true, icon: "🚗", color: "#E53935" },
      { id: 2, title: "Aerodynamic Car", description: "Discover aerodynamics and speed. Shape your car to cut through air.", difficulty: "Easy", category: "Physics", icon: "💨", color: "#1E88E5" },
      { id: 3, title: "Sign Boards", description: "Learn about shapes, balance and design principles.", difficulty: "Easy", category: "Design", icon: "🎨", color: "#8E24AA" },
      { id: 4, title: "Bottle Opener", description: "Simple machines in action - levers and mechanical advantage.", difficulty: "Easy", category: "Mechanics", icon: "🔧", color: "#D81B60" },
    ],
  },
  {
    id: 2,
    label: "Grade 2",
    color: "#FFC107",
    chapters: [
      { id: 5, title: "Challenge Ladder", description: "Calculate angles and build stable structures using triangles.", difficulty: "Medium", category: "Math", icon: "📐", color: "#FDD835" },
      { id: 6, title: "Trebuchet", description: "Explore gravity, levers and projectile motion.", difficulty: "Medium", category: "Physics", icon: "🏰", color: "#43A047" },
      { id: 7, title: "Suspension Car", description: "Understand how suspension systems absorb shock.", difficulty: "Medium", category: "Engineering", icon: "🛞", color: "#FB8C00" },
      { id: 8, title: "Trundle Wheel", description: "Measure distance accurately using circumference.", difficulty: "Medium", category: "Math", icon: "📏", color: "#00ACC1" },
    ],
  },
  {
    id: 3,
    label: "Grade 3",
    color: "#FF9800",
    chapters: [
      { id: 9, title: "Pasta Maker", description: "Build mechanical tools with gears and rotation.", difficulty: "Medium", category: "Mechanics", icon: "🍝", color: "#7CB342" },
      { id: 10, title: "Launcher", description: "Force and projectile motion - calculate trajectories.", difficulty: "Hard", category: "Physics", locked: true, icon: "🚀", color: "#3949AB" },
      { id: 11, title: "Flipping Picture", description: "Optical illusions - persistence of vision explained.", difficulty: "Easy", category: "Art", icon: "🖼️", color: "#AB47BC" },
    ],
  },
  {
    id: 4,
    label: "Grade 4",
    color: "#F44336",
    chapters: [
      { id: 12, title: "Zip Line", description: "Energy transformation - potential to kinetic.", difficulty: "Medium", category: "Physics", icon: "⚡", color: "#FFB300" },
      { id: 13, title: "Merry-Go-Round", description: "Rotational mechanics and centripetal force.", difficulty: "Medium", category: "Mechanics", locked: true, icon: "🎠", color: "#EC407A" },
      { id: 14, title: "Screw Press", description: "Mechanical advantage through helical motion.", difficulty: "Hard", category: "Engineering", locked: true, icon: "🔩", color: "#E53935" },
    ],
  },
  {
    id: 5,
    label: "Grade 5",
    color: "#9C27B0",
    chapters: [
      { id: 15, title: "Crane", description: "Lifting mechanisms, pulleys, and construction.", difficulty: "Hard", category: "Engineering", locked: true, icon: "🏗️", color: "#FF7043" },
      { id: 16, title: "Windmill", description: "Harness wind energy and learn about renewable power.", difficulty: "Medium", category: "Energy", icon: "💨", color: "#26A69A" },
      { id: 17, title: "Balance Scale", description: "Understanding equilibrium and weight distribution.", difficulty: "Easy", category: "Physics", icon: "⚖️", color: "#5C6BC0" },
    ],
  },
  {
    id: 6,
    label: "Grade 6",
    color: "#2196F3",
    chapters: [
      { id: 18, title: "Hydraulic Arm", description: "Learn about fluid mechanics and hydraulic systems.", difficulty: "Hard", category: "Engineering", icon: "💪", color: "#00897B" },
      { id: 19, title: "Solar Oven", description: "Use solar energy to cook - renewable energy in action.", difficulty: "Medium", category: "Energy", icon: "☀️", color: "#FFA000" },
      { id: 20, title: "Periscope", description: "Optics and reflection - see around corners.", difficulty: "Easy", category: "Physics", icon: "🔭", color: "#7B1FA2" },
    ],
  },
  {
    id: 7,
    label: "Grade 7",
    color: "#00BCD4",
    chapters: [
      { id: 21, title: "Electric Motor", description: "Build a simple motor and learn electromagnetism.", difficulty: "Hard", category: "Electronics", locked: true, icon: "⚡", color: "#C62828" },
      { id: 22, title: "Bridge Builder", description: "Engineering strong structures - tension and compression.", difficulty: "Medium", category: "Engineering", icon: "🌉", color: "#455A64" },
      { id: 23, title: "Pulley System", description: "Mechanical advantage with multiple pulleys.", difficulty: "Medium", category: "Mechanics", icon: "🔄", color: "#6D4C41" },
    ],
  },
  {
    id: 8,
    label: "Grade 8",
    color: "#607D8B",
    chapters: [
      { id: 24, title: "Gear Train", description: "Complex gear systems and ratio calculations.", difficulty: "Hard", category: "Mechanics", icon: "⚙️", color: "#37474F" },
      { id: 25, title: "Catapult Pro", description: "Advanced projectile physics with adjustable angles.", difficulty: "Hard", category: "Physics", locked: true, icon: "🎯", color: "#D32F2F" },
      { id: 26, title: "Robotic Arm", description: "Introduction to robotics and programmed movement.", difficulty: "Hard", category: "Robotics", locked: true, icon: "🤖", color: "#1976D2" },
    ],
  },
  {
    id: 9,
    label: "Grade 9",
    color: "#795548",
    chapters: [
      { id: 27, title: "Wind Turbine", description: "Generate electricity from wind power.", difficulty: "Hard", category: "Energy", locked: true, icon: "🌬️", color: "#0097A7" },
      { id: 28, title: "Suspension Bridge", description: "Advanced bridge engineering with cables.", difficulty: "Hard", category: "Engineering", locked: true, icon: "🌁", color: "#512DA8" },
      { id: 29, title: "Compound Machine", description: "Combine multiple simple machines.", difficulty: "Hard", category: "Mechanics", locked: true, icon: "🔧", color: "#F57C00" },
      { id: 30, title: "Final Project", description: "Design and build your own STEM creation.", difficulty: "Hard", category: "Creative", locked: true, icon: "🏆", color: "#FFD700" },
    ],
  },
];

const ChapterWheel = () => {
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const getPositionOnCircle = (index: number, total: number, radius: number, offsetAngle = -90) => {
    const angle = ((index / total) * 360 + offsetAngle) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const renderGradeCircles = () => {
    return (
      <svg 
        width="500" 
        height="500" 
        viewBox="-250 -250 500 500"
        className="max-w-full h-auto"
      >
        {/* Outer decorative ring */}
        <circle r="220" fill="none" stroke="hsl(var(--border))" strokeWidth="2" opacity="0.3" />
        
        {/* Center hub */}
        <circle r="60" fill="hsl(var(--primary))" />
        <text x="0" y="-10" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">BLIX</text>
        <text x="0" y="10" textAnchor="middle" fill="white" fontSize="11" opacity="0.9">Choose Grade</text>
        
        {/* Grade circles */}
        {grades.map((grade, index) => {
          const pos = getPositionOnCircle(index, grades.length, 150);
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
    const radius = chapters.length <= 4 ? 120 : chapters.length <= 6 ? 140 : 160;
    
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
          width="500" 
          height="500" 
          viewBox="-250 -250 500 500"
          className="max-w-full h-auto mt-8"
        >
          {/* Outer decorative ring */}
          <circle r="200" fill="none" stroke={selectedGrade.color} strokeWidth="2" opacity="0.3" />
          
          {/* Center hub with grade info */}
          <circle r="70" fill={selectedGrade.color} />
          <text x="0" y="-15" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Grade</text>
          <text x="0" y="15" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">{selectedGrade.id}</text>
          <text x="0" y="35" textAnchor="middle" fill="white" fontSize="10" opacity="0.9">{chapters.length} Chapters</text>
          
          {/* Chapter circles */}
          {chapters.map((chapter, index) => {
            const pos = getPositionOnCircle(index, chapters.length, radius);
            const isSelected = selectedChapter?.id === chapter.id;
            
            return (
              <g 
                key={chapter.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedChapter(chapter)}
                className="cursor-pointer"
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    r="50"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                )}
                
                {/* Outer glow */}
                <circle
                  r="44"
                  fill={chapter.locked ? "#9E9E9E" : chapter.color}
                  opacity="0.3"
                  className="transition-all"
                />
                
                {/* Main circle */}
                <circle
                  r="38"
                  fill={chapter.locked ? "#9E9E9E" : chapter.color}
                  className="transition-transform hover:scale-105 drop-shadow-lg"
                />
                
                {/* Chapter number */}
                <text
                  x="0"
                  y="-8"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Ch.{chapter.id}
                </text>
                
                {/* Icon */}
                <text
                  x="0"
                  y="14"
                  textAnchor="middle"
                  fontSize="18"
                  className="select-none"
                >
                  {chapter.locked ? "🔒" : chapter.icon}
                </text>
                
                {/* Title below */}
                <text
                  x="0"
                  y="62"
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="9"
                  fontWeight="500"
                >
                  {chapter.title.length > 14 ? chapter.title.slice(0, 12) + "..." : chapter.title}
                </text>
                
                {/* Completed badge */}
                {chapter.completed && (
                  <g transform="translate(26, -26)">
                    <circle r="10" fill="#4CAF50" />
                    <text x="0" y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">✓</text>
                  </g>
                )}
              </g>
            );
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
