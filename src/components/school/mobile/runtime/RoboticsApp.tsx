import { useState } from "react";
import { Bot, CheckCircle2, Home, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MobileChrome } from "@/components/school/mobile/runtime/MobileChrome";
import { AppRow, HeroCard, type MobileTab } from "@/components/school/mobile/runtime/MobilePrimitives";

export function RoboticsApp({ initialTab }: { initialTab?: string }) {
  const validTabs = ["story", "build", "verify", "challenge"];
  const [tab, setTab] = useState(validTabs.includes(initialTab ?? "") ? initialTab ?? "story" : "story");
  const [checklist, setChecklist] = useState(["story"]);
  const [bestTime, setBestTime] = useState(48);
  const [attempts, setAttempts] = useState(2);

  const complete = (step: string) => {
    setChecklist((items) => (items.includes(step) ? items : [...items, step]));
    toast.success(`${step} completed`);
  };

  const progress = Math.round((checklist.length / 4) * 100);
  const tabs: MobileTab[] = [
    { id: "story", label: "Story", icon: Home },
    { id: "build", label: "Build", icon: Bot },
    { id: "verify", label: "AI Check", icon: CheckCircle2 },
    { id: "challenge", label: "Challenge", icon: Trophy },
  ];

  return (
    <MobileChrome
      title="Robotics AI"
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      onBack={() => setTab("story")}
      onBell={() => {
        setTab("challenge");
        toast.info("Challenge status opened");
      }}
    >
      <div className="space-y-4">
        <HeroCard eyebrow="The Robot Adventure" title={tab === "story" ? "Help Robo cross the field" : "Sensor rover mission"} label="Mission progress" value={`${progress}%`} progress={progress} />
        {tab === "story" ? (
          <>
            <AppRow title="Watch story" meta="Mission intro" status="Done" tone="green" action={() => setTab("build")} />
            <AppRow title="Collect kit" meta="Sensors, gears, wheels" status={checklist.includes("kit") ? "Done" : "Start"} tone={checklist.includes("kit") ? "green" : "blue"} action={() => complete("kit")} />
          </>
        ) : null}
        {tab === "build" ? (
          <>
            <AppRow title="Mount wheels" meta="Step 2" status={checklist.includes("wheels") ? "Done" : "Open"} tone={checklist.includes("wheels") ? "green" : "blue"} action={() => complete("wheels")} />
            <AppRow title="Connect sensor" meta="Step 3" status={checklist.includes("sensor") ? "Done" : "Open"} tone={checklist.includes("sensor") ? "green" : "blue"} action={() => complete("sensor")} />
          </>
        ) : null}
        {tab === "verify" ? (
          <>
            <AppRow title="Wheel alignment" meta="Computer vision check" status="Correct" tone="green" />
            <AppRow title="Cable placement" meta="Model confidence 95%" status="Correct" tone="green" />
            <Button className="w-full bg-violet-700 hover:bg-violet-800" onClick={() => complete("ai")}>Run AI verification</Button>
          </>
        ) : null}
        {tab === "challenge" ? (
          <>
            <AppRow
              title="Obstacle track"
              meta="Beat your best time"
              status={progress >= 100 ? "Start" : "Locked"}
              tone={progress >= 100 ? "green" : "orange"}
              action={() => {
                if (progress < 100) {
                  toast.error("Complete AI verification first");
                  return;
                }
                setAttempts((value) => value + 1);
                setBestTime((value) => Math.max(35, value - 2));
                toast.success("Challenge run recorded");
              }}
            />
            <AppRow title="Best run" meta={`${bestTime} seconds · ${attempts} attempts`} status={`${820 + attempts * 20} pts`} tone="orange" />
          </>
        ) : null}
      </div>
    </MobileChrome>
  );
}
