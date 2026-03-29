import { useState } from "react";
import Header from "@/components/Header";
import { curriculumData } from "@/data/curriculumSessions";
import { Bot, Brain, BookOpen, Layers, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const gradeColors: Record<number, string> = {
  1: "from-blue-500 to-cyan-500",
  2: "from-cyan-500 to-teal-500",
  3: "from-teal-500 to-green-500",
  4: "from-green-500 to-emerald-500",
  5: "from-emerald-500 to-lime-500",
  6: "from-yellow-500 to-orange-500",
  7: "from-orange-500 to-red-500",
  8: "from-red-500 to-pink-500",
};

const Curriculum = () => {
  const grades = Object.keys(curriculumData).map(Number).sort((a, b) => a - b);
  const [activeGrade, setActiveGrade] = useState(String(grades[0]));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Hero */}
        <section
          className="relative overflow-hidden py-16 md:py-24 px-6"
          style={{ background: "linear-gradient(135deg, hsl(210 60% 12%) 0%, hsl(220 50% 18%) 50%, hsl(210 40% 15%) 100%)" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Layers className="w-4 h-4 text-orange-400" />
              <span className="text-white/90 text-sm font-medium">Skolverket Lgr22 Aligned</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              AI + AR/VR Robotics{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                Curriculum
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Educator sessions mapped by grade — from simple machines in Grade 1 to advanced
              programming & AI in Grade 8. Every session is aligned with Sweden's Lgr22 curriculum.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { icon: BookOpen, val: "257+", label: "Sessions" },
                { icon: GraduationCap, val: "8", label: "Grades" },
                { icon: Brain, val: "3", label: "Stadiums" },
                { icon: Bot, val: "100%", label: "Lgr22 Aligned" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
                  <s.icon className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-bold text-lg">{s.val}</span>
                  <span className="text-slate-400 text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grade Tabs + Table */}
        <section className="py-12 md:py-20 px-6 bg-background">
          <div className="container mx-auto max-w-7xl">
            <Tabs value={activeGrade} onValueChange={setActiveGrade}>
              {/* Grade Circle Selector */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {grades.map((g) => {
                  const isActive = activeGrade === String(g);
                  return (
                    <TabsTrigger
                      key={g}
                      value={String(g)}
                      className="flex flex-col items-center gap-1.5 bg-transparent p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none shadow-none"
                    >
                      <div
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-xl md:text-2xl transition-all duration-300 border-2 ${
                          isActive
                            ? `bg-gradient-to-br ${gradeColors[g]} text-white border-transparent shadow-lg scale-110`
                            : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:scale-105"
                        }`}
                      >
                        {g}
                      </div>
                      <span className={`text-xs font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        Grade {g}
                      </span>
                      <span className={`text-[10px] ${isActive ? "text-primary" : "text-muted-foreground/60"}`}>
                        ({curriculumData[g].stadium})
                      </span>
                    </TabsTrigger>
                  );
                })}
              </div>

              {grades.map((g) => {
                const data = curriculumData[g];
                return (
                  <TabsContent key={g} value={String(g)}>
                    {/* Grade Header */}
                    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradeColors[g]} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-black text-xl">{g}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Grade {g}</h3>
                        <p className="text-muted-foreground text-sm">
                          Stadium {data.stadium} · {data.sessions.length} sessions · Lgr22 aligned
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-16 font-semibold">#</TableHead>
                            <TableHead className="font-semibold">Course Project</TableHead>
                            <TableHead className="font-semibold">Concepts</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">Skills Developed</TableHead>
                            <TableHead className="font-semibold hidden lg:table-cell">Skolverket Alignment</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.sessions.map((s, i) => {
                            const isCheckpoint = s.project.toLowerCase().includes("checkpoint") || s.project.toLowerCase().includes("challenge");
                            return (
                              <TableRow
                                key={i}
                                className={isCheckpoint ? "bg-orange-500/5 border-l-2 border-l-orange-500" : ""}
                              >
                                <TableCell className="font-mono font-bold text-muted-foreground">
                                  {s.session}
                                </TableCell>
                                <TableCell>
                                  <span className={`font-medium ${isCheckpoint ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}>
                                    {s.project}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                                    {s.concepts}
                                  </span>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                  {s.skills}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-muted-foreground text-xs max-w-xs">
                                  {s.alignment}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Curriculum;
