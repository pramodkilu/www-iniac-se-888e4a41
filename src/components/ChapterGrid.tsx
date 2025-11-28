import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Chapter {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  locked?: boolean;
  completed?: boolean;
}

const chapters: Chapter[] = [
  { id: 1, title: "Cart With Wheels", description: "Learn about friction and motion", difficulty: "Easy", category: "Mechanics", completed: true },
  { id: 2, title: "Aerodynamic Car", description: "Discover aerodynamics and speed", difficulty: "Easy", category: "Physics" },
  { id: 3, title: "Challenge Ladder", description: "Calculate and build structures", difficulty: "Medium", category: "Math" },
  { id: 4, title: "Trebuchet", description: "Explore gravity and levers", difficulty: "Medium", category: "Physics" },
  { id: 5, title: "Sign Boards", description: "Learn about shapes and design", difficulty: "Easy", category: "Design" },
  { id: 6, title: "Suspension Car", description: "Understand suspension systems", difficulty: "Medium", category: "Engineering" },
  { id: 7, title: "Trundle Wheel", description: "Measure distance accurately", difficulty: "Medium", category: "Math" },
  { id: 8, title: "Pasta Maker", description: "Build mechanical tools", difficulty: "Medium", category: "Mechanics" },
  { id: 9, title: "Bottle Opener", description: "Simple machines in action", difficulty: "Easy", category: "Mechanics" },
  { id: 10, title: "Launcher", description: "Force and projectile motion", difficulty: "Hard", category: "Physics", locked: true },
  { id: 11, title: "Flipping Picture", description: "Optical illusions and art", difficulty: "Easy", category: "Art" },
  { id: 12, title: "Zip Line", description: "Energy and motion", difficulty: "Medium", category: "Physics" },
  { id: 13, title: "Merry-Go-Round", description: "Rotational mechanics", difficulty: "Medium", category: "Mechanics", locked: true },
  { id: 14, title: "Screw Press", description: "Mechanical advantage", difficulty: "Hard", category: "Engineering", locked: true },
  { id: 15, title: "Crane", description: "Lifting and construction", difficulty: "Hard", category: "Engineering", locked: true },
];

const difficultyColors = {
  Easy: "bg-success text-success-foreground",
  Medium: "bg-accent text-accent-foreground",
  Hard: "bg-destructive text-destructive-foreground"
};

const ChapterGrid = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Adventure</h2>
          <p className="text-xl text-muted-foreground">30 exciting STEM projects waiting for you!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <Link 
              key={chapter.id} 
              to={chapter.locked ? "#" : `/chapter/${chapter.id}`}
              className={chapter.locked ? "pointer-events-none" : ""}
            >
              <Card className={`hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                chapter.locked ? "opacity-60" : ""
              } ${chapter.completed ? "border-success border-2" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      Chapter {chapter.id}
                    </Badge>
                    {chapter.locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                    {chapter.completed && <CheckCircle2 className="w-5 h-5 text-success" />}
                  </div>
                  <CardTitle className="text-xl">{chapter.title}</CardTitle>
                  <CardDescription>{chapter.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge className={difficultyColors[chapter.difficulty]}>
                      {chapter.difficulty}
                    </Badge>
                    <Badge variant="secondary">{chapter.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Placeholder cards for remaining chapters */}
          {Array.from({ length: 15 }, (_, i) => i + 16).map((num) => (
            <Card key={num} className="opacity-40">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">Chapter {num}</Badge>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">Coming Soon</CardTitle>
                <CardDescription>More exciting projects to discover!</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Locked</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChapterGrid;
