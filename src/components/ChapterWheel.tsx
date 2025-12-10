import { useState } from "react";
import { X, Lock, CheckCircle2, Play } from "lucide-react";
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
  { id: 1, title: "Cart With Wheels", description: "Learn about friction and motion by building your first wheeled vehicle. Discover how different surfaces affect movement.", difficulty: "Easy", category: "Mechanics", grade: 1, completed: true, icon: "🚗", color: "hsl(25, 95%, 53%)" },
  { id: 2, title: "Aerodynamic Car", description: "Discover aerodynamics and speed. Shape your car to cut through air resistance.", difficulty: "Easy", category: "Physics", grade: 1, icon: "💨", color: "hsl(200, 95%, 50%)" },
  { id: 3, title: "Sign Boards", description: "Learn about shapes, balance and design principles.", difficulty: "Easy", category: "Design", grade: 1, icon: "🎨", color: "hsl(280, 85%, 55%)" },
  { id: 4, title: "Bottle Opener", description: "Simple machines in action - levers and mechanical advantage.", difficulty: "Easy", category: "Mechanics", grade: 1, icon: "🔧", color: "hsl(340, 85%, 50%)" },
  
  // Grade 2 - Second ring
  { id: 5, title: "Challenge Ladder", description: "Calculate angles and build stable structures using triangles.", difficulty: "Medium", category: "Math", grade: 2, icon: "📐", color: "hsl(45, 95%, 50%)" },
  { id: 6, title: "Trebuchet", description: "Explore gravity, levers and projectile motion with this medieval machine.", difficulty: "Medium", category: "Physics", grade: 2, icon: "🏰", color: "hsl(150, 85%, 40%)" },
  { id: 7, title: "Suspension Car", description: "Understand how suspension systems absorb shock and provide comfort.", difficulty: "Medium", category: "Engineering", grade: 2, icon: "🛞", color: "hsl(10, 90%, 55%)" },
  { id: 8, title: "Trundle Wheel", description: "Measure distance accurately using circumference calculations.", difficulty: "Medium", category: "Math", grade: 2, icon: "📏", color: "hsl(180, 70%, 45%)" },
  { id: 9, title: "Pasta Maker", description: "Build mechanical tools with gears and rotational motion.", difficulty: "Medium", category: "Mechanics", grade: 2, icon: "🍝", color: "hsl(60, 85%, 50%)" },
  
  // Grade 3 - Third ring
  { id: 10, title: "Launcher", description: "Force and projectile motion - calculate trajectories and launch distances.", difficulty: "Hard", category: "Physics", grade: 3, locked: true, icon: "🚀", color: "hsl(220, 90%, 55%)" },
  { id: 11, title: "Flipping Picture", description: "Optical illusions and art - persistence of vision explained.", difficulty: "Easy", category: "Art", grade: 3, icon: "🖼️", color: "hsl(300, 80%, 50%)" },
  { id: 12, title: "Zip Line", description: "Energy transformation - potential to kinetic energy.", difficulty: "Medium", category: "Physics", grade: 3, icon: "⚡", color: "hsl(55, 95%, 50%)" },
  { id: 13, title: "Merry-Go-Round", description: "Rotational mechanics and centripetal force in action.", difficulty: "Medium", category: "Mechanics", grade: 3, locked: true, icon: "🎠", color: "hsl(320, 85%, 55%)" },
  
  // Grade 4 - Outer ring
  { id: 14, title: "Screw Press", description: "Mechanical advantage through helical motion and torque.", difficulty: "Hard", category: "Engineering", grade: 4, locked: true, icon: "🔩", color: "hsl(0, 85%, 50%)" },
  { id: 15, title: "Crane", description: "Lifting mechanisms, pulleys, and construction engineering.", difficulty: "Hard", category: "Engineering", grade: 4, locked: true, icon: "🏗️", color: "hsl(35, 90%, 50%)" },
];

const gradeColors = {
  1: "hsl(142, 76%, 36%)",
  2: "hsl(45, 93%, 47%)",
  3: "hsl(25, 95%, 53%)",
  4: "hsl(0, 84%, 60%)",
};

const gradeLabels = {
  1: "Grade 1",
  2: "Grade 2", 
  3: "Grade 3",
  4: "Grade 4",
};

const ChapterWheel = () => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);

  const getChaptersByGrade = (grade: number) => chapters.filter(c => c.grade === grade);
  
  const getPositionOnRing = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const renderChapterNode = (chapter: Chapter, x: number, y: number) => {
    const isSelected = selectedChapter?.id === chapter.id;
    const isHovered = hoveredChapter === chapter.id;
    
    return (
      <g 
        key={chapter.id}
        transform={`translate(${x}, ${y})`}
        onClick={() => setSelectedChapter(chapter)}
        onMouseEnter={() => setHoveredChapter(chapter.id)}
        onMouseLeave={() => setHoveredChapter(null)}
        className="cursor-pointer"
      >
        {/* Glow effect */}
        {(isSelected || isHovered) && (
          <circle
            r="38"
            fill={chapter.color}
            opacity="0.3"
            className="animate-pulse"
          />
        )}
        
        {/* Main circle background */}
        <rect
          x="-32"
          y="-32"
          width="64"
          height="64"
          rx="8"
          fill={chapter.locked ? "hsl(var(--muted))" : chapter.color}
          stroke={isSelected ? "hsl(var(--background))" : "transparent"}
          strokeWidth="3"
          className="transition-all duration-300"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transformOrigin: "center",
          }}
        />
        
        {/* Chapter number */}
        <text
          x="-22"
          y="-18"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          {chapter.id}
        </text>
        
        {/* Icon */}
        <text
          x="0"
          y="8"
          textAnchor="middle"
          fontSize="24"
          className="select-none"
        >
          {chapter.locked ? "🔒" : chapter.icon}
        </text>
        
        {/* Completed check */}
        {chapter.completed && (
          <circle
            cx="22"
            cy="-22"
            r="10"
            fill="hsl(142, 76%, 36%)"
            stroke="white"
            strokeWidth="2"
          />
        )}
        {chapter.completed && (
          <text x="22" y="-18" textAnchor="middle" fill="white" fontSize="12">✓</text>
        )}
      </g>
    );
  };

  const renderRing = (grade: number, radius: number) => {
    const gradeChapters = getChaptersByGrade(grade);
    
    return (
      <g key={grade}>
        {/* Ring circle */}
        <circle
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />
        
        {/* Grade label arc - positioned at bottom of ring */}
        <text
          x="0"
          y={radius + 15}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="11"
          fontWeight="500"
          className="uppercase tracking-wider"
        >
          {gradeLabels[grade as keyof typeof gradeLabels]}
        </text>
        
        {/* Chapter nodes */}
        {gradeChapters.map((chapter, index) => {
          const pos = getPositionOnRing(index, gradeChapters.length, radius);
          return renderChapterNode(chapter, pos.x, pos.y);
        })}
      </g>
    );
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Adventure</h2>
          <p className="text-xl text-muted-foreground">30 exciting STEM projects organized by grade level!</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Circular Wheel */}
          <div className="relative">
            <svg 
              width="600" 
              height="600" 
              viewBox="-300 -300 600 600"
              className="max-w-full h-auto"
            >
              {/* Background circles */}
              <circle r="280" fill="hsl(var(--muted))" opacity="0.1" />
              <circle r="210" fill="hsl(var(--muted))" opacity="0.15" />
              <circle r="140" fill="hsl(var(--muted))" opacity="0.2" />
              <circle r="70" fill="hsl(var(--muted))" opacity="0.25" />
              
              {/* Center hub */}
              <circle r="45" fill="hsl(var(--primary))" />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill="hsl(var(--primary-foreground))"
                fontSize="14"
                fontWeight="bold"
              >
                BLIX
              </text>
              
              {/* Render rings from outer to inner */}
              {renderRing(4, 250)}
              {renderRing(3, 180)}
              {renderRing(2, 110)}
              {renderRing(1, 70)}
              
              {/* Connector lines from center */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="0"
                  y1="0"
                  x2={Math.cos((angle * Math.PI) / 180) * 280}
                  y2={Math.sin((angle * Math.PI) / 180) * 280}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.2"
                />
              ))}
            </svg>
          </div>

          {/* Detail Panel */}
          <div className={`
            w-full lg:w-96 
            transition-all duration-500 ease-out
            ${selectedChapter ? "opacity-100 translate-x-0" : "opacity-0 lg:translate-x-8 pointer-events-none"}
          `}>
            {selectedChapter && (
              <div className="bg-card border rounded-xl p-6 shadow-xl relative">
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                    style={{ backgroundColor: selectedChapter.color }}
                  >
                    {selectedChapter.locked ? "🔒" : selectedChapter.icon}
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground font-medium">
                      Chapter {selectedChapter.id} • {gradeLabels[selectedChapter.grade as keyof typeof gradeLabels]}
                    </span>
                    <h3 className="text-2xl font-bold">{selectedChapter.title}</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {selectedChapter.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: selectedChapter.color }}
                  >
                    {selectedChapter.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted">
                    {selectedChapter.category}
                  </span>
                  {selectedChapter.completed && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
                
                {selectedChapter.locked ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Complete previous chapters to unlock</span>
                  </div>
                ) : (
                  <Link to={`/chapter/${selectedChapter.id}`}>
                    <Button className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Start Chapter
                    </Button>
                  </Link>
                )}
              </div>
            )}
            
            {!selectedChapter && (
              <div className="bg-muted/50 border border-dashed rounded-xl p-8 text-center">
                <p className="text-muted-foreground">
                  Click on any chapter to see details
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
