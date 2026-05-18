import { useParams, Link } from "react-router-dom";
import { useSafeBack } from "@/lib/safeBack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play, Hammer, Trophy, Lightbulb, Sparkles, Box, BookmarkCheck, X, ChevronLeft, ChevronRight, CheckCircle2, Package, Layers, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BlixCartViewer from "@/components/3d/BlixCartViewer";
import StoryViewer from "@/components/StoryViewer";
import ChapterExperiment from "@/components/ChapterExperiment";
import StepCamera from "@/components/StepCamera";
import AIAssistant from "@/components/AIAssistant";
import ARViewer from "@/components/ARViewer";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { getChapter, tr, LGR22_STRANDS, SDG_INFO } from "@/data/chapters";
import { getStepAsset } from "@/data/stepAssets";
import { useLanguage, useUIStrings } from "@/i18n/LanguageContext";
// Procedural 3D reference for AI verification — same source-of-truth as BuildGuide
import { renderStepReferenceImage } from "@/components/ThreeDGallery";

const Chapter = () => {
  const { id } = useParams();
  const chapterIdNum = Number(id) || 1;
  const [aiOpen, setAiOpen] = useState(false);
  const [arOpen, setArOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("build");
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const { progress, saveStepVerdict, saveArPose, clearArPose } = useChapterProgress(chapterIdNum);
  const [activeBuildStep, setActiveBuildStep] = useState(1);
  const [challengeDone, setChallengeDone] = useState(false);
  const goBack = useSafeBack("/");
  const [challengeSaving, setChallengeSaving] = useState(false);
  const { lang } = useLanguage();
  const ui = useUIStrings();
  const { user } = useAuth();

  // Pull chapter from the bilingual data file
  const chapter = getChapter(chapterIdNum);

  const handleCompleteChallenge = async () => {
    if (challengeDone || challengeSaving || !user) return;
    setChallengeSaving(true);
    const gradeId = chapterIdNum <= 6 ? 1 : chapterIdNum <= 12 ? 2 : chapterIdNum <= 18 ? 3 : chapterIdNum <= 24 ? 4 : 5;
    await supabase.from("completed_chapters").upsert(
      [{ user_id: user.id, chapter_id: chapterIdNum, grade_id: gradeId, completed_at: new Date().toISOString() }],
      { onConflict: "user_id,chapter_id" }
    );
    setChallengeDone(true);
    setChallengeSaving(false);
  };

  // Sync slider to saved progress when it loads
  useEffect(() => {
    if (progress.current_step) {
      setActiveBuildStep(Math.max(1, progress.current_step));
    }
  }, [progress.current_step]);

  // Any step verified correctly — used to gate AR in the Challenge tab
  const anyStepVerified = Object.values(progress.step_verdicts).some(v => v.status === "correct");

  // Resolve translated content once (chapter may be null — guarded below after all hooks)
  const chapterTitle    = chapter ? tr(chapter.title, lang) : "";
  const chapterDescription = chapter ? tr(chapter.subtitle, lang) : "";
  const conceptText     = chapter ? tr(chapter.theory.concept, lang) : "";
  const explanationText = chapter ? tr(chapter.theory.explanation, lang) : "";
  const challengeTitle  = chapter ? tr(chapter.challenge.title, lang) : "";
  const challengeDescription = chapter ? tr(chapter.challenge.description, lang) : "";

  const experimentText = chapter
    ? chapter.theory.realWorldExamples.length > 0
      ? tr(chapter.theory.realWorldExamples[0], lang)
      : chapter.challenge.hint ? tr(chapter.challenge.hint, lang) : ""
    : "";

  // Adapt build steps from chapters.ts shape -> shape Chapter.tsx already uses.
  const adaptedSteps = chapter
    ? chapter.build.steps.map((s) => ({
        number: s.stepNumber,
        instruction: tr(s.title, lang),
        detail: tr(s.description, lang),
        pieces: s.components,
      }))
    : [];

  const steps: { number: number; instruction: string; detail: string; pieces: string[] }[] =
    adaptedSteps.length > 0
      ? adaptedSteps
      : Array.from({ length: chapter?.build.totalSteps || 1 }, (_, i) => ({
          number: i + 1,
          instruction: lang === "sv" ? `Steg ${i + 1} — detaljer kommer snart.` : `Step ${i + 1} — details coming soon.`,
          detail: lang === "sv" ? "Den fullständiga byggsekvensen läggs till här när den är klar." : "The full build sequence will be added here when ready.",
          pieces: [] as string[],
        }));

  // ── Procedural AI reference — computed once per step, not on every render ──
  // Must be called before any early returns (Rules of Hooks).
  const proceduralReference = useMemo(() => {
    if (!chapter) return null;
    const all = steps.slice(0, activeBuildStep).flatMap(s =>
      s.pieces.flatMap(p => {
        const m = p.match(/^(.+?)\s*[xX×](\d+)$/);
        return m ? [{ code: m[1].trim(), qty: parseInt(m[2]) }] : [{ code: p.trim(), qty: 1 }];
      })
    );
    const totals = new Map<string, number>();
    for (const { code, qty } of all) totals.set(code, (totals.get(code) ?? 0) + qty);
    const cumComps = Array.from(totals.entries()).map(([code, qty]) => ({ code, qty }));
    return renderStepReferenceImage(cumComps, `Step ${activeBuildStep} of ${steps.length}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBuildStep, steps.length, chapterIdNum]);

  // Guard: chapter not found — after all hooks
  if (!chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Chapter not found</h1>
          <p className="text-muted-foreground mb-4">No content exists for chapter {id}.</p>
          <Link to="/"><Button>Back to home</Button></Link>
        </div>
      </div>
    );
  }

  // Difficulty / category keep static defaults for now (could be moved into
  // chapters.ts later — leaving as-is to preserve existing visual badges).
  const difficulty = "Easy";
  const category = tr(chapter.theory.concept, lang);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={goBack} aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline">{ui.chapter} {id}</Badge>
                <Badge className="bg-success text-success-foreground">{difficulty}</Badge>
                <Badge variant="secondary">{category}</Badge>
                {chapter.isCheckpoint && (
                  <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30">
                    {ui.checkpoint}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{chapterTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">{chapterDescription}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 ${activeTab === "build" ? "max-w-[1600px]" : "max-w-6xl"}`}>
        {(() => {
          const totalSteps = steps.length;
          const verdictCount = Object.keys(progress.step_verdicts).length;
          const resumeStep = Math.min(progress.current_step, totalSteps);
          const hasProgress = (verdictCount > 0 || progress.current_step > 1) && resumeStep <= totalSteps;
          const isComplete = progress.current_step > totalSteps;
          if (!hasProgress || resumeDismissed) return null;
          const handleResume = () => {
            setActiveTab("build");
            setActiveBuildStep(resumeStep);
            setTimeout(() => {
              const el = document.getElementById(`step-${resumeStep}`);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.classList.add("ring-2", "ring-primary", "rounded-lg");
                setTimeout(() => el.classList.remove("ring-2", "ring-primary", "rounded-lg"), 2000);
              }
            }, 150);
          };
          return (
            <div className="mb-6 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/5 to-background p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                  <BookmarkCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {isComplete
                      ? lang === "sv" ? "Du har klarat alla steg!" : "You finished all the steps!"
                      : lang === "sv" ? `Välkommen tillbaka — fortsätt vid steg ${resumeStep}` : `Welcome back — pick up at Step ${resumeStep}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "sv"
                      ? `${verdictCount} av ${totalSteps} steg verifierade av AI.`
                      : `${verdictCount} of ${totalSteps} steps verified by AI.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleResume} disabled={isComplete}>
                  {lang === "sv" ? `Fortsätt steg ${resumeStep}` : `Continue Step ${resumeStep}`}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setResumeDismissed(true)} aria-label="Dismiss">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })()}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="story" className="gap-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.story}</span>
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.theory}</span>
            </TabsTrigger>
            <TabsTrigger value="check" className="gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">{lang === "sv" ? "Kontroll" : "Check"}</span>
            </TabsTrigger>
            <TabsTrigger value="build" className="gap-2">
              <Hammer className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.build}</span>
            </TabsTrigger>
            <TabsTrigger value="challenge" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.challenge}</span>
            </TabsTrigger>
          </TabsList>

          {/* Story Tab */}
          <TabsContent value="story" className="space-y-6">
            <StoryViewer />
            {/* Bilingual story intro / dialogue from chapters.ts */}
            {chapter.story.intro && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm italic text-muted-foreground mb-4">{tr(chapter.story.intro, lang)}</p>
                  {chapter.story.dialogue.length > 0 && (
                    <div className="space-y-2">
                      {chapter.story.dialogue.map((d, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-muted text-xs flex items-center justify-center flex-shrink-0 font-medium">
                            {d.speaker[0]}
                          </div>
                          <div className="bg-muted/50 px-3 py-2 rounded-lg text-sm flex-1">
                            <span className="text-xs font-semibold text-muted-foreground mr-2">{d.speaker}:</span>
                            {tr(d.text, lang)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {chapter.story.conclusion && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm italic text-muted-foreground">
                      {tr(chapter.story.conclusion, lang)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory" className="space-y-6">
            <Card className="border-secondary/20">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-success/10">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-secondary" />
                  {lang === "sv" ? `Förstå ${conceptText}` : `Understanding ${conceptText}`}
                </CardTitle>
                <CardDescription>
                  {lang === "sv" ? "Lär dig vetenskapen bakom projektet" : "Learn the science behind this project"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {lang === "sv" ? `Vad är ${conceptText}?` : `What is ${conceptText}?`}
                  </h3>
                  <p className="text-muted-foreground">{explanationText}</p>
                </div>
                {experimentText && (
                  <div className="p-4 bg-accent/10 border-l-4 border-accent rounded">
                    <h4 className="font-semibold mb-2">
                      {lang === "sv" ? "Prova det här:" : "Try This Experiment:"}
                    </h4>
                    <p className="text-sm">{experimentText}</p>
                  </div>
                )}

                {/* Real-world examples (if present) */}
                {chapter.theory.realWorldExamples.length > 1 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                      {ui.realWorldExamples}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {chapter.theory.realWorldExamples.slice(1).map((ex, i) => (
                        <li key={i}>{tr(ex, lang)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* New vocabulary words */}
                {chapter.theory.newWords.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                      {ui.newWords}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {chapter.theory.newWords.map((w, i) => (
                        <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          {tr(w, lang)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Curriculum alignment panel — Lgr22 + SDG */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{ui.lgr22Alignment} & {ui.sdgGoals}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {ui.lgr22Alignment}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {chapter.lgr22.strands.map((k) => (
                      <Badge
                        key={k}
                        variant="outline"
                        className="bg-blue-500/5 text-blue-700 dark:text-blue-300 border-blue-500/30"
                      >
                        {LGR22_STRANDS[k][lang]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {ui.sdgGoals}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {chapter.sdgs.map((n) => {
                      const sdg = SDG_INFO[n];
                      return (
                        <span
                          key={n}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                          style={{
                            background: `${sdg.color}1A`,
                            color: sdg.color,
                            borderColor: `${sdg.color}66`,
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white font-bold"
                            style={{ background: sdg.color }}
                          >
                            {n}
                          </span>
                          {sdg[lang]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <ChapterExperiment chapterId={chapterIdNum} lang={lang} />
          </TabsContent>

          {/* ── Pre-Build Check Tab — 3-Level Learning Validation Framework ── */}
          <TabsContent value="check" className="space-y-6 max-w-3xl mx-auto">

            {/* Framework header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                <Layers className="h-3.5 w-3.5" />
                {lang === "sv" ? "Ramverk för inlärningsvalidering" : "Learning Validation Framework"}
              </div>
              <h2 className="text-2xl font-bold">
                {lang === "sv" ? "3-nivås förbyggnadskontroll" : "3-Level Pre-Build Check"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                {lang === "sv"
                  ? "Slutför varje valideringsnivå i ordning innan du börjar bygga."
                  : "Complete each validation level in order before starting your build."}
              </p>
            </div>

            {/* Progress flow strip */}
            <div className="flex items-center justify-center gap-1 flex-wrap text-[11px] font-semibold">
              {[
                { label: lang === "sv" ? "Teori" : "Theory",      tab: "theory",    done: true },
                { label: lang === "sv" ? "Komponentkontroll" : "Component Check", tab: "check", done: false, active: true },
                { label: lang === "sv" ? "Bygge" : "Build",        tab: "build",     done: false },
                { label: lang === "sv" ? "Monteringskontroll" : "Assembly Check", tab: null, done: false },
                { label: lang === "sv" ? "AR-förhandsvisning" : "AR Preview",    tab: null, done: anyStepVerified },
              ].map((s, i, arr) => (
                <div key={i} className="flex items-center gap-1">
                  <button
                    onClick={() => s.tab ? setActiveTab(s.tab) : undefined}
                    className={`px-2.5 py-1 rounded-full border transition-all ${
                      s.active
                        ? "bg-primary text-primary-foreground border-primary font-bold"
                        : s.done
                          ? "bg-success/15 text-success border-success/30"
                          : "bg-muted text-muted-foreground border-border"
                    } ${s.tab ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}>
                    {s.label}
                  </button>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* 3 Level cards */}
            <div className="grid gap-4 md:grid-cols-3">

              {/* Level 1 — Component Check */}
              <Card className="border-orange-200 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-background relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-orange-400" />
                <CardHeader className="pb-2 pt-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center">
                      <Package className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                      {lang === "sv" ? "Nivå 1" : "Level 1"}
                    </span>
                  </div>
                  <CardTitle className="text-base text-orange-800 dark:text-orange-300">
                    {lang === "sv" ? "Komponentkontroll" : "Component Check"}
                  </CardTitle>
                  <CardDescription className="text-[12px]">
                    {lang === "sv"
                      ? "Har eleven de nödvändiga delarna?"
                      : "Does the student have the required parts?"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-5">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "sv"
                      ? "Kontrollera att alla komponenter i bygglistan finns tillgängliga och är oskadade innan montering börjar."
                      : "Verify that all components in the build list are present and undamaged before assembly begins."}
                  </p>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-orange-400" />
                      {lang === "sv" ? "Visuell inspektion av delar" : "Visual parts inspection"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-orange-400" />
                      {lang === "sv" ? "Antal- och typkontroll" : "Count and type verification"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-orange-400" />
                      {lang === "sv" ? "3D-referensgenerering" : "3D reference generation"}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2 h-9 text-sm"
                    onClick={() => setActiveTab("build")}
                  >
                    <Package className="h-4 w-4" />
                    {lang === "sv" ? "Starta komponentkontroll" : "Start Component Check"}
                  </Button>
                </CardContent>
              </Card>

              {/* Level 2 — Assembly Check */}
              <Card className="border-blue-200 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                <CardHeader className="pb-2 pt-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                      {lang === "sv" ? "Nivå 2" : "Level 2"}
                    </span>
                  </div>
                  <CardTitle className="text-base text-blue-800 dark:text-blue-300">
                    {lang === "sv" ? "Monteringskontroll" : "Assembly Check"}
                  </CardTitle>
                  <CardDescription className="text-[12px]">
                    {lang === "sv"
                      ? "Är delarna arrangerade enligt byggsteget?"
                      : "Are the parts arranged according to the build step?"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-5">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "sv"
                      ? "AI-kameran (Gemini 1.5 Flash) jämför elevens foto med den procedurella 3D-referensbilden för varje steg."
                      : "The AI camera (Gemini 1.5 Flash) compares the student's photo against the procedural 3D reference image for each step."}
                  </p>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                      {lang === "sv" ? "Kamerafångst av bygget" : "Camera capture of build"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                      {lang === "sv" ? "Gemini multimodal analys" : "Gemini multimodal analysis"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                      {lang === "sv" ? "Strukturerad återkoppling" : "Structured feedback"}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 h-9 text-sm"
                    onClick={() => setActiveTab("build")}
                  >
                    <Sparkles className="h-4 w-4" />
                    {lang === "sv" ? "Kör monteringskontroll" : "Run Assembly Check"}
                  </Button>
                </CardContent>
              </Card>

              {/* Level 3 — AR Preview */}
              <Card className={`border-purple-200 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background relative overflow-hidden ${!anyStepVerified ? "opacity-75" : ""}`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
                <CardHeader className="pb-2 pt-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center">
                      <Box className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                      {lang === "sv" ? "Nivå 3" : "Level 3"}
                    </span>
                    {!anyStepVerified && (
                      <span className="text-[10px] text-muted-foreground border border-border rounded-full px-1.5 py-0.5 ml-auto">
                        {lang === "sv" ? "Låst" : "Locked"}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base text-purple-800 dark:text-purple-300">
                    {lang === "sv" ? "AR-förhandsvisning" : "AR Preview"}
                  </CardTitle>
                  <CardDescription className="text-[12px]">
                    {lang === "sv"
                      ? "Kan eleven visualisera det förväntade bygget spatialt?"
                      : "Can the student visualize the expected build spatially?"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-5">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "sv"
                      ? "WebXR AR placerar den procedurella 3D-modellen i det verkliga rummet via kameran. Kräver Android Chrome + ARCore."
                      : "WebXR AR places the procedural 3D model into real space via the camera. Requires Android Chrome + ARCore."}
                  </p>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-purple-400" />
                      {lang === "sv" ? "Procedurellt 3D-bygge i AR" : "Procedural 3D model in AR"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-purple-400" />
                      {lang === "sv" ? "WebXR hit-test placering" : "WebXR hit-test placement"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className={`h-3 w-3 ${anyStepVerified ? "text-purple-400" : "text-muted-foreground/40"}`} />
                      {lang === "sv" ? "Kräver AI-verifierat steg" : "Requires AI-verified step"}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white gap-2 h-9 text-sm disabled:opacity-50"
                    disabled={!anyStepVerified}
                    onClick={() => setArOpen(true)}
                  >
                    <Box className="h-4 w-4" />
                    {anyStepVerified
                      ? (lang === "sv" ? "Starta AR-förhandsvisning" : "Launch AR Preview")
                      : (lang === "sv" ? "AR låst — verifiera ett steg" : "AR Locked — verify a step")}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Connecting arrow labels between cards on desktop */}
            <div className="hidden md:flex items-center justify-between px-8 -mt-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
              <span className="flex-1 text-center">Verifies parts exist</span>
              <ArrowRight className="h-3 w-3 mx-2 flex-shrink-0" />
              <span className="flex-1 text-center">Verifies correct assembly</span>
              <ArrowRight className="h-3 w-3 mx-2 flex-shrink-0" />
              <span className="flex-1 text-center">Spatial visualization</span>
            </div>

            {/* Research Contribution note */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-1">
                    {lang === "sv" ? "Forskningsbidrag" : "Research Contribution"}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "sv"
                      ? "Detta ramverk stödjer progressiv inlärningsvalidering inom robotik med hjälp av multimodal AI (Gemini 1.5 Flash) och procedurella 3D-referenser. De tre nivåerna — komponent, montering och AR — motsvarar ökande kognitiv komplexitet i bygginlärning."
                      : "This framework supports progressive robotics learning validation using multimodal AI (Gemini 1.5 Flash) and procedural 3D references. The three levels — component, assembly, and AR — correspond to increasing cognitive complexity in construction learning."}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2 font-mono">
                    validationLevel: component_check → assembly_check → ar_preview
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Build Tab — 3 columns: 3D viewer | Instructions | Step-Check + AR */}
          <TabsContent value="build" className="space-y-6">
            {(() => {
              const totalSteps = steps.length;
              const currentStep = steps.find((s) => s.number === activeBuildStep) ?? steps[0];
              // proceduralReference is computed in useMemo above (component level)
              // to avoid running WebGL renders on every React re-render.
              const goPrev = () => setActiveBuildStep((s) => Math.max(1, s - 1));
              const goNext = () => setActiveBuildStep((s) => Math.min(totalSteps, s + 1));
              const verdict = progress.step_verdicts[String(currentStep.number)];
              const arUnlocked = verdict?.status === "correct";
              return (
                <div className="grid gap-4 lg:grid-cols-12">
                  {/* COL 1 — 3D viewer (~42%) */}
                  <Card className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Hammer className="h-5 w-5 text-primary" />
                        {lang === "sv" ? "Interaktiv 3D-byggguide" : "Interactive 3D Building Guide"}
                      </CardTitle>
                      <CardDescription>
                        {lang === "sv" ? "Följ 3D-modellen för varje steg." : "Watch the 3D model as you follow each step."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <BlixCartViewer chapterId={chapterIdNum} activeStep={activeBuildStep} />
                    </CardContent>
                  </Card>

                  {/* COL 2 — Instructions (~33%) */}
                  <div className="lg:col-span-4 space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {ui.step} {activeBuildStep} {ui.of} {totalSteps}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="outline" onClick={goPrev} disabled={activeBuildStep <= 1}>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={goNext} disabled={activeBuildStep >= totalSteps}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Slider
                          value={[activeBuildStep]}
                          min={1}
                          max={totalSteps}
                          step={1}
                          onValueChange={(v) => setActiveBuildStep(v[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          {steps.map((s) => {
                            const verified = !!progress.step_verdicts[String(s.number)];
                            return (
                              <button
                                key={s.number}
                                onClick={() => setActiveBuildStep(s.number)}
                                className={`w-7 h-7 rounded-full font-semibold transition-colors ${
                                  s.number === activeBuildStep
                                    ? "bg-primary text-primary-foreground"
                                    : verified
                                    ? "bg-success/20 text-success"
                                    : "bg-muted hover:bg-muted-foreground/20"
                                }`}
                              >
                                {s.number}
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card id={`step-${currentStep.number}`} className="scroll-mt-24 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                            {currentStep.number}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-2">{currentStep.instruction}</p>
                            {currentStep.detail && (
                              <p className="text-sm text-muted-foreground mb-3">{currentStep.detail}</p>
                            )}
                            {currentStep.pieces.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {currentStep.pieces.map((piece, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {piece}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* COL 3 — Step Check + AR (always visible, ~25%) */}
                  <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <Card className="border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          {lang === "sv" ? "AI-stegkontroll" : "AI Step Check"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {lang === "sv"
                            ? `Verifiera steg ${currentStep.number} med ett foto.`
                            : `Verify Step ${currentStep.number} with a photo.`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <StepCamera
                          key={currentStep.number}
                          step={currentStep}
                          chapterTitle={chapterTitle}
                          savedVerdict={verdict}
                          referenceImage={proceduralReference}
                          onVerified={(v) => saveStepVerdict(currentStep.number, v)}
                          onAdvance={() => setActiveBuildStep((s) => Math.min(totalSteps, s + 1))}
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-accent/30 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Box className="h-4 w-4 text-accent" />
                          {lang === "sv" ? "AR & AI-kompis" : "AR & AI Buddy"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2 space-y-3">
                        {!arUnlocked && (
                          <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/60 border border-border text-xs">
                            <Lightbulb className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">
                                {lang === "sv" ? "AR låst." : "AR locked."}
                              </span>{" "}
                              {verdict?.status === "incorrect"
                                ? `${lang === "sv" ? "Åtgärda och kontrollera igen:" : "Fix & re-check:"} "${verdict.tip || verdict.feedback}"`
                                : verdict?.status === "needs_review"
                                ? `${lang === "sv" ? "Behöver tydligare foto:" : "Need clearer photo:"} "${verdict.tip || verdict.feedback}"`
                                : lang === "sv" ? "Verifiera detta steg först." : "Verify this step above first."}
                            </p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10"
                          onClick={() => setAiOpen(true)}
                        >
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm">{lang === "sv" ? "Fråga AI-kompisen" : "Ask AI Buddy"}</span>
                        </Button>
                        <Button
                          variant="outline"
                          disabled={!arUnlocked}
                          className="w-full justify-start gap-2 border-accent/30 hover:bg-accent/10 disabled:opacity-50"
                          onClick={() => setArOpen(true)}
                        >
                          <Box className="h-4 w-4 text-accent" />
                          <span className="text-sm">
                            {arUnlocked
                              ? (lang === "sv" ? "AR-förhandsgranskning (prototyp)" : "AR Preview (Prototype)")
                              : (lang === "sv" ? "AR låst" : "AR Locked")}
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          {/* Challenge Tab */}
          <TabsContent value="challenge" className="space-y-6">
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader className="bg-gradient-to-r from-accent/20 to-primary/20">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  {challengeTitle}
                </CardTitle>
                <CardDescription>
                  {lang === "sv"
                    ? "Klara utmaningen för att tjäna XP och låsa upp nästa kapitel!"
                    : "Complete this challenge to earn XP and unlock the next chapter!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg mb-6">{challengeDescription}</p>

                {chapter.challenge.hint && (
                  <div className="mb-6 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded">
                    <p className="text-xs uppercase tracking-wide font-semibold text-amber-700 dark:text-amber-300 mb-1">
                      {ui.hint}
                    </p>
                    <p className="text-sm">{tr(chapter.challenge.hint, lang)}</p>
                  </div>
                )}

                {challengeDone ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-700">{lang === "sv" ? "Utmaning klar! +100 XP" : "Challenge Complete! +100 XP"}</p>
                      <p className="text-sm text-muted-foreground">{lang === "sv" ? "Fantastiskt arbete! Nästa kapitel låst upp." : "Great work! Next chapter unlocked."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg border-2 border-accent">
                    <div>
                      <p className="text-sm text-muted-foreground">{lang === "sv" ? "Belöning" : "Reward"}</p>
                      <p className="text-2xl font-bold text-accent">100 XP</p>
                    </div>
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleCompleteChallenge}
                      disabled={challengeSaving}
                    >
                      {challengeSaving ? "…" : lang === "sv" ? "Klara utmaningen" : "Complete Challenge"}
                    </Button>
                  </div>
                )}

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col items-start gap-1 border-primary/30 hover:bg-primary/5"
                    onClick={() => setAiOpen(true)}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Sparkles className="h-5 w-5 text-primary" /> {lang === "sv" ? "Fråga AI-kompisen" : "Ask AI Buddy"}
                    </div>
                    <p className="text-xs text-muted-foreground text-left font-normal">
                      {lang === "sv"
                        ? "Fastnat? Chatta med din AI-handledare om kapitlet."
                        : "Stuck? Chat with your AI tutor about this chapter."}
                    </p>
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!anyStepVerified}
                    className="h-auto py-4 flex-col items-start gap-1 border-accent/30 hover:bg-accent/5 disabled:opacity-50"
                    onClick={() => setArOpen(true)}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Box className="h-5 w-5 text-accent" />
                      {anyStepVerified
                        ? (lang === "sv" ? "AR-förhandsgranskning (prototyp)" : "AR Preview (Prototype)")
                        : (lang === "sv" ? "AR låst" : "AR Locked")}
                    </div>
                    <p className="text-xs text-muted-foreground text-left font-normal">
                      {anyStepVerified
                        ? (lang === "sv"
                            ? "Procedural 3D-modell. WebXR AR kräver Android Chrome + ARCore."
                            : "Procedural 3D model. WebXR AR requires Android Chrome + ARCore.")
                        : (lang === "sv"
                            ? "Verifiera minst ett steg med AI-kameran för att låsa upp AR."
                            : "Verify at least one step with the AI camera to unlock AR.")}
                    </p>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {lang === "sv" ? "Tillbaka till kapitel" : "Back to Chapters"}
            </Button>
          </Link>
          {chapterIdNum < 30 && (
            <Link to={`/chapter/${chapterIdNum + 1}`}>
              <Button>
                {lang === "sv" ? "Nästa kapitel" : "Next Chapter"}
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </Link>
          )}
          {chapterIdNum >= 30 && (
            <Link to="/">
              <Button variant="outline">
                {lang === "sv" ? "Tillbaka till start" : "Back to Home"}
              </Button>
            </Link>
          )}
        </div>
      </main>

      <AIAssistant
        open={aiOpen}
        onOpenChange={setAiOpen}
        chapterTitle={chapterTitle}
        context={`Theory: ${conceptText}. ${explanationText}`}
      />
      <ARViewer
        open={arOpen}
        onOpenChange={setArOpen}
        title={chapterTitle}
        chapterId={chapterIdNum}
        stepIdx={activeBuildStep - 1}
        modelUrl={getStepAsset(chapterIdNum, activeBuildStep).modelUrl}
        isAuthenticated={!!user}
        savedPose={progress.ar_pose}
        onSavePose={saveArPose}
        onClearPose={clearArPose}
      />
    </div>
  );
};

export default Chapter;
