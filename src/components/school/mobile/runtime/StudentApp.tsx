import { useState } from "react";
import { Award, Bot, CheckCircle2, Home, Play, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSchoolModules } from "@/hooks/useSchoolModules";
import { type Student } from "@/hooks/useSchoolOperations";
import { MobileChrome } from "@/components/school/mobile/runtime/MobileChrome";
import { AppMetric, AppRow, HeroCard, StatusPill, type MobileTab } from "@/components/school/mobile/runtime/MobilePrimitives";

export function StudentApp({
  student,
  defaultSchoolId,
  initialTab,
}: {
  student: Student;
  defaultSchoolId?: string | null;
  initialTab?: string;
}) {
  const validTabs = ["home", "courses", "progress", "rank", "badges"];
  const [tab, setTab] = useState(validTabs.includes(initialTab ?? "") ? initialTab ?? "home" : "home");
  const [progressBoost, setProgressBoost] = useState(0);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [earnedBadges, setEarnedBadges] = useState(["AI Explorer", "Fast Builder", "Problem Solver"]);
  const { courses } = useSchoolModules(defaultSchoolId, { previewOnly: true });
  const progress = Math.min(100, 72 + progressBoost);
  const activeCourse = courses.find((course) => course.id === activeCourseId) ?? courses[0];

  const tabs: MobileTab[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "courses", label: "Courses", icon: Bot },
    { id: "progress", label: "Progress", icon: CheckCircle2 },
    { id: "rank", label: "Rank", icon: Trophy },
    { id: "badges", label: "Badges", icon: Award },
  ];

  return (
    <MobileChrome
      title="Student App"
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      onBack={() => setTab("home")}
      onBell={() => {
        setTab("badges");
        toast.info("Opened student achievements");
      }}
    >
      {tab === "home" ? (
        <div className="space-y-4">
          <HeroCard eyebrow={`Hi, ${student.full_name.split(" ")[0]}`} title="Continue learning" label="Current mission" value="Robot Sensor Lab" progress={progress} />
          <div className="grid grid-cols-3 gap-2">
            <AppMetric label="Courses" value={String(courses.length)} />
            <AppMetric label="Badges" value="9" />
            <AppMetric label="Rank" value="#4" />
          </div>
          <Button
            className="w-full bg-violet-700 hover:bg-violet-800"
            onClick={() => {
              setProgressBoost((value) => Math.min(value + 4, 28));
              if (!earnedBadges.includes("Step Streak")) setEarnedBadges((badges) => [...badges, "Step Streak"]);
              toast.success("Progress saved");
            }}
          >
            <Play className="mr-2 size-4" />
            Complete next step
          </Button>
          {courses.slice(0, 2).map((course) => (
            <AppRow
              key={course.id}
              title={course.title}
              meta={course.description ?? "Course module"}
              status={activeCourse?.id === course.id ? "Active" : `${course.progress_percent ?? 0}%`}
              action={() => {
                setActiveCourseId(course.id);
                setTab("courses");
              }}
            />
          ))}
        </div>
      ) : null}

      {tab === "courses" ? (
        <div className="space-y-3">
          {courses.map((course) => (
            <button
              key={course.id}
              className={`w-full rounded-2xl bg-white p-4 text-left shadow-sm transition hover:bg-violet-50 ${
                activeCourse?.id === course.id ? "ring-2 ring-violet-200" : ""
              }`}
              type="button"
              onClick={() => {
                setActiveCourseId(course.id);
                setProgressBoost((value) => Math.min(value + 2, 28));
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-slate-950">{course.title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{course.description}</p>
                </div>
                <StatusPill>{course.status}</StatusPill>
              </div>
              <Progress
                value={activeCourse?.id === course.id ? Math.min((course.progress_percent ?? 0) + progressBoost, 100) : course.progress_percent ?? 0}
                className="mt-4 h-2 bg-slate-100 [&>div]:bg-violet-700"
              />
            </button>
          ))}
        </div>
      ) : null}

      {tab === "progress" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Learning report" title="Overall score" label="Completion" value={`${progress}%`} progress={progress} />
          <AppRow title="Problem solving" meta="Skill unlocked" status="Gold" tone="orange" action={() => setTab("badges")} />
          <AppRow title="Team work" meta="Peer lab activity" status="Strong" tone="green" action={() => toast.success("Teamwork note saved")} />
          <AppRow title="Creativity" meta="Project design" status="Rising" action={() => setProgressBoost((value) => Math.min(value + 3, 28))} />
        </div>
      ) : null}

      {tab === "rank" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Grade 4" title="Top builders" label="Your rank" value="#4" progress={68} />
          {[
            ["Maja", "910 pts", "#1"],
            ["Oskar", "850 pts", "#2"],
            ["Aarav", "790 pts", "#4"],
          ].map(([name, points, rank]) => (
            <AppRow key={name} title={name} meta={points} status={rank} tone={rank === "#1" ? "orange" : "blue"} />
          ))}
        </div>
      ) : null}

      {tab === "badges" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Badge wallet" title="9 badges earned" label="Latest badge" value="AI Explorer" progress={74} />
          {earnedBadges.map((badge, index) => (
            <AppRow
              key={badge}
              title={badge}
              meta={index === 0 ? "Latest achievement" : "Earned from learning activity"}
              status={index === 0 ? "Gold" : "Earned"}
              tone={index === 0 ? "orange" : "green"}
            />
          ))}
        </div>
      ) : null}
    </MobileChrome>
  );
}
