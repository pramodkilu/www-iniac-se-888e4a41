import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { chapters, tr } from "@/data/chapters";

const difficultyForChapter = (id: number): "Easy" | "Medium" | "Hard" => {
  if (id <= 6) return "Easy";
  if (id <= 18) return "Medium";
  return "Hard";
};

const difficultyColors = {
  Easy: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  Medium: "bg-amber-500/20 text-amber-700 border-amber-500/30",
  Hard: "bg-rose-500/20 text-rose-700 border-rose-500/30",
};

const ChapterGrid = ({ completedIds = [] }: { completedIds?: number[] }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Adventure</h2>
          <p className="text-xl text-muted-foreground">30 exciting STEM projects waiting for you!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => {
            const difficulty = difficultyForChapter(chapter.id);
            const completed = completedIds.includes(chapter.id);
            const title = tr(chapter.title, "en");
            const subtitle = tr(chapter.subtitle, "en");
            const concept = tr(chapter.theory.concept, "en");

            return (
              <Link key={chapter.id} to={`/chapter/${chapter.id}`}>
                <Card className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full ${
                  completed ? "border-emerald-400 border-2 bg-emerald-50/30" : ""
                } ${chapter.isCheckpoint ? "ring-2 ring-amber-400/50" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-xs font-mono">Ch {chapter.id}</Badge>
                        {chapter.isCheckpoint && (
                          <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-300">Checkpoint</Badge>
                        )}
                      </div>
                      {completed
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        : <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </div>
                    <CardTitle className="text-lg leading-snug">{title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className={`text-xs ${difficultyColors[difficulty]}`}>
                        {difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs truncate max-w-[180px]">
                        {concept}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChapterGrid;
