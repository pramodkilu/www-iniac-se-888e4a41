import { Link } from "react-router-dom";
import {
  Banknote,
  BookOpenCheck,
  Bot,
  CalendarDays,
  Library,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolShell } from "@/components/school/SchoolShell";
import { FeatureCard } from "@/components/school/SchoolCards";
import { VisualFlowBoard } from "@/components/school/VisualFlowBoard";
import { roles } from "@/data/mockSchoolData";

const features = [
  { icon: CalendarDays, title: "Attendance", text: "Fast class marking and absence notes.", href: "/school/modules/attendance" },
  { icon: Banknote, title: "Payments", text: "Invoices, Swish tracking, and payment reports.", href: "/school/modules/payments" },
  { icon: BookOpenCheck, title: "LMS courses", text: "AI, robotics, cricket, and project learning.", href: "/school/modules/courses" },
  { icon: MessageSquareText, title: "Communication", text: "Parent updates, messages, and reminders.", href: "/school/modules/messages" },
  { icon: Library, title: "Resources", text: "Guides, worksheets, build sheets, and media.", href: "/school/modules/library" },
  { icon: Bot, title: "Robotics AI", text: "Story, build, verify, and challenge learning flow.", href: "/school/robotics" },
];

export default function SchoolPlatformOverview() {
  return (
    <SchoolShell
      title="School Management Platform"
      description="A responsive web dashboard and mobile/PWA experience for INIAC school programs."
    >
      <VisualFlowBoard />

      <section className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-center">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-violet-700">
            <ShieldCheck className="size-4" />
            Onboarding and authentication
          </div>
          <h2 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            One platform for admins, teachers, parents, and students.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Start with login, select a role, then enter a focused dashboard with attendance,
            payments, LMS courses, messages, events, reports, and robotics AI learning.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-violet-700 hover:bg-violet-800">
              <Link to="/school/signup">Create account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/school/roles">Select role</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={`/school/dashboard/${role.id}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex size-11 items-center justify-center rounded-2xl ${role.tone}`}>
                <role.icon className="size-5" />
              </div>
              <div>
                <p className="font-black">{role.title}</p>
                <p className="text-sm text-slate-500">{role.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>
    </SchoolShell>
  );
}
