import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Book, Hammer, Trophy, Lightbulb, Sparkles, Box, BookmarkCheck, X } from "lucide-react";
import { useState } from "react";
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
  const { progress, saveStepVerdict, saveArPose, clearArPose } = useChapterProgress(chapterIdNum);

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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="build" className="space-y-6">
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

          {/* Build Tab with 3D Viewer */}
          <TabsContent value="build" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="h-5 w-5 text-primary" />
                  Interactive 3D Building Guide
                </CardTitle>
                <CardDescription>
                  Follow the steps below and watch the 3D model as you build your {chapterData.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <BlixCartViewer />
              </CardContent>
            </Card>

            {/* Step-by-step text guide */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-lg">Written Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chapterData.steps.map((step) => (
                    <div key={step.number} className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{step.instruction}</p>
                          {step.detail && (
                            <p className="text-sm text-muted-foreground mb-2">{step.detail}</p>
                          )}
                          {step.pieces.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {step.pieces.map((piece, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {piece}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <StepCamera
                        step={step}
                        chapterTitle={chapterData.title}
                        savedVerdict={progress.step_verdicts[String(step.number)]}
                        onVerified={(v) => saveStepVerdict(step.number, v)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI + AR panel — appears right after the build steps */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Explore with AI & AR
                </CardTitle>
                <CardDescription>
                  Done building? Ask our AI buddy anything, or place your creation in the real world with AR.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-5 flex-col items-start gap-1 border-primary/30 hover:bg-primary/10"
                  onClick={() => setAiOpen(true)}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-5 w-5 text-primary" /> Ask AI Buddy
                  </div>
                  <p className="text-xs text-muted-foreground text-left font-normal">
                    Chat with your AI tutor about this chapter.
                  </p>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-5 flex-col items-start gap-1 border-accent/30 hover:bg-accent/10"
                  onClick={() => setArOpen(true)}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Box className="h-5 w-5 text-accent" /> View in AR
                  </div>
                  <p className="text-xs text-muted-foreground text-left font-normal">
                    Place your BLIX build in the real world.
                  </p>
                </Button>
              </CardContent>
            </Card>
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
