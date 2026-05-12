import { Bot, Camera, CheckCircle2, CircuitBoard, Trophy } from "lucide-react";
import { ProgressCard, SectionCard } from "@/components/school/SchoolCards";
import { SchoolShell } from "@/components/school/SchoolShell";

const stages = [
  {
    title: "Story / Introduction",
    icon: Bot,
    text: "Students meet the mission: build a helpful robot assistant for the school lab.",
    status: "Ready",
  },
  {
    title: "Build & Simulate",
    icon: CircuitBoard,
    text: "Follow a build checklist, test sensors, and simulate movement before class review.",
    status: "In progress",
  },
  {
    title: "AI Verification",
    icon: Camera,
    text: "Use camera/image checks to verify parts, project evidence, and activity outputs.",
    status: "82% accuracy",
  },
  {
    title: "Challenge",
    icon: Trophy,
    text: "Complete the final challenge and submit evidence for teacher assessment.",
    status: "Unlocked",
  },
];

export default function RoboticsLearning() {
  return (
    <SchoolShell
      title="Robotics & AI Learning"
      description="A guided mobile and web learning flow for story, build, AI verification, and challenge status."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <stage.icon className="size-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-black">
                      {index + 1}. {stage.title}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {stage.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stage.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <ProgressCard title="Module progress" value={72} description="Students completed story and first build tasks." />
          <ProgressCard title="AI verification accuracy" value={82} description="Image recognition checks are passing on most submissions." />
          <SectionCard title="Build checklist">
            <div className="space-y-3">
              {["Chassis assembled", "Sensors connected", "Motor test passed", "Code uploaded"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </SchoolShell>
  );
}
