import { useState, useEffect } from "react";
import { X, Lock, CheckCircle2, Play, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AuthRequiredModal from "@/components/AuthRequiredModal";

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
  icon: string;
  tagline: string;
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
  { id: 1, label: "Grade 1", color: "#E5243B", icon: "🎯", tagline: "Foundations", chapters: generateChapters(1) },
  { id: 2, label: "Grade 2", color: "#DDA63A", icon: "🔧", tagline: "Building Basics", chapters: generateChapters(2) },
  { id: 3, label: "Grade 3", color: "#4C9F38", icon: "⚙️", tagline: "Simple Machines", chapters: generateChapters(3) },
  { id: 4, label: "Grade 4", color: "#C5192D", icon: "🚀", tagline: "Motion & Forces", chapters: generateChapters(4) },
  { id: 5, label: "Grade 5", color: "#FF3A21", icon: "💡", tagline: "Energy Systems", chapters: generateChapters(5) },
  { id: 6, label: "Grade 6", color: "#26BDE2", icon: "⚡", tagline: "Electricity", chapters: generateChapters(6) },
  { id: 7, label: "Grade 7", color: "#FCC30B", icon: "🏗️", tagline: "Structures", chapters: generateChapters(7) },
  { id: 8, label: "Grade 8", color: "#A21942", icon: "🤖", tagline: "Automation", chapters: generateChapters(8) },
  { id: 9, label: "Grade 9", color: "#FD6925", icon: "🌟", tagline: "Advanced Projects", chapters: generateChapters(9) },
];

const ChapterWheel = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [hoveredGrade, setHoveredGrade] = useState<Grade | null>(null);
  const [clickedGrade, setClickedGrade] = useState<{ id: number; x: number; y: number; color: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingGrade, setPendingGrade] = useState<{ grade: Grade; x: number; y: number } | null>(null);

  const handleGradeClick = (grade: Grade, x: number, y: number) => {
    // If user is not logged in, show auth modal
    if (!user && !authLoading) {
      setPendingGrade({ grade, x, y });
      setShowAuthModal(true);
      return;
    }
    
    setClickedGrade({ id: grade.id, x, y, color: grade.color });
    setTimeout(() => {
      setSelectedGrade(grade);
      setClickedGrade(null);
    }, 400);
  };

  // ABB-style SDG wheel for grades - stable version
  const renderGradeWheel = () => {
    const centerRadius = 80;
    const segmentInnerRadius = 90;
    const segmentOuterRadius = 180;
    const iconRadius = 135;
    
    const createArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
      const start1 = {
        x: Math.cos(startAngle) * outerR,
        y: Math.sin(startAngle) * outerR
      };
      const end1 = {
        x: Math.cos(endAngle) * outerR,
        y: Math.sin(endAngle) * outerR
      };
      const start2 = {
        x: Math.cos(endAngle) * innerR,
        y: Math.sin(endAngle) * innerR
      };
      const end2 = {
        x: Math.cos(startAngle) * innerR,
        y: Math.sin(startAngle) * innerR
      };
      
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      
      return `M ${start1.x} ${start1.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y} L ${start2.x} ${start2.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${end2.x} ${end2.y} Z`;
    };
    
    const segmentAngle = (2 * Math.PI) / grades.length;
    const gapAngle = 0.03;
    
    const displayedGrade = hoveredGrade || selectedGrade;
    
    return (
      <div className="flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 px-4">
          <p className="text-xs md:text-sm font-semibold tracking-widest text-primary mb-2 md:mb-3 uppercase">
            Choose Your Learning Path
          </p>
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
            Explore 9 Grade Levels
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            30 hands-on STEM projects per grade
          </p>
        </div>
        
        {/* Wheel + Info Panel side by side */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 w-full">
          {/* Wheel container - responsive size */}
          <div className="relative flex-shrink-0 w-[320px] h-[320px] md:w-[500px] md:h-[500px]">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="-250 -250 500 500"
              className="block touch-manipulation"
            >
              {/* Grade segments */}
              {grades.map((grade, index) => {
                const startAngle = index * segmentAngle - Math.PI / 2 + gapAngle / 2;
                const endAngle = (index + 1) * segmentAngle - Math.PI / 2 - gapAngle / 2;
                const midAngle = (startAngle + endAngle) / 2;
                
                const isHovered = hoveredGrade?.id === grade.id;
                const iconX = Math.cos(midAngle) * iconRadius;
                const iconY = Math.sin(midAngle) * iconRadius;
                
                return (
                  <g 
                    key={grade.id}
                    onClick={() => handleGradeClick(grade, iconX, iconY)}
                    onMouseEnter={() => setHoveredGrade(grade)}
                    onMouseLeave={() => setHoveredGrade(null)}
                    onTouchStart={() => setHoveredGrade(grade)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Segment glow on hover */}
                    <path
                      d={createArcPath(startAngle, endAngle, segmentInnerRadius, segmentOuterRadius + 8)}
                      fill={grade.color}
                      style={{
                        opacity: isHovered ? 0.4 : 0,
                        filter: 'blur(8px)',
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    
                    {/* Segment */}
                    <path
                      d={createArcPath(startAngle, endAngle, segmentInnerRadius, segmentOuterRadius)}
                      fill={grade.color}
                      stroke="white"
                      strokeWidth="2"
                      style={{
                        opacity: isHovered ? 1 : 0.85,
                        filter: isHovered ? 'brightness(1.15) saturate(1.1)' : 'brightness(1)',
                        transition: 'opacity 0.3s ease, filter 0.3s ease'
                      }}
                    />
                    
                    {/* Ripple effect on click */}
                    {clickedGrade?.id === grade.id && (
                      <>
                        <circle
                          cx={iconX}
                          cy={iconY}
                          r="10"
                          fill={grade.color}
                          style={{
                            animation: 'ripple-expand 0.4s ease-out forwards'
                          }}
                        />
                        <circle
                          cx={iconX}
                          cy={iconY}
                          r="10"
                          fill={grade.color}
                          style={{
                            animation: 'ripple-expand 0.4s ease-out 0.1s forwards'
                          }}
                        />
                      </>
                    )}
                    
                    {/* Grade number */}
                    <text
                      x={iconX}
                      y={iconY - 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {grade.id}
                    </text>
                    
                    {/* Icon */}
                    <text
                      x={iconX}
                      y={iconY + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="20"
                      style={{ pointerEvents: 'none' }}
                    >
                      {grade.icon}
                    </text>
                  </g>
                );
              })}
              
              {/* Center circle */}
              <circle
                r={centerRadius}
                fill="hsl(var(--background))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              
              {/* Center text */}
              <text
                x="0"
                y="-15"
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="24"
                fontWeight="bold"
              >
                BLIX
              </text>
              <text
                x="0"
                y="10"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="11"
              >
                30 Projects/Grade
              </text>
            </svg>
            
            {/* Labels outside wheel - hidden on mobile, visible on md+ */}
            <div className="hidden md:block">
              {grades.map((grade, index) => {
                const midAngle = (index + 0.5) * segmentAngle - Math.PI / 2;
                const labelRadius = 220;
                const labelX = 250 + Math.cos(midAngle) * labelRadius;
                const labelY = 250 + Math.sin(midAngle) * labelRadius;
                const isHovered = hoveredGrade?.id === grade.id;
                
                return (
                  <div
                    key={`label-${grade.id}`}
                    style={{
                      position: 'absolute',
                      left: `${labelX}px`,
                      top: `${labelY}px`,
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div 
                      style={{ 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        color: isHovered ? grade.color : 'hsl(var(--foreground))',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Grade {grade.id}
                    </div>
                    <div style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>
                      {grade.tagline}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Info Panel - next to wheel on desktop, below on mobile */}
          <div className="w-full max-w-sm lg:w-80 px-4 lg:px-0">
            {displayedGrade ? (
              <div className="bg-card border rounded-2xl p-5 md:p-6 shadow-lg text-center animate-fade-in">
                <div 
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl mx-auto mb-3 md:mb-4"
                  style={{ backgroundColor: displayedGrade.color }}
                >
                  {displayedGrade.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{displayedGrade.label}</h3>
                <p className="text-muted-foreground text-sm mb-2 md:mb-4">{displayedGrade.tagline}</p>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">30 hands-on STEM projects</p>
                <Button 
                  onClick={() => setSelectedGrade(displayedGrade)}
                  className="w-full"
                  size="lg"
                >
                  Explore Chapters
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="bg-muted/50 border-2 border-dashed rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[200px] md:min-h-[280px]">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <span className="text-2xl md:text-3xl">👆</span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground font-medium">
                  Tap on a grade to see details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderChapterCircles = () => {
    if (!selectedGrade) return null;
    
    const chapters = selectedGrade.chapters;
    
    // Larger spiral with better spacing
    const getSpiralPosition = (index: number, total: number) => {
      const maxRadius = 380;
      const minRadius = 80;
      const turns = 2.8;
      
      const progress = index / (total - 1);
      const angle = progress * turns * 2 * Math.PI - Math.PI / 2;
      const radius = minRadius + progress * (maxRadius - minRadius);
      
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: angle * (180 / Math.PI),
      };
    };
    
    // Generate smooth road path
    const generateRoadPath = () => {
      let path = "";
      for (let i = 0; i <= 150; i++) {
        const progress = i / 150;
        const maxRadius = 380;
        const minRadius = 80;
        const turns = 2.8;
        const angle = progress * turns * 2 * Math.PI - Math.PI / 2;
        const radius = minRadius + progress * (maxRadius - minRadius);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      }
      return path;
    };
    
    const roadPath = generateRoadPath();
    
    return (
      <div className="relative w-full flex flex-col items-center">
        {/* Back button */}
        <button
          onClick={() => {
            setSelectedGrade(null);
            setSelectedChapter(null);
          }}
          className="absolute top-0 left-0 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors z-10 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Grades</span>
        </button>
        
        {/* Grade Title */}
        <div className="mt-12 mb-4 text-center">
          <h2 className="text-3xl font-bold" style={{ color: selectedGrade.color }}>
            {selectedGrade.label} Journey
          </h2>
          <p className="text-muted-foreground">30 Chapters • From START to FINISH</p>
        </div>
        
        <svg 
          width="850" 
          height="850" 
          viewBox="-425 -425 850 850"
          className="max-w-full h-auto"
        >
          {/* Outer decorative ring */}
          <circle
            r="410"
            fill="none"
            stroke={selectedGrade.color}
            strokeWidth="2"
            opacity="0.15"
            strokeDasharray="15 10"
          />
          <circle
            r="395"
            fill="none"
            stroke={selectedGrade.color}
            strokeWidth="1"
            opacity="0.1"
            strokeDasharray="8 15"
          />
          
          {/* Static decorative particles */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const radius = 400 + Math.sin(i * 0.5) * 15;
            return (
              <circle
                key={`particle-${i}`}
                cx={Math.cos(angle) * radius}
                cy={Math.sin(angle) * radius}
                r={3 + Math.sin(i) * 1.5}
                fill={selectedGrade.color}
                opacity={0.2 + Math.sin(i * 0.3) * 0.15}
              />
            );
          })}
          
          {/* Inner decorative particles */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const radius = 100 + Math.cos(i * 0.7) * 20;
            return (
              <circle
                key={`inner-particle-${i}`}
                cx={Math.cos(angle) * radius}
                cy={Math.sin(angle) * radius}
                r={2 + Math.sin(i) * 1}
                fill={selectedGrade.color}
                opacity={0.25}
              />
            );
          })}
          
          {/* Road shadow */}
          <path
            d={roadPath}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="48"
            opacity="0.08"
            strokeLinecap="round"
            transform="translate(5, 5)"
          />
          
          {/* Road background */}
          <path
            d={roadPath}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="44"
            strokeLinecap="round"
          />
          
          {/* Road edge highlight */}
          <path
            d={roadPath}
            fill="none"
            stroke={selectedGrade.color}
            strokeWidth="48"
            strokeLinecap="round"
            opacity="0.1"
          />
          
          {/* Road center line */}
          <path
            d={roadPath}
            fill="none"
            stroke={selectedGrade.color}
            strokeWidth="4"
            strokeDasharray="16 10"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Milestone markers at 10, 20 */}
          {[10, 20].map((milestone) => {
            const pos = getSpiralPosition(milestone - 1, 30);
            return (
              <g key={`milestone-${milestone}`} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle r="38" fill={selectedGrade.color} opacity="0.15" />
              </g>
            );
          })}
          
          {/* Start marker */}
          <g transform={`translate(${getSpiralPosition(0, 30).x}, ${getSpiralPosition(0, 30).y})`}>
            <circle r="28" fill="#4CAF50" className="drop-shadow-lg" />
            <circle r="32" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0.5" className="animate-pulse" />
            <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold">START</text>
          </g>
          
          {/* End marker */}
          <g transform={`translate(${getSpiralPosition(29, 30).x}, ${getSpiralPosition(29, 30).y})`}>
            <circle r="30" fill="#FFD700" className="drop-shadow-lg" />
            <circle r="36" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" className="animate-pulse" />
            <text x="0" y="5" textAnchor="middle" fill="white" fontSize="20">🏆</text>
          </g>
          
          {/* Chapter nodes */}
          {chapters.map((chapter, index) => {
            const pos = getSpiralPosition(index, 30);
            const isSelected = selectedChapter?.id === chapter.id;
            const nodeSize = 28;
            const isMilestone = (index + 1) % 10 === 0;
            
            return (
              <g 
                key={chapter.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedChapter(chapter)}
                className="cursor-pointer transition-transform hover:scale-110"
                style={{ transformOrigin: 'center' }}
              >
                {/* Selection glow */}
                {isSelected && (
                  <>
                    <circle
                      r={nodeSize + 16}
                      fill={chapter.color}
                      opacity="0.25"
                      className="animate-pulse"
                    />
                    <circle
                      r={nodeSize + 8}
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="3"
                    />
                  </>
                )}
                
                {/* Node outer glow */}
                <circle
                  r={nodeSize + 5}
                  fill={chapter.locked ? "#666" : chapter.color}
                  opacity="0.25"
                />
                
                {/* Main node */}
                <circle
                  r={nodeSize}
                  fill={chapter.locked ? "#9E9E9E" : chapter.color}
                  className="drop-shadow-md"
                  style={{
                    filter: isSelected ? 'brightness(1.2)' : 'brightness(1)',
                  }}
                />
                
                {/* Chapter number */}
                <text
                  x="0"
                  y={-6}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
                
                {/* Icon */}
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fontSize="14"
                  className="select-none pointer-events-none"
                >
                  {chapter.locked ? "🔒" : chapter.icon}
                </text>
                
                {/* Completed indicator */}
                {chapter.completed && (
                  <g transform={`translate(${nodeSize * 0.7}, ${-nodeSize * 0.7})`}>
                    <circle r="10" fill="#4CAF50" stroke="white" strokeWidth="2" />
                    <text x="0" y="3" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">✓</text>
                  </g>
                )}
                
                {/* Milestone star */}
                {isMilestone && !chapter.locked && (
                  <g transform={`translate(${-nodeSize * 0.7}, ${-nodeSize * 0.7})`}>
                    <text x="0" y="3" textAnchor="middle" fontSize="12">⭐</text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* Center grade badge - larger */}
          <g>
            <circle r="55" fill={selectedGrade.color} opacity="0.15" />
            <circle r="48" fill={selectedGrade.color} className="drop-shadow-lg" />
            <text x="0" y="-12" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">Grade</text>
            <text x="0" y="18" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">{selectedGrade.id}</text>
          </g>
          
          {/* Progress arc */}
          {(() => {
            const completedCount = chapters.filter(c => c.completed).length;
            const progress = completedCount / 30;
            const arcRadius = 38;
            const circumference = 2 * Math.PI * arcRadius;
            return (
              <circle
                r={arcRadius}
                fill="none"
                stroke="#4CAF50"
                strokeWidth="4"
                strokeDasharray={`${progress * circumference} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90)"
                opacity="0.8"
              />
            );
          })()}
        </svg>
      </div>
    );
  };

  return (
    <section className="h-[calc(100vh-4rem)] flex flex-col justify-center py-8 md:py-12 px-6 md:px-8 bg-muted/30 overflow-y-auto">
      <div className="container mx-auto max-w-7xl">
        {selectedGrade ? (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Circular Display */}
            <div className="relative flex-shrink-0">
              {renderChapterCircles()}
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
                    <span className="text-3xl">👆</span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Click on a chapter to see details
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          renderGradeWheel()
        )}
      </div>

      {/* Auth Required Modal */}
      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        gradeLabel={pendingGrade?.grade.label}
      />
    </section>
  );
};

export default ChapterWheel;
