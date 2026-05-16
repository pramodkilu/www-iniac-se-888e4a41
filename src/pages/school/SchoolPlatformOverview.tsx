import { Link } from "react-router-dom";
import {
  Banknote,
  BookOpenCheck,
  Bot,
  CalendarDays,
  CheckCircle2,
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
      title="A calmer way to run after-school learning"
      description="A modern school SaaS workspace for programs, families, attendance, payments, communication, and robotics learning."
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_430px] xl:items-stretch">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="size-4" />
            Parent-friendly operations
          </div>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            One quiet workspace for admins, teachers, parents, and students.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">
            Start with a guided role flow, then enter a focused dashboard for attendance, payments,
            courses, parent messages, events, reports, and robotics AI learning.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {["Fast attendance", "Clear invoices", "Warm parent updates"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                <CheckCircle2 className="size-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-full bg-slate-950 px-6 font-semibold hover:bg-slate-800">
              <Link to="/school/signup">Create account</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full border-slate-200 bg-white px-6 font-semibold">
              <Link to="/school/roles">Select role</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 rounded-[32px] border border-slate-200 bg-white/75 p-4 shadow-sm shadow-slate-200/70">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={`/school/dashboard/${role.id}`}
              className="flex items-center gap-4 rounded-[22px] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
            >
              <div className={`flex size-11 items-center justify-center rounded-[16px] ${role.tone}`}>
                <role.icon className="size-5" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">{role.title}</p>
                <p className="text-sm leading-5 text-slate-500">{role.description}</p>
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

      <div className="mt-8">
        <VisualFlowBoard />
      </div>
    </SchoolShell>
  );
}
