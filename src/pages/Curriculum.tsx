import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Brain,
  Bot,
  Cpu,
  Code2,
  Boxes,
  Layers,
  Zap,
  Wrench,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Monitor,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { grades } from "@/data/blixSessions";


// ─── Module data (from Blix Educator Set leaflet) ────────────────────────────
interface Module {
  topic: string;
  description: string;
  grade: string;
  qty: string;
  icon: React.ReactNode;
  color: string;
}

const modules: Module[] = [
  {
    topic: "Simple Construction",
    description: "Stories that instil maximum engagement — children build through guided narratives.",
    grade: "1–2",
    qty: "Included",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  },
  {
    topic: "Junior Electronics",
    description: "Open & closed loops, earthing, resistance and fun games with the Queaky module.",
    grade: "1–2",
    qty: "2 per kit",
    icon: <Zap className="w-5 h-5" />,
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  },
  {
    topic: "Screenless Coding (Logic Blocks)",
    description: "Build robots and code algorithms with physical interconnecting blocks — no screen required.",
    grade: "3–5",
    qty: "2 per kit",
    icon: <Boxes className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    topic: "Motions & Mechanisms",
    description: "Mechanical advantage, energy, force, power and work — explored hands-on.",
    grade: "3–5",
    qty: "2 per kit",
    icon: <Wrench className="w-5 h-5" />,
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  },
  {
    topic: "Physics & Mechanics (Marble Stem)",
    description: "Structural integrity, trial-and-error engineering — build, test, iterate.",
    grade: "3–5",
    qty: "Included",
    icon: <Layers className="w-5 h-5" />,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  },
  {
    topic: "Discovering Electricity",
    description: "Voltage, current, AC/DC, resistance, capacitance and electrical power — for real understanding.",
    grade: "3–5",
    qty: "2 per kit",
    icon: <Zap className="w-5 h-5" />,
    color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
  },
  {
    topic: "Discovering Electronics",
    description: "Breadboard-free electronics to learn gates, multiplexers and digital logic.",
    grade: "6–8",
    qty: "2 per kit",
    icon: <Cpu className="w-5 h-5" />,
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  },
  {
    topic: "Block Coding (Boffin Set)",
    description: "Construction followed by block-based coding — bridge the physical and the digital.",
    grade: "6–8",
    qty: "Included",
    icon: <Code2 className="w-5 h-5" />,
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  },
  {
    topic: "C++ Coding (Boffin Set)",
    description: "Construction followed by text-based coding through the Arduino paradigm.",
    grade: "6–8",
    qty: "Included",
    icon: <Code2 className="w-5 h-5" />,
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  },
  {
    topic: "MicroPython (Boffin Set)",
    description: "IoT projects through a Python coding paradigm — sensors, networks, real devices.",
    grade: "6–8",
    qty: "Included",
    icon: <Code2 className="w-5 h-5" />,
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  },
  {
    topic: "AI & Machine Learning",
    description: "Train models and build AI projects with the Boffin set — from concept to deployment.",
    grade: "6–8",
    qty: "Included",
    icon: <Brain className="w-5 h-5" />,
    color: "from-pink-500/20 to-purple-500/20 border-pink-500/30",
  },
  {
    topic: "AR/VR through CoSpaces",
    description: "Design 3D objects, 3D environments and mixed reality experiences.",
    grade: "6–8",
    qty: "Software",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
];

// ─── Software tools (from Blix leaflet) ──────────────────────────────────────
interface Tool {
  name: string;
  purpose: string;
  grade: string;
  level: "Intermediate" | "Advanced" | "Intermediate & Advanced";
}

const tools: Tool[] = [
  { name: "Ardublock", purpose: "Block & text coding for Arduino-style hardware", grade: "6–8", level: "Intermediate & Advanced" },
  { name: "Machine Learning", purpose: "Train ML models for student AI projects", grade: "6–8", level: "Intermediate" },
  { name: "Codeskool", purpose: "Train and operate hardware-based AI models", grade: "7–8", level: "Advanced" },
  { name: "Tinkercad", purpose: "Design 3D objects ready for printing", grade: "4–5", level: "Intermediate" },
  { name: "CoSpaces EDU", purpose: "Build VR projects and immersive worlds", grade: "4–5", level: "Intermediate" },
  { name: "Edublocks", purpose: "Learn Python through a block-based drag-and-drop interface", grade: "7–8", level: "Advanced" },
  { name: "Thonny", purpose: "Create Python-operated IoT projects", grade: "7–8", level: "Advanced" },
  { name: "Scratch + CoSpaces", purpose: "Create AR projects and animated stories", grade: "4–5", level: "Intermediate" },
  { name: "INIAC LMS", purpose: "Assignments, assessments and submissions", grade: "1–8", level: "Intermediate" },
];

// ─── Component pieces (from Blix leaflet) ────────────────────────────────────
const componentBoxes = [
  {
    box: "Box 1",
    title: "Logic Blocks, Discovering Electricity, Junior Electronics",
    color: "bg-yellow-500",
    items: "Power Block, Not Block, LED Block, Buzzer Block, Motor Block, Distance Block, IR Block, Switch Block, Push Button, LEDs, Resistors, Capacitor, Potentiometer, Battery Box, Rainbow Disk, Queaky and more.",
  },
  {
    box: "Box 2",
    title: "Marble Stem",
    color: "bg-blue-500",
    items: "P3, P3C2, CT1X2, TW-2, marbles, rubber bands, MRS14, MRB7, stencil sheet, MRH5, bucket, paper strips and a tyre-less wheel — everything for the Marble Run.",
  },
  {
    box: "Box 3",
    title: "Discovering Electronics, Boffin Basic Electronics",
    color: "bg-purple-500",
    items: "ICs (555, 7408, 7432, 7404, 7400, 7402, 7486, 7426, 74151, 74138), PCB stencils, IR sensors, ESP32 board, limit switch, LEDs, DC Motor Board, Servo Motor and programming cable.",
  },
  {
    box: "Box 4",
    title: "Plastic Construction Parts",
    color: "bg-green-500",
    items: "Pillars (P3, P5, P7, P11), connectors (CT1X2, CT2, CT3, CL2, CH2), shafts (SH60, SH100, SH170), gears (G20, G20+, G60), rack, suspension, mud guards, spoiler, steering, pulley, wheels and tyres.",
  },
  {
    box: "Box 5",
    title: "Accessories",
    color: "bg-orange-500",
    items: "Pencil, eraser, marker, rubber bands, chart paper, straws, balloons, copper wire, sand paper, iron nails, foam, fan, scissors, donut magnet, screwdriver, bar magnet, battery boxes and motors.",
  },
  {
    box: "Box 6",
    title: "Big Construction Parts",
    color: "bg-emerald-500",
    items: "P21X21 plates (×5), P7X11 plates (×8), and 10 wheels — the foundation for larger constructions.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
const Curriculum = () => {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [activeTab, setActiveTab] = useState<"sessions" | "modules" | "tools" | "kit">("sessions");
  const [openBox, setOpenBox] = useState<string | null>(null);

  const totalSessions = grades.reduce((sum, g) => sum + g.sessionCount, 0);
  const current = grades.find((g) => g.grade === selectedGrade)!;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 hover:bg-white/15 text-white border-white/20 px-4 py-1.5">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Skolverket Lgr22 Aligned · Blix Educator Set
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              AI + AR/VR Robotics{" "}
              <span className="bg-gradient-to-r from-blue-400 via-slate-300 to-orange-400 bg-clip-text text-transparent">
                Curriculum
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Educator sessions mapped by grade — from simple machines in Grade 1 to
              advanced programming &amp; AI in Grade 8. Every session aligned with Sweden's
              Lgr22 curriculum and powered by the Blix Educator Set.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { icon: <BookOpen className="w-4 h-4" />, value: `${totalSessions}+`, label: "Sessions" },
                { icon: <GraduationCap className="w-4 h-4" />, value: "8", label: "Grades" },
                { icon: <Brain className="w-4 h-4" />, value: "3", label: "Stadiums" },
                { icon: <Bot className="w-4 h-4" />, value: "100%", label: "Lgr22 Aligned" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-orange-400">{s.icon}</span>
                    <span className="text-2xl font-bold">{s.value}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <section className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3 -mx-4 px-4">
            {[
              { id: "sessions", label: "Sessions by Grade", icon: <GraduationCap className="w-4 h-4" /> },
              { id: "modules", label: "Modules Covered", icon: <Layers className="w-4 h-4" /> },
              { id: "tools", label: "Software & Tools", icon: <Monitor className="w-4 h-4" /> },
              { id: "kit", label: "Kit Components", icon: <Package className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* ─── SESSIONS TAB ─────────────────────────────────────────────── */}
        {activeTab === "sessions" && (
          <>
            {/* Grade selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {grades.map((g) => (
                <button
                  key={g.grade}
                  onClick={() => setSelectedGrade(g.grade)}
                  className="flex flex-col items-center group"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                      selectedGrade === g.grade
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg scale-110"
                        : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
                    }`}
                  >
                    {g.grade}
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 ${
                      selectedGrade === g.grade ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    Grade {g.grade}
                  </span>
                  <span
                    className={`text-[10px] ${
                      selectedGrade === g.grade ? "text-orange-500 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    ({g.stadium})
                  </span>
                </button>
              ))}
            </div>

            {/* Grade header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {current.grade}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Grade {current.grade}</h2>
                <p className="text-sm text-muted-foreground">
                  Stadium {current.stadium} · {current.sessionCount} sessions · Lgr22 aligned
                </p>
              </div>
            </div>

            {/* Session table */}
            {current.sessions.length > 0 ? (
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-xs font-semibold text-muted-foreground">
                        <th className="px-4 py-3 w-12">#</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Concept</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {current.sessions.map((s) => (
                        <tr
                          key={s.n}
                          className={`hover:bg-muted/30 transition-colors ${
                            s.highlight ? "bg-orange-50 dark:bg-orange-950/20 border-l-4 border-l-orange-500" : ""
                          }`}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-muted-foreground">{s.n}</td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                              {s.course}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p
                              className={`font-medium text-sm ${
                                s.highlight ? "text-orange-600 dark:text-orange-400" : "text-foreground"
                              }`}
                            >
                              {s.project}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${s.conceptColor}`}>
                              {s.concept}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Detailed session list for Grade {current.grade} is being finalised — {current.sessionCount} sessions planned.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* ─── MODULES TAB ──────────────────────────────────────────────── */}
        {activeTab === "modules" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Modules Covered</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Twelve hands-on modules built on the Blix Educator Set — from screenless coding in Grade 1 to AI training in Grade 8.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((m) => (
                <Card
                  key={m.topic}
                  className={`bg-gradient-to-br ${m.color} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center text-foreground">
                        {m.icon}
                      </div>
                      <Badge variant="outline" className="bg-background/60 text-xs">
                        Grade {m.grade}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2 text-foreground">{m.topic}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Quantity per kit: </span>
                      {m.qty}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ─── TOOLS TAB ────────────────────────────────────────────────── */}
        {activeTab === "tools" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Software &amp; Tools</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                As technology becomes more prevalent, students develop 21st-century skills like coding, design thinking, machine
                learning and AI through the following platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((t) => (
                <Card key={t.name} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Grade {t.grade}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          t.level === "Advanced"
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : t.level === "Intermediate"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                        }`}
                      >
                        {t.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.purpose}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Prerequisites */}
            <Card className="mt-8 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-orange-500" />
                  System Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>• Stable internet connection — minimum 50 Mbps</li>
                  <li>• Processor: Intel i5 5th generation or better</li>
                  <li>• Memory: 8 GB RAM (64-bit)</li>
                  <li>• Operating System: Windows 10 or above</li>
                  <li>• Note: Some applications do not run on Chromebook or macOS</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ─── KIT TAB ──────────────────────────────────────────────────── */}
        {activeTab === "kit" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Kit Components</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                The Blix Educator Set ships in six labelled boxes covering electronics, construction, accessories and more.
              </p>
            </div>

            <div className="space-y-3">
              {componentBoxes.map((box) => {
                const isOpen = openBox === box.box;
                return (
                  <div key={box.box} className="border border-border rounded-xl overflow-hidden bg-card">
                    <button
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors text-left"
                      onClick={() => setOpenBox(isOpen ? null : box.box)}
                    >
                      <div className={`w-3 h-12 rounded ${box.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-semibold">{box.box}</p>
                        <p className="font-semibold text-foreground">{box.title}</p>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 bg-background border-t border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed">{box.items}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Lab setup CTA */}
            <Card className="mt-8 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Lab Setup Included</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every Educator Set comes with a recommended lab layout — race track, aviation zone, programming station,
                      multi-board table and three student tables — to maximise hands-on learning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 text-center border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-3">
            Want a deeper look at the mechanisms students build during competitions?
          </p>
          <Link to="/creators-guide">
            <Button variant="outline" size="sm">
              View Creator&apos;s Guide →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Curriculum;
