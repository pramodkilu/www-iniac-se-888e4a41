import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play, Book, Hammer, Trophy, Lightbulb, Sparkles, Box, BookmarkCheck, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import BlixCartViewer from "@/components/3d/BlixCartViewer";
import StoryViewer from "@/components/StoryViewer";
import FrictionSimulator from "@/components/FrictionSimulator";
import StepCamera from "@/components/StepCamera";
import AIAssistant from "@/components/AIAssistant";
import ARViewer from "@/components/ARViewer";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { getChapter, tr, LGR22_STRANDS, SDG_INFO, chapterComponents } from "@/data/chapters";
import { useLanguage, useUIStrings } from "@/i18n/LanguageContext";

const Chapter = () => {
  const { id } = useParams();
  const chapterIdNum = Number(id) || 1;
  const [aiOpen, setAiOpen] = useState(false);
  const [arOpen, setArOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("build");
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const { progress, saveStepVerdict, saveArPose, clearArPose } = useChapterProgress(chapterIdNum);
  const [activeBuildStep, setActiveBuildStep] = useState(1);
  const { lang } = useLanguage();
  const ui = useUIStrings();

  // Pull chapter from the bilingual data file
  const chapter = getChapter(chapterIdNum);

  // Sync slider to saved progress when it loads
  useEffect(() => {
    if (progress.current_step) {
      setActiveBuildStep(Math.max(1, progress.current_step));
    }
  }, [progress.current_step]);

  // Guard: chapter not found
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

  // Resolve translated content once
  const chapterTitle = tr(chapter.title, lang);
  const chapterDescription = tr(chapter.subtitle, lang);
  const conceptText = tr(chapter.theory.concept, lang);
  const explanationText = tr(chapter.theory.explanation, lang);
  const challengeTitle = tr(chapter.challenge.title, lang);
  const challengeDescription = tr(chapter.challenge.description, lang);

  // The theory tab originally had an "experiment" field. Map this to the first
  // realWorldExample if it exists, falling back to a hint or empty string.
  const experimentText =
    chapter.theory.realWorldExamples.length > 0
      ? tr(chapter.theory.realWorldExamples[0], lang)
      : chapter.challenge.hint
        ? tr(chapter.challenge.hint, lang)
        : "";

  // Adapt build steps from chapters.ts shape -> shape Chapter.tsx already uses.
  // Chapter.tsx originally read step.number, step.instruction, step.detail, step.pieces.
  // chapters.ts uses step.stepNumber, step.title, step.description, step.components.
  const adaptedSteps = chapter.build.steps.map((s) => ({
    number: s.stepNumber,
    instruction: tr(s.title, lang),
    detail: tr(s.description, lang),
    pieces: s.components,
  }));

  // For chapters where detailed steps haven't been written yet (sessions 2-30
  // mostly use the shorthand format with empty steps[] arrays), synthesize
  // placeholder steps from build.totalSteps so the UI still renders.
  const steps =
    adaptedSteps.length > 0
      ? adaptedSteps
      : Array.from({ length: chapter.build.totalSteps || 1 }, (_, i) => ({
          number: i + 1,
          instruction:
            lang === "sv"
              ? `Steg ${i + 1} — detaljer kommer snart.`
              : `Step ${i + 1} — details coming soon.`,
          detail:
            lang === "sv"
              ? "Den fullständiga byggsekvensen läggs till här när den är klar."
              : "The full build sequence will be added here when ready.",
          pieces: [] as string[],
        }));

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
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="story" className="gap-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.story}</span>
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.theory}</span>
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

            <FrictionSimulator />
          </TabsContent>

          {/* Build Tab — 3 columns: 3D viewer | Instructions | Step-Check + AR */}
          <TabsContent value="build" className="space-y-6">
            {(() => {
              const totalSteps = steps.length;
              const currentStep = steps.find((s) => s.number === activeBuildStep) ?? steps[0];
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
                              ? (lang === "sv" ? "Visa i AR" : "View in AR")
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

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border-2 border-accent">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {lang === "sv" ? "Belöning" : "Reward"}
                    </p>
                    <p className="text-2xl font-bold text-accent">100 XP</p>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {lang === "sv" ? "Klara utmaningen" : "Complete Challenge"}
                  </Button>
                </div>

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
                    className="h-auto py-4 flex-col items-start gap-1 border-accent/30 hover:bg-accent/5"
                    onClick={() => setArOpen(true)}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Box className="h-5 w-5 text-accent" /> {lang === "sv" ? "Visa i AR" : "View in AR"}
                    </div>
                    <p className="text-xs text-muted-foreground text-left font-normal">
                      {lang === "sv"
                        ? "Placera ditt BLIX-bygge i verkligheten med kameran."
                        : "Place your BLIX build in the real world using your camera."}
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
          <Link to={`/chapter/${chapterIdNum + 1}`}>
            <Button>
              {lang === "sv" ? "Nästa kapitel" : "Next Chapter"}
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </Link>
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
        savedPose={progress.ar_pose}
        onSavePose={saveArPose}
        onClearPose={clearArPose}
      />
    </div>
  );
};

export default Chapter;
