import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChevronLeft,
  ClipboardCheck,
  Code2,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Menu,
  Play,
  Rocket,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PAGE_META: Record<
  string,
  { eyebrow: string; title: string; subtitle: string }
> = {
  "/innovation": {
    eyebrow: "AI learning platform",
    title: "Build the INIAC LMS for web, iOS, and Android.",
    subtitle:
      "A real school SaaS platform for after-school AI, robotics, cricket, attendance, payments, and parent communication.",
  },
  "/partners": {
    eyebrow: "For schools and partners",
    title: "Run programs across campuses with one connected platform.",
    subtitle:
      "Give partners a clear operating system for students, batches, teachers, curriculum, progress, and reports.",
  },
  "/about": {
    eyebrow: "About INIAC",
    title: "INIAC helps students learn, build, and compete.",
    subtitle:
      "We combine AI education, robotics labs, activity programs, and mobile-first reporting for modern schools.",
  },
  "/contact": {
    eyebrow: "Start a rollout",
    title: "Bring the INIAC platform to your school or program.",
    subtitle:
      "Use the web dashboard for staff and React Native mobile apps for teachers, parents, and students.",
  },
};

const roles = [
  { name: "Super Admin", detail: "Schools, plans, permissions", color: "bg-violet-100 text-violet-700" },
  { name: "School Admin", detail: "Programs, batches, users", color: "bg-blue-100 text-blue-700" },
  { name: "Teacher", detail: "Sessions, attendance, notes", color: "bg-emerald-100 text-emerald-700" },
  { name: "Parent", detail: "Updates, payments, progress", color: "bg-orange-100 text-orange-700" },
  { name: "Student", detail: "Lessons, badges, projects", color: "bg-pink-100 text-pink-700" },
];

const modules = [
  { icon: UsersRound, name: "Students", text: "Profiles, guardians, cohorts, and learning history." },
  { icon: CalendarDays, name: "Attendance", text: "Fast session marking with absence and note tracking." },
  { icon: BookOpenCheck, name: "Curriculum", text: "AI, robotics, cricket, and activity lesson flows." },
  { icon: ClipboardCheck, name: "Assessments", text: "Skills, checkpoints, projects, and teacher feedback." },
  { icon: LineChart, name: "Reports", text: "Program performance, attendance, progress, and payments." },
  { icon: ShieldCheck, name: "Roles", text: "Separate experiences for admins, teachers, parents, and students." },
];

const sessions = [
  { name: "Robotics Basics", grade: "Grade 3-5", students: 24, tone: "bg-violet-600" },
  { name: "AI Explorers", grade: "Grade 6-8", students: 28, tone: "bg-blue-600" },
  { name: "Cricket Academy", grade: "Age 8-14", students: 20, tone: "bg-emerald-600" },
];

function IniacMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 grid-cols-2 gap-1 rounded-2xl bg-white p-1 shadow-sm">
        <span className="rounded-lg bg-orange-500" />
        <span className="rounded-lg bg-blue-600" />
        <span className="rounded-lg bg-violet-600" />
        <span className="rounded-lg bg-emerald-500" />
      </div>
      <div>
        <p className="text-2xl font-black tracking-wide text-slate-950">INIAC</p>
        <p className="text-[11px] font-semibold text-slate-500">
          Learn - Build - Compete
        </p>
      </div>
    </div>
  );
}

function PhoneShell({ variant = "teacher" }: { variant?: "teacher" | "parent" }) {
  return (
    <div className="mx-auto w-full max-w-[310px] rounded-[32px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/50">
      <div className="flex h-[590px] flex-col overflow-hidden rounded-[24px] bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          {variant === "teacher" ? (
            <Menu className="size-5 text-slate-800" />
          ) : (
            <ChevronLeft className="size-5 text-slate-800" />
          )}
          <Bell className="size-5 text-slate-800" />
        </div>

        {variant === "teacher" ? (
          <>
            <div className="mt-7">
              <p className="text-lg font-bold text-slate-950">Hi, John</p>
              <p className="text-xs font-medium text-slate-500">Teacher Dashboard</p>
            </div>
            <div className="mt-5 rounded-2xl bg-violet-700 p-4 text-white">
              <p className="text-sm font-bold">Today's Sessions</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-5xl font-black">2</p>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  View all
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                ["Students", "28"],
                ["Attendance", "85%"],
                ["Pending", "5"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-500">{label}</p>
                  <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm font-black text-slate-950">
              Upcoming Sessions
            </p>
            <div className="mt-3 space-y-3">
              {sessions.slice(0, 2).map((session) => (
                <div key={session.name} className="rounded-2xl bg-white p-3">
                  <p className="text-sm font-bold text-slate-950">{session.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {session.grade} - 4:00 PM
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mt-5 text-center">
              <p className="text-lg font-bold text-slate-950">Robotics Basics</p>
              <p className="text-sm text-slate-500">Grade 3-5</p>
            </div>
            <div className="mt-7 flex gap-5 border-b border-slate-200 text-xs font-bold text-slate-500">
              <span className="border-b-2 border-violet-700 pb-3 text-violet-700">
                Overview
              </span>
              <span>Students</span>
              <span>Sessions</span>
            </div>
            <div className="mt-5 divide-y divide-slate-200 text-sm">
              {[
                ["Teacher", "John Smith"],
                ["Schedule", "Tue, Thu - 4 PM"],
                ["Students", "24"],
                ["Attendance", "82%"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-4">
                  <span className="font-bold text-slate-700">{label}</span>
                  <span className="text-slate-600">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-sm font-bold">
                <span>Progress</span>
                <span>72%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[72%] rounded-full bg-violet-700" />
              </div>
            </div>
            <button className="mt-auto h-12 rounded-xl bg-violet-700 text-sm font-bold text-white">
              View Sessions
            </button>
          </>
        )}

        <div className="mt-auto grid grid-cols-4 gap-2 border-t border-slate-200 pt-3 text-center text-[10px] font-bold text-slate-500">
          {["Home", "Programs", "Reports", "More"].map((item) => (
            <span key={item} className={item === "Home" ? "text-violet-700" : ""}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ComingSoon = () => {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? PAGE_META["/innovation"];

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <Header />
      <main className="pt-16">
        <section className="container grid gap-10 py-12 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-8">
              <IniacMark />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-700 shadow-sm">
              <Rocket className="size-4" />
              {meta.eyebrow}
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {meta.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {meta.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-violet-700 hover:bg-violet-800">
                <Link to="/auth">
                  Start platform demo
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/programs">View programs</Link>
              </Button>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <Smartphone className="size-5 text-slate-950" />
                <div>
                  <p className="text-sm font-black">iOS and Android</p>
                  <p className="text-xs text-slate-500">Built with React Native</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <Code2 className="size-5 text-slate-950" />
                <div>
                  <p className="text-sm font-black">Web dashboard</p>
                  <p className="text-xs text-slate-500">Admins, reports, setup</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <PhoneShell />
            <div className="hidden pt-12 sm:block">
              <PhoneShell variant="parent" />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-10">
          <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["150+", "Students managed"],
              ["8", "Active programs"],
              ["78%", "Average attendance"],
              ["3", "Platforms: web, iOS, Android"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-3xl font-black text-slate-950">{value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">
              Product modules
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Everything needed to run school activities from one system.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <div
                key={module.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <module.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-black">{module.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container grid gap-8 pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[28px] bg-slate-950 p-7 text-white">
            <LayoutDashboard className="size-8 text-violet-300" />
            <h2 className="mt-5 text-3xl font-black">React Native mobile app plan</h2>
            <p className="mt-4 leading-7 text-slate-300">
              The mobile app should share the same product model as the website:
              login, role selection, teacher dashboard, attendance, curriculum,
              parent updates, and student progress.
            </p>
            <div className="mt-6 grid gap-3">
              {["Expo React Native", "Supabase Auth and database", "Push notifications", "Offline-friendly attendance"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                  <Play className="size-4 text-violet-300" />
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {sessions.map((session) => (
              <div
                key={session.name}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[80px_1fr_auto] sm:items-center"
              >
                <div className={`flex size-20 items-center justify-center rounded-2xl ${session.tone} text-4xl`}>
                  <GraduationCap className="size-9 text-white" />
                </div>
                <div>
                  <h3 className="font-black">{session.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{session.grade}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
                  {session.students} students
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoon;
