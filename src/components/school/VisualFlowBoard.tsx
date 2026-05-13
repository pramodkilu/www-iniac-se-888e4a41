import { Link } from "react-router-dom";
import {
  Banknote,
  BookOpenCheck,
  Bot,
  CalendarDays,
  ChevronRight,
  Cpu,
  Database,
  GraduationCap,
  Layers,
  MessageSquareText,
  Monitor,
  Server,
  ShieldCheck,
  Smartphone,
  Trophy,
  UsersRound,
} from "lucide-react";
import roboligaStudents from "@/assets/roboliga-students.jpg";
import learningThroughPlay from "@/assets/learning-through-play.jpg";
import characterRobb from "@/assets/character-robb.png";
import characterLaya from "@/assets/character-laya.png";

type StageCard = {
  title: string;
  route: string;
  image?: string;
  icon?: React.ElementType;
  metric?: string;
  detail: string;
  tone: string;
};

const onboardingCards: StageCard[] = [
  {
    title: "Welcome / Landing",
    route: "/school",
    image: roboligaStudents,
    metric: "All-in-one",
    detail: "School management platform",
    tone: "from-blue-50 to-white",
  },
  {
    title: "Sign Up",
    route: "/school/signup",
    icon: UsersRound,
    metric: "Create account",
    detail: "Email, phone, school and profile",
    tone: "from-violet-50 to-white",
  },
  {
    title: "Role Selection",
    route: "/school/roles",
    icon: ShieldCheck,
    metric: "5 roles",
    detail: "Admin, teacher, parent, student",
    tone: "from-emerald-50 to-white",
  },
];

const dashboardCards: StageCard[] = [
  {
    title: "Admin Dashboard",
    route: "/school/dashboard/school-admin",
    icon: Monitor,
    metric: "428",
    detail: "Students, attendance, revenue",
    tone: "from-slate-50 to-white",
  },
  {
    title: "Teacher Dashboard",
    route: "/school/dashboard/teacher",
    icon: GraduationCap,
    metric: "2",
    detail: "Sessions today and pending notes",
    tone: "from-blue-50 to-white",
  },
  {
    title: "Student Dashboard",
    route: "/school/dashboard/student",
    icon: Trophy,
    metric: "72%",
    detail: "Progress, badges and challenges",
    tone: "from-violet-50 to-white",
  },
];

const moduleCards: StageCard[] = [
  { title: "Attendance", route: "/school/modules/attendance", icon: CalendarDays, metric: "87%", detail: "Present, absent, late", tone: "from-emerald-50 to-white" },
  { title: "Payments", route: "/school/modules/payments", icon: Banknote, metric: "SEK", detail: "Invoices and payment status", tone: "from-orange-50 to-white" },
  { title: "LMS / Courses", route: "/school/modules/courses", icon: BookOpenCheck, metric: "72%", detail: "AI and robotics modules", tone: "from-blue-50 to-white" },
  { title: "Messages", route: "/school/modules/messages", icon: MessageSquareText, metric: "Read", detail: "Parent communication", tone: "from-pink-50 to-white" },
  { title: "Calendar", route: "/school/modules/calendar", icon: CalendarDays, metric: "May", detail: "Events and sessions", tone: "from-cyan-50 to-white" },
  { title: "Library", route: "/school/modules/library", icon: Layers, metric: "PDF", detail: "Resources and guides", tone: "from-slate-50 to-white" },
];

const roboticsCards: StageCard[] = [
  { title: "Story", route: "/school/robotics", image: characterRobb, metric: "Start", detail: "Robot adventure", tone: "from-blue-50 to-white" },
  { title: "Build & Simulate", route: "/school/robotics", image: learningThroughPlay, metric: "Step 1/4", detail: "Assembly and testing", tone: "from-violet-50 to-white" },
  { title: "AI Verification", route: "/school/robotics", icon: Bot, metric: "82%", detail: "Accuracy and checklist", tone: "from-emerald-50 to-white" },
  { title: "Challenge", route: "/school/robotics", icon: Trophy, metric: "Open", detail: "Obstacle challenge", tone: "from-orange-50 to-white" },
];

const mobileCards: StageCard[] = [
  { title: "Parent Home", route: "/school/mobile", icon: Smartphone, metric: "88%", detail: "Attendance and updates", tone: "from-blue-50 to-white" },
  { title: "Parent Payments", route: "/school/mobile", icon: Banknote, metric: "Paid", detail: "Invoices and balance", tone: "from-orange-50 to-white" },
  { title: "Student Courses", route: "/school/mobile", icon: BookOpenCheck, metric: "3", detail: "Active learning paths", tone: "from-violet-50 to-white" },
  { title: "Achievements", route: "/school/mobile", image: characterLaya, metric: "9", detail: "Badges and rank", tone: "from-pink-50 to-white" },
];

const componentCards = [
  { code: "G20", name: "Gear (20 teeth)", qty: "x6 pcs", category: "gear", image: "/curriculum/components/g20.jpg" },
  { code: "G60", name: "Gear (60 teeth)", qty: "x3 pcs", category: "gear", image: "/curriculum/components/g60.jpg" },
  { code: "RACK", name: "Rack", qty: "x10 pcs", category: "gear", image: "/curriculum/components/rack.jpg" },
  { code: "SUSP", name: "Suspension", qty: "x2 pcs", category: "mechanical", image: "/curriculum/components/suspension.jpg" },
  { code: "MGL", name: "Mud Guard (left)", qty: "x3 pcs", category: "structural", image: "/curriculum/components/mud-guard-l.jpg" },
  { code: "PUL", name: "Pulley", qty: "x1 pc", category: "mechanical", image: "/curriculum/components/pulley.jpg" },
];

const architecture = [
  { title: "Users", icon: UsersRound, items: "Admin, Teacher, Parent, Student" },
  { title: "Apps", icon: Smartphone, items: "Web dashboard and mobile PWA" },
  { title: "API", icon: Server, items: "Supabase client and edge functions" },
  { title: "AI Engine", icon: Cpu, items: "Verification and learning help" },
  { title: "Data Layer", icon: Database, items: "Auth, Postgres, storage" },
];

function StageSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-violet-800">{label}</h2>
        <div className="h-px flex-1 bg-violet-100 ml-4" />
      </div>
      {children}
    </section>
  );
}

function VisualCard({ card }: { card: StageCard }) {
  const Icon = card.icon;
  return (
    <Link
      to={card.route}
      className={`group min-h-[250px] rounded-[24px] border border-slate-200 bg-gradient-to-br ${card.tone} p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="overflow-hidden rounded-2xl bg-slate-100 h-32">
        {card.image ? (
          <img src={card.image} alt={card.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-white to-slate-100">
            {Icon ? <Icon className="size-12 text-violet-700" /> : null}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-violet-700">{card.metric}</p>
          <h3 className="mt-1 font-black text-slate-950">{card.title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{card.detail}</p>
        </div>
        <ChevronRight className="mt-1 size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700" />
      </div>
    </Link>
  );
}

function PhonePreview({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="w-[170px] shrink-0 rounded-[26px] border border-slate-200 bg-white p-2 shadow-lg">
      <div className="min-h-[300px] rounded-[20px] bg-slate-50 p-3">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-900" />
        <p className="text-xs font-black text-violet-700">{title}</p>
        <div className="mt-4 space-y-2">
          {lines.map((line) => (
            <div key={line} className="rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VisualFlowBoard() {
  return (
    <div className="space-y-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">Image-based product map</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight">
              School dashboard, mobile app, robotics learning, and system architecture in one visual flow.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              This mirrors the reference style with staged cards, app screen previews, component gallery cards,
              light backgrounds, soft shadows, and clear routes into the working modules.
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto rounded-[24px] bg-slate-50 p-4">
            <PhonePreview title="Parent" lines={["Attendance 88%", "Invoice paid", "Teacher update"]} />
            <PhonePreview title="Student" lines={["AI Basics 75%", "Leaderboard #4", "9 badges"]} />
          </div>
        </div>
      </div>

      <StageSection label="Stage 1 - Website / Web Dashboard Flow">
        <div className="grid gap-4 md:grid-cols-3">
          {onboardingCards.map((card) => <VisualCard key={card.title} card={card} />)}
        </div>
      </StageSection>

      <StageSection label="Stage 2 - Dashboards">
        <div className="grid gap-4 md:grid-cols-3">
          {dashboardCards.map((card) => <VisualCard key={card.title} card={card} />)}
        </div>
      </StageSection>

      <StageSection label="Stage 3 - Core Modules">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {moduleCards.map((card) => <VisualCard key={card.title} card={card} />)}
        </div>
      </StageSection>

      <StageSection label="Stage 4 - Robotics & AI Learning">
        <div className="grid gap-4 md:grid-cols-4">
          {roboticsCards.map((card) => <VisualCard key={card.title} card={card} />)}
        </div>
      </StageSection>

      <StageSection label="Mobile App Flow">
        <div className="grid gap-4 md:grid-cols-4">
          {mobileCards.map((card) => <VisualCard key={card.title} card={card} />)}
        </div>
      </StageSection>

      <StageSection label="3D Gallery / Kit Components">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {componentCards.map((item) => (
            <div key={item.code} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex h-36 items-center justify-center rounded-xl bg-slate-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-contain p-4" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] font-black">{item.code}</span>
                <span className="text-[10px] font-black text-slate-500">{item.qty}</span>
              </div>
              <p className="mt-2 text-sm font-black text-slate-950">{item.name}</p>
              <span className="mt-2 inline-flex rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </StageSection>

      <StageSection label="Stage 6 - System Architecture">
        <div className="grid gap-4 md:grid-cols-5">
          {architecture.map((layer, index) => (
            <Link key={layer.title} to="/school/architecture" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <layer.icon className="size-6 text-violet-700" />
                <span className="text-xs font-black text-slate-300">0{index + 1}</span>
              </div>
              <p className="mt-4 font-black">{layer.title}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{layer.items}</p>
            </Link>
          ))}
        </div>
      </StageSection>
    </div>
  );
}
