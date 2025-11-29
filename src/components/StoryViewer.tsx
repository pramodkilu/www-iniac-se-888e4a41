import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

interface StoryScene {
  character: "laya" | "kit" | "robb" | "narrator";
  text: string;
  emotion: "happy" | "thinking" | "excited" | "curious";
}

const StoryViewer = () => {
  const [currentScene, setCurrentScene] = useState(0);
  
  const story: StoryScene[] = [
    {
      character: "narrator",
      text: "In a sunny village, an old man needed to move heavy boxes from his house...",
      emotion: "happy"
    },
    {
      character: "laya",
      text: "Look at that! The old man is struggling to push that heavy cart. The friction is making it so hard!",
      emotion: "curious"
    },
    {
      character: "kit",
      text: "Friction? What's that? Is it something sticky?",
      emotion: "thinking"
    },
    {
      character: "laya",
      text: "Great question, Kit! Friction is a force that happens when two surfaces rub together. It tries to slow things down!",
      emotion: "excited"
    },
    {
      character: "robb",
      text: "So that's why it's hard to slide heavy things on the ground! But wait... what if we added wheels?",
      emotion: "thinking"
    },
    {
      character: "kit",
      text: "Wheels! That's brilliant! With wheels, only a tiny part touches the ground, so less friction!",
      emotion: "excited"
    },
    {
      character: "laya",
      text: "Exactly! Let's help the old man build a cart with wheels. Are you ready to learn how?",
      emotion: "happy"
    }
  ];

  const characters = {
    laya: {
      name: "Laya",
      color: "from-purple-400 to-pink-400",
      avatar: "🧑‍🔬"
    },
    kit: {
      name: "Kit",
      color: "from-blue-400 to-cyan-400",
      avatar: "🦊"
    },
    robb: {
      name: "Robb",
      color: "from-green-400 to-emerald-400",
      avatar: "🤖"
    },
    narrator: {
      name: "Narrator",
      color: "from-amber-400 to-orange-400",
      avatar: "📖"
    }
  };

  const nextScene = () => {
    if (currentScene < story.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const scene = story[currentScene];
  const character = characters[scene.character];

  return (
    <div className="space-y-6">
      {/* Story Display */}
      <Card className="relative overflow-hidden border-primary/20">
        <div className={`absolute inset-0 bg-gradient-to-br ${character.color} opacity-10`} />
        
        <CardContent className="pt-8 pb-6 relative">
          {/* Character Avatar and Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-3xl shadow-lg animate-bounce-in`}>
              {character.avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold">{character.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{scene.emotion}</p>
            </div>
          </div>

          {/* Story Text */}
          <div className="bg-card rounded-lg p-6 shadow-sm border-2 border-primary/10 min-h-[120px] flex items-center">
            <p className="text-lg leading-relaxed animate-fade-in">
              "{scene.text}"
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center gap-2">
            {story.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentScene
                    ? "w-8 bg-primary"
                    : idx < currentScene
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={prevScene}
          disabled={currentScene === 0}
          variant="outline"
          size="lg"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Volume2 className="h-4 w-4" />
          Play Audio
        </Button>

        <Button
          onClick={nextScene}
          disabled={currentScene === story.length - 1}
          size="lg"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Vocabulary Words */}
      {scene.character !== "narrator" && (
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              💡 Key Concept
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-bold text-primary">Friction:</span>
                <span className="text-muted-foreground">
                  A force that opposes motion when two surfaces rub together
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-primary">Wheels:</span>
                <span className="text-muted-foreground">
                  Round objects that reduce friction by rolling instead of sliding
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoryViewer;
