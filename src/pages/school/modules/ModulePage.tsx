import { Navigate, useParams } from "react-router-dom";
import {
  Banknote,
  BookOpenCheck,
  CalendarDays,
  Library,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import { KpiGrid, ProgressCard } from "@/components/school/SchoolCards";
import { ModuleTable } from "@/components/school/ModuleTable";
import { SchoolShell } from "@/components/school/SchoolShell";
import { moduleRows } from "@/data/mockSchoolData";

const moduleConfig = {
  attendance: {
    title: "Attendance Management",
    description: "Mark session attendance, review absence notes, and monitor attendance trends.",
    icon: CalendarDays,
    columns: ["Batch", "Students", "Today", "Rate"],
    progress: ["Attendance completion", 87, "Three batches submitted attendance today."],
  },
  payments: {
    title: "Payments & Invoices",
    description: "Track invoices, parent balances, Swish/manual payment status, and future Stripe flows.",
    icon: Banknote,
    columns: ["Student", "Program", "Amount", "Status"],
    progress: ["Collection progress", 91, "Future module: Stripe, Swish notes, reminders, receipts."],
  },
  courses: {
    title: "LMS / Courses",
    description: "Manage AI, robotics, cricket, lessons, activities, assessments, and project submissions.",
    icon: BookOpenCheck,
    columns: ["Course", "Content", "Progress", "Status"],
    progress: ["Curriculum readiness", 72, "Robotics and AI modules are ready for teacher review."],
  },
  messages: {
    title: "Communication / Messages",
    description: "Send parent updates, attendance alerts, event reminders, and teacher notes.",
    icon: MessageSquareText,
    columns: ["Sender", "Subject", "Status", "Date"],
    progress: ["Read rate", 84, "Parent communication module supports targeted updates."],
  },
  calendar: {
    title: "Events & Calendar",
    description: "Plan sessions, competitions, parent meetings, and school-wide events.",
    icon: CalendarDays,
    columns: ["Event", "Day", "Time", "Location"],
    progress: ["Calendar coverage", 78, "Upcoming sessions and events are visible to all roles."],
  },
  timetable: {
    title: "Timetable / Schedule",
    description: "Coordinate recurring lessons, teachers, rooms, and batch schedules.",
    icon: UsersRound,
    columns: ["Day", "Session", "Time", "Teacher"],
    progress: ["Schedule utilization", 82, "Room and teacher capacity can be added next."],
  },
  library: {
    title: "Library / Resources",
    description: "Organize guides, worksheets, build checklists, and student resources.",
    icon: Library,
    columns: ["Resource", "Type", "Level", "Status"],
    progress: ["Published resources", 68, "Add files, tags, and lesson linking later."],
  },
};

export function SchoolModulePage({ fixedModuleId }: { fixedModuleId?: keyof typeof moduleConfig }) {
  const params = useParams();
  const moduleId = fixedModuleId ?? params.moduleId;
  const config = moduleConfig[moduleId as keyof typeof moduleConfig];

  if (!moduleId || !config) {
    return <Navigate to="/school" replace />;
  }

  const Icon = config.icon;

  return (
    <SchoolShell title={config.title} description={config.description}>
      <div className="space-y-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Icon className="size-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black">{config.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{config.description}</p>
        </div>
        <KpiGrid
          kpis={[
            { label: "Open items", value: "24", detail: "needs attention", tone: "bg-violet-50 text-violet-700" },
            { label: "Completed", value: "87%", detail: "this week", tone: "bg-emerald-50 text-emerald-700" },
            { label: "Users", value: "428", detail: "connected", tone: "bg-blue-50 text-blue-700" },
            { label: "Alerts", value: "5", detail: "requires follow-up", tone: "bg-orange-50 text-orange-700" },
          ]}
        />
        <ProgressCard title={config.progress[0] as string} value={config.progress[1] as number} description={config.progress[2] as string} />
        <ModuleTable title={`${config.title} table`} columns={config.columns} rows={moduleRows[moduleId as keyof typeof moduleRows]} />
      </div>
    </SchoolShell>
  );
}

export default SchoolModulePage;
