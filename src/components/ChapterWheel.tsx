import { useState } from "react";
import { X, Lock, CheckCircle2, Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Chapter {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  grade: number;
  locked?: boolean;
  completed?: boolean;
  icon: string;
  color: string;
}

const chapters: Chapter[] = [
  // Grade 1 - Inner ring
  { id: 1, title: "Cart With Wheels", description: "Learn about friction and motion by building your first wheeled vehicle.", difficulty: "Easy", category: "Mechanics", grade: 1, completed: true, icon: "🚗", color: "#E53935" },
  { id: 2, title: "Aerodynamic Car", description: "Discover aerodynamics and speed. Shape your car to cut through air.", difficulty: "Easy", category: "Physics", grade: 1, icon: "💨", color: "#1E88E5" },
  { id: 3, title: "Sign Boards", description: "Learn about shapes, balance and design principles.", difficulty: "Easy", category: "Design", grade: 1, icon: "🎨", color: "#8E24AA" },
  { id: 4, title: "Bottle Opener", description: "Simple machines in action - levers and mechanical advantage.", difficulty: "Easy", category: "Mechanics", grade: 1, icon: "🔧", color: "#D81B60" },
  
  // Grade 2 - Second ring  
  { id: 5, title: "Challenge Ladder", description: "Calculate angles and build stable structures using triangles.", difficulty: "Medium", category: "Math", grade: 2, icon: "📐", color: "#FDD835" },
  { id: 6, title: "Trebuchet", description: "Explore gravity, levers and projectile motion.", difficulty: "Medium", category: "Physics", grade: 2, icon: "🏰", color: "#43A047" },
  { id: 7, title: "Suspension Car", description: "Understand how suspension systems absorb shock.", difficulty: "Medium", category: "Engineering", grade: 2, icon: "🛞", color: "#FB8C00" },
  { id: 8, title: "Trundle Wheel", description: "Measure distance accurately using circumference.", difficulty: "Medium", category: "Math", grade: 2, icon: "📏", color: "#00ACC1" },
  { id: 9, title: "Pasta Maker", description: "Build mechanical tools with gears and rotation.", difficulty: "Medium", category: "Mechanics", grade: 2, icon: "🍝", color: "#7CB342" },
  
  // Grade 3 - Third ring
  { id: 10, title: "Launcher", description: "Force and projectile motion - calculate trajectories.", difficulty: "Hard", category: "Physics", grade: 3, locked: true, icon: "🚀", color: "#3949AB" },
  { id: 11, title: "Flipping Picture", description: "Optical illusions - persistence of vision explained.", difficulty: "Easy", category: "Art", grade: 3, icon: "🖼️", color: "#AB47BC" },
  { id: 12, title: "Zip Line", description: "Energy transformation - potential to kinetic.", difficulty: "Medium", category: "Physics", grade: 3, icon: "⚡", color: "#FFB300" },
  { id: 13, title: "Merry-Go-Round", description: "Rotational mechanics and centripetal force.", difficulty: "Medium", category: "Mechanics", grade: 3, locked: true, icon: "🎠", color: "#EC407A" },
  
  // Grade 4 - Outer ring
  { id: 14, title: "Screw Press", description: "Mechanical advantage through helical motion.", difficulty: "Hard", category: "Engineering", grade: 4, locked: true, icon: "🔩", color: "#E53935" },
  { id: 15, title: "Crane", description: "Lifting mechanisms, pulleys, and construction.", difficulty: "Hard", category: "Engineering", grade: 4, locked: true, icon: "🏗️", color: "#FF7043" },
];

const gradeInfo = {
  1: { label: "Grade 1", color: "#4CAF50", radius: 90 },
  2: { label: "Grade 2", color: "#FFC107", radius: 150 },
  3: { label: "Grade 3", color: "#FF9800", radius: 210 },
  4: { label: "Grade 4", color: "#F44336", radius: 270 },
};

const ChapterWheel = () => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const getChaptersByGrade = (grade: number) => chapters.filter(c => c.grade === grade);
  
  const getPositionOnRing = (index: number, total: number, radius: number, offsetAngle = -90) => {
    const angle = ((index / total) * 360 + offsetAngle) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const renderChapterTile = (chapter: Chapter, x: number, y: number, size: number) => {
    const isSelected = selectedChapter?.id === chapter.id;
    
    return (
      <g 
        key={chapter.id}
        transform={`translate(${x}, ${y})`}
        onClick={() => setSelectedChapter(chapter)}
        className="cursor-pointer"
        style={{ transition: 'transform 0.2s ease' }}
      >
        {/* Selection ring */}
        {isSelected && (
          <rect
            x={-size/2 - 4}
            y={-size/2 - 4}
            width={size + 8}
            height={size + 8}
            rx="6"
            fill="none"
            stroke="#FFD700"
            strokeWidth="3"
            className="animate-pulse"
          />
        )}
        
        {/* Main tile */}
        <rect
          x={-size/2}
          y={-size/2}
          width={size}
          height={size}
          rx="4"
          fill={chapter.locked ? "#9E9E9E" : chapter.color}
          className="hover:brightness-110 transition-all"
        />
        
        {/* Chapter number */}
        <text
          x={-size/2 + 6}
          y={-size/2 + 14}
          fill="white"
          fontSize="11"
          fontWeight="bold"
        >
          {chapter.id}
        </text>
        
        {/* Title (abbreviated) */}
        <text
          x={-size/2 + 6}
          y={-size/2 + 26}
          fill="white"
          fontSize="7"
          fontWeight="500"
          opacity="0.9"
        >
          {chapter.title.length > 12 ? chapter.title.split(' ').slice(0, 2).join(' ') : chapter.title}
        </text>
        
        {/* Icon */}
        <text
          x={0}
          y={size/2 - 10}
          textAnchor="middle"
          fontSize={size > 50 ? "20" : "16"}
          className="select-none"
        >
          {chapter.locked ? "🔒" : chapter.icon}
        </text>
        
        {/* Completed badge */}
        {chapter.completed && (
          <>
            <circle cx={size/2 - 8} cy={-size/2 + 8} r="8" fill="#4CAF50" />
            <text x={size/2 - 8} y={-size/2 + 12} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">✓</text>
          </>
        )}
      </g>
    );
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Adventure</h2>
          <p className="text-xl text-muted-foreground">30 exciting STEM projects organized by grade level</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Circular Wheel */}
          <div className="relative flex-shrink-0">
            <svg 
              width="580" 
              height="580" 
              viewBox="-290 -290 580 580"
              className="max-w-full h-auto"
            >
              {/* Background rings */}
              {[4, 3, 2, 1].map(grade => (
                <circle
                  key={`ring-${grade}`}
                  r={gradeInfo[grade as keyof typeof gradeInfo].radius + 30}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="50"
                  opacity="0.15"
                />
              ))}
              
              {/* Radial dividers */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                return (
                  <line
                    key={`divider-${i}`}
                    x1={Math.cos(angle) * 60}
                    y1={Math.sin(angle) * 60}
                    x2={Math.cos(angle) * 285}
                    y2={Math.sin(angle) * 285}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                );
              })}
              
              {/* Center hub */}
              <circle r="55" fill="hsl(var(--primary))" />
              <text x="0" y="-8" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">BLIX</text>
              <text x="0" y="10" textAnchor="middle" fill="white" fontSize="10" opacity="0.8">STEM</text>
              <text x="0" y="24" textAnchor="middle" fill="white" fontSize="10" opacity="0.8">Learning</text>
              
              {/* Grade labels on rings */}
              {Object.entries(gradeInfo).map(([grade, info]) => (
                <g key={`label-${grade}`}>
                  <text
                    x={0}
                    y={-(info.radius + 15)}
                    textAnchor="middle"
                    fill="hsl(var(--muted-foreground))"
                    fontSize="10"
                    fontWeight="600"
                    className="uppercase tracking-wider"
                  >
                    {info.label}
                  </text>
                </g>
              ))}
              
              {/* Chapter tiles by grade */}
              {[1, 2, 3, 4].map(grade => {
                const gradeChapters = getChaptersByGrade(grade);
                const info = gradeInfo[grade as keyof typeof gradeInfo];
                const tileSize = grade === 1 ? 48 : grade === 2 ? 52 : grade === 3 ? 56 : 58;
                
                return gradeChapters.map((chapter, index) => {
                  const pos = getPositionOnRing(index, gradeChapters.length, info.radius);
                  return renderChapterTile(chapter, pos.x, pos.y, tileSize);
                });
              })}
            </svg>
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
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
                    {gradeInfo[selectedChapter.grade as keyof typeof gradeInfo].label}
                  </span>
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
                  <span className="text-3xl">👆</span>
                </div>
                <p className="text-muted-foreground font-medium">
                  Click on any chapter tile to see details
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
