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

const Chapter = () => {
  const { id } = useParams();
  const chapterIdNum = Number(id) || 1;
  const [aiOpen, setAiOpen] = useState(false);
  const [arOpen, setArOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("build");
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const { progress, saveStepVerdict, saveArPose, clearArPose } = useChapterProgress(chapterIdNum);
  const [activeBuildStep, setActiveBuildStep] = useState(1);

  // Sync slider to saved progress when it loads
  useEffect(() => {
    if (progress.current_step) {
      setActiveBuildStep(Math.max(1, progress.current_step));
    }
  }, [progress.current_step]);

  // Sample data for Chapter 1
  const chapterData = {
    id: 1,
    title: "Cart With Wheels",
    description: "Learn about friction and motion by building a wheeled cart",
    difficulty: "Easy",
    category: "Mechanics",
    story: {
      title: "The Old Man's Problem",
      content: "Once upon a time, an old man needed to move his heavy possessions from one place to another. Pushing them along the ground was so difficult! Then he had a brilliant idea - what if he used wheels?"
    },
    theory: {
      concept: "Friction",
      explanation: "Friction is the force that opposes motion between two surfaces. When you slide something heavy on the ground, there's a lot of friction. But when you add wheels, the friction is greatly reduced, making it much easier to move!",
      experiment: "Try sliding a book across your desk, then try rolling it on pencils. Which way is easier? That's the difference friction makes!"
    },
    steps: [
      { 
        number: 1, 
        instruction: "Take the P7X11 U-shaped pillar and lay it flat as your base structure", 
        pieces: ["P7X11"],
        detail: "This will be the main frame of your cart. Notice the multiple holes - these will hold other components."
      },
      { 
        number: 2, 
        instruction: "Insert two CT2 connectors into the bottom holes of the base pillar", 
        pieces: ["CT2", "CT2"],
        detail: "These connectors will hold the axle holders in place. Push them in firmly until they click."
      },
      { 
        number: 3, 
        instruction: "Attach two CT3 axle holders to the CT2 connectors", 
        pieces: ["CT3", "CT3"],
        detail: "The CT3 holders have round holes for the axle shafts to pass through."
      },
      { 
        number: 4, 
        instruction: "Slide two SH170 axle shafts through the CT3 holders", 
        pieces: ["SH170", "SH170"],
        detail: "The shafts should move freely through the holders - this is what allows the wheels to spin."
      },
      { 
        number: 5, 
        instruction: "Push four wheels onto the ends of both axle shafts", 
        pieces: ["Wheel x4"],
        detail: "Make sure the wheels are pushed all the way onto the shafts and can spin freely."
      },
      {
        number: 6,
        instruction: "Test your cart by pushing it on a smooth surface!",
        pieces: [],
        detail: "Notice how easily it rolls compared to sliding something without wheels. That's reduced friction!"
      }
    ],
    challenge: {
      title: "Distance Challenge",
      description: "Push your cart on different surfaces (smooth desk, rough carpet, bumpy ground) and measure how far it travels. Which surface has the most friction? The least?",
      xp: 100
    }
  };

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
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">Chapter {id}</Badge>
                <Badge className="bg-success text-success-foreground">{chapterData.difficulty}</Badge>
                <Badge variant="secondary">{chapterData.category}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{chapterData.title}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 ${activeTab === "build" ? "max-w-[1600px]" : "max-w-6xl"}`}>
        {(() => {
          const totalSteps = chapterData.steps.length;
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
                    {isComplete ? "You finished all the steps!" : `Welcome back — pick up at Step ${resumeStep}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {verdictCount} of {totalSteps} steps verified by AI.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleResume} disabled={isComplete}>
                  Continue Step {resumeStep}
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
              <span className="hidden sm:inline">Story</span>
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Theory</span>
            </TabsTrigger>
            <TabsTrigger value="build" className="gap-2">
              <Hammer className="h-4 w-4" />
              <span className="hidden sm:inline">Build</span>
            </TabsTrigger>
            <TabsTrigger value="challenge" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Challenge</span>
            </TabsTrigger>
          </TabsList>

          {/* Story Tab */}
          <TabsContent value="story" className="space-y-6">
            <StoryViewer />
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory" className="space-y-6">
            <Card className="border-secondary/20">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-success/10">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-secondary" />
                  Understanding {chapterData.theory.concept}
                </CardTitle>
                <CardDescription>Learn the science behind this project</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">What is {chapterData.theory.concept}?</h3>
                  <p className="text-muted-foreground">{chapterData.theory.explanation}</p>
                </div>
                <div className="p-4 bg-accent/10 border-l-4 border-accent rounded">
                  <h4 className="font-semibold mb-2">Try This Experiment:</h4>
                  <p className="text-sm">{chapterData.theory.experiment}</p>
                </div>
              </CardContent>
            </Card>
            
            <FrictionSimulator />
          </TabsContent>

          {/* Build Tab — 3 columns: 3D viewer | Instructions | Step-Check + AR */}
          <TabsContent value="build" className="space-y-6">
            {(() => {
              const totalSteps = chapterData.steps.length;
              const currentStep = chapterData.steps.find((s) => s.number === activeBuildStep) ?? chapterData.steps[0];
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
                        Interactive 3D Building Guide
                      </CardTitle>
                      <CardDescription>Watch the 3D model as you follow each step.</CardDescription>
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
                            Step {activeBuildStep} of {totalSteps}
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
                          {chapterData.steps.map((s) => {
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
                          AI Step Check
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Verify Step {currentStep.number} with a photo.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <StepCamera
                          key={currentStep.number}
                          step={currentStep}
                          chapterTitle={chapterData.title}
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
                          AR & AI Buddy
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2 space-y-3">
                        {!arUnlocked && (
                          <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/60 border border-border text-xs">
                            <Lightbulb className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">AR locked.</span>{" "}
                              {verdict?.status === "incorrect"
                                ? `Fix & re-check: "${verdict.tip || verdict.feedback}"`
                                : verdict?.status === "needs_review"
                                ? `Need clearer photo: "${verdict.tip || verdict.feedback}"`
                                : "Verify this step above first."}
                            </p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10"
                          onClick={() => setAiOpen(true)}
                        >
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm">Ask AI Buddy</span>
                        </Button>
                        <Button
                          variant="outline"
                          disabled={!arUnlocked}
                          className="w-full justify-start gap-2 border-accent/30 hover:bg-accent/10 disabled:opacity-50"
                          onClick={() => setArOpen(true)}
                        >
                          <Box className="h-4 w-4 text-accent" />
                          <span className="text-sm">{arUnlocked ? "View in AR" : "AR Locked"}</span>
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
                  {chapterData.challenge.title}
                </CardTitle>
                <CardDescription>Complete this challenge to earn XP and unlock the next chapter!</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg mb-6">{chapterData.challenge.description}</p>
                
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border-2 border-accent">
                  <div>
                    <p className="text-sm text-muted-foreground">Reward</p>
                    <p className="text-2xl font-bold text-accent">{chapterData.challenge.xp} XP</p>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Complete Challenge
                  </Button>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col items-start gap-1 border-primary/30 hover:bg-primary/5"
                    onClick={() => setAiOpen(true)}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Sparkles className="h-5 w-5 text-primary" /> Ask AI Buddy
                    </div>
                    <p className="text-xs text-muted-foreground text-left font-normal">
                      Stuck? Chat with your AI tutor about this chapter.
                    </p>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col items-start gap-1 border-accent/30 hover:bg-accent/5"
                    onClick={() => setArOpen(true)}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Box className="h-5 w-5 text-accent" /> View in AR
                    </div>
                    <p className="text-xs text-muted-foreground text-left font-normal">
                      Place your BLIX build in the real world using your camera.
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
              Back to Chapters
            </Button>
          </Link>
          <Button disabled className="opacity-50">
            Next Chapter
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </div>
      </main>

      <AIAssistant
        open={aiOpen}
        onOpenChange={setAiOpen}
        chapterTitle={chapterData.title}
        context={`Theory: ${chapterData.theory.concept}. ${chapterData.theory.explanation}`}
      />
      <ARViewer
        open={arOpen}
        onOpenChange={setArOpen}
        title={chapterData.title}
        savedPose={progress.ar_pose}
        onSavePose={saveArPose}
        onClearPose={clearArPose}
      />
    </div>
  );
};

export default Chapter;
