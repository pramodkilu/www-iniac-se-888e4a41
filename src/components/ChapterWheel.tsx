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
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [hoveredGrade, setHoveredGrade] = useState<Grade | null>(null);
  const [rotation, setRotation] = useState(0);

  // Subtle rotation animation
  useEffect(() => {
    if (selectedGrade) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [selectedGrade]);

  // ABB-style SDG wheel for grades
  const renderGradeWheel = () => {
    const centerRadius = 100;
    const segmentInnerRadius = 110;
    const segmentOuterRadius = 220;
    const iconRadius = 165;
    const labelRadius = 270;
    
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
      
      return `M ${start1.x} ${start1.y} 
              A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}
              L ${start2.x} ${start2.y}
              A ${innerR} ${innerR} 0 ${largeArc} 0 ${end2.x} ${end2.y}
              Z`;
    };
    
    const segmentAngle = (2 * Math.PI) / grades.length;
    const gapAngle = 0.02; // Small gap between segments
    
    return (
      <div className="relative flex flex-col items-center">
        {/* Header section like ABB */}
        <div className="text-center mb-8 max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-primary mb-3 uppercase">
            Choose Your Learning Path
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Explore 9 Grade Levels
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            With 30 hands-on STEM projects per grade, BLIX is helping students master engineering and robotics concepts through story-based learning.
          </p>
          <p className="text-muted-foreground mt-4">
            Click on a grade to explore its chapters.
          </p>
        </div>
        
        {/* The wheel */}
        <div className="relative">
          <svg 
            width="600" 
            height="600" 
            viewBox="-300 -300 600 600"
            className="max-w-full h-auto"
          >
            {/* Outer decorative ring */}
            <circle
              r="235"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.5"
            />
            
            {/* Decorative dots around the wheel */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i / 36) * Math.PI * 2 + (rotation * Math.PI / 180) * 0.1;
              const r = 248;
              return (
                <circle
                  key={`dot-${i}`}
                  cx={Math.cos(angle) * r}
                  cy={Math.sin(angle) * r}
                  r={3}
                  fill="hsl(var(--muted-foreground))"
                  opacity={0.3}
                />
              );
            })}
            
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
                  onClick={() => setSelectedGrade(grade)}
                  onMouseEnter={() => setHoveredGrade(grade)}
                  onMouseLeave={() => setHoveredGrade(null)}
                  className="cursor-pointer"
                  style={{ transition: 'transform 0.2s ease' }}
                >
                  {/* Segment background */}
                  <path
                    d={createArcPath(startAngle, endAngle, segmentInnerRadius, segmentOuterRadius)}
                    fill={grade.color}
                    opacity={isHovered ? 1 : 0.85}
                    className="transition-all duration-200"
                    style={{
                      filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                      transform: isHovered ? `scale(1.02)` : 'scale(1)',
                      transformOrigin: 'center',
                    }}
                  />
                  
                  {/* Hover highlight */}
                  {isHovered && (
                    <path
                      d={createArcPath(startAngle, endAngle, segmentOuterRadius, segmentOuterRadius + 8)}
                      fill={grade.color}
                      opacity="0.6"
                    />
                  )}
                  
                  {/* Grade number */}
                  <text
                    x={iconX}
                    y={iconY - 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {grade.id}
                  </text>
                  
                  {/* Icon */}
                  <text
                    x={iconX}
                    y={iconY + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    className="pointer-events-none select-none"
                  >
                    {grade.icon}
                  </text>
                </g>
              );
            })}
            
            {/* Inner circle - center hub */}
            <circle
              r={centerRadius}
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            
            {/* Center content */}
            <g>
              <text
                x="0"
                y="-25"
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="28"
                fontWeight="bold"
                className="select-none"
              >
                BLIX
              </text>
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="12"
                className="select-none"
              >
                30 Projects
              </text>
              <text
                x="0"
                y="22"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="12"
                className="select-none"
              >
                per Grade
              </text>
            </g>
          </svg>
          
          {/* Labels around the wheel */}
          <div className="absolute inset-0 pointer-events-none">
            {grades.map((grade, index) => {
              const segmentAngle = (2 * Math.PI) / grades.length;
              const midAngle = index * segmentAngle - Math.PI / 2 + segmentAngle / 2;
              const labelR = labelRadius;
              const x = 300 + Math.cos(midAngle) * labelR;
              const y = 300 + Math.sin(midAngle) * labelR;
              
              return (
                <div
                  key={`label-${grade.id}`}
                  className="absolute text-center pointer-events-auto cursor-pointer transition-transform hover:scale-105"
                  style={{
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                    minWidth: '80px',
                  }}
                  onClick={() => setSelectedGrade(grade)}
                  onMouseEnter={() => setHoveredGrade(grade)}
                  onMouseLeave={() => setHoveredGrade(null)}
                >
                  <div 
                    className="font-bold text-sm"
                    style={{ color: hoveredGrade?.id === grade.id ? grade.color : 'hsl(var(--foreground))' }}
                  >
                    Grade {grade.id}
                  </div>
                  <div className="text-xs text-muted-foreground">{grade.tagline}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Hovered grade info */}
        {hoveredGrade && (
          <div className="mt-8 bg-card border rounded-xl p-6 shadow-lg animate-fade-in max-w-md text-center">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ backgroundColor: hoveredGrade.color }}
            >
              {hoveredGrade.icon}
            </div>
            <h3 className="text-2xl font-bold mb-1">{hoveredGrade.label}</h3>
            <p className="text-muted-foreground mb-4">{hoveredGrade.tagline}</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="font-bold">{hoveredGrade.chapters.length}</span> chapters
              </span>
              <span className="flex items-center gap-1">
                <span className="font-bold">{hoveredGrade.chapters.filter(c => c.completed).length}</span> completed
              </span>
            </div>
            <Button className="mt-4" onClick={() => setSelectedGrade(hoveredGrade)}>
              Explore Chapters
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
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
          {/* Outer glow ring */}
          <circle
            r="410"
            fill="none"
            stroke={selectedGrade.color}
            strokeWidth="2"
            opacity="0.15"
            strokeDasharray="15 10"
            style={{ 
              transform: `rotate(${rotation * 0.3}deg)`,
              transformOrigin: 'center'
            }}
          />
          <circle
            r="395"
            fill="none"
            stroke={selectedGrade.color}
            strokeWidth="1"
            opacity="0.1"
            strokeDasharray="8 15"
            style={{ 
              transform: `rotate(${-rotation * 0.2}deg)`,
              transformOrigin: 'center'
            }}
          />
          
          {/* Animated background particles */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2 + rotation * 0.015;
            const radius = 400 + Math.sin(i * 0.5 + rotation * 0.02) * 15;
            return (
              <circle
                key={`particle-${i}`}
                cx={Math.cos(angle) * radius}
                cy={Math.sin(angle) * radius}
                r={3 + Math.sin(i + rotation * 0.05) * 1.5}
                fill={selectedGrade.color}
                opacity={0.2 + Math.sin(i * 0.3) * 0.15}
              />
            );
          })}
          
          {/* Inner glow particles */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2 - rotation * 0.01;
            const radius = 100 + Math.cos(i * 0.7 + rotation * 0.03) * 20;
            return (
              <circle
                key={`inner-particle-${i}`}
                cx={Math.cos(angle) * radius}
                cy={Math.sin(angle) * radius}
                r={2 + Math.sin(i + rotation * 0.04) * 1}
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
          
          {/* Road center line (animated dashed) */}
          <path
            d={roadPath}
            fill="none"
            stroke={selectedGrade.color}
            strokeWidth="4"
            strokeDasharray="16 10"
            strokeLinecap="round"
            opacity="0.7"
            style={{ 
              strokeDashoffset: -rotation * 3,
            }}
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
    <section className="py-20 px-4 bg-muted/30">
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
    </section>
  );
};

export default ChapterWheel;
