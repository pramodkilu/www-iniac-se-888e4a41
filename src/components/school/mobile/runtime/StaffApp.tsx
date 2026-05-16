import { useState } from "react";
import { Bell, CalendarDays, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSchoolModules } from "@/hooks/useSchoolModules";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";
import { MobileChrome } from "@/components/school/mobile/runtime/MobileChrome";
import { AppRow, HeroCard, type MobileTab } from "@/components/school/mobile/runtime/MobilePrimitives";
import { formatDateTime } from "@/components/school/mobile/runtime/mobileUtils";

export function StaffApp({ defaultSchoolId, initialTab }: { defaultSchoolId?: string | null; initialTab?: string }) {
  const validTabs = ["today", "attend", "alerts", "admin"];
  const [tab, setTab] = useState(validTabs.includes(initialTab ?? "") ? initialTab ?? "today" : "today");
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});
  const { students, sessions, markAttendance } = useSchoolOperations({ previewOnly: true });
  const { invoices, messages, events } = useSchoolModules(defaultSchoolId, { previewOnly: true });
  const activeSession = sessions[0];

  const tabs: MobileTab[] = [
    { id: "today", label: "Today", icon: CalendarDays },
    { id: "attend", label: "Attend", icon: CheckCircle2 },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <MobileChrome title="Staff App" tabs={tabs} activeTab={tab} onTabChange={setTab} onBack={() => setTab("today")} onBell={() => setTab("alerts")}>
      {tab === "today" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Hello, Teacher" title="2 sessions today" label="Next class" value={activeSession?.title ?? "Robotics Basics"} progress={64} />
          {sessions.map((session) => (
            <AppRow key={session.id} title={session.title} meta={formatDateTime(session.starts_at)} status={session.status} action={() => setTab("attend")} />
          ))}
        </div>
      ) : null}

      {tab === "attend" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Attendance" title={activeSession?.title ?? "Current session"} label="Students" value={String(students.length)} />
          {students.map((student) => (
            <AppRow
              key={student.id}
              title={student.full_name}
              meta={student.grade ?? "Student"}
              status={attendanceStatus[student.id] ?? "Mark"}
              tone={attendanceStatus[student.id] === "present" ? "green" : "blue"}
              action={() => {
                setAttendanceStatus((current) => ({ ...current, [student.id]: "present" }));
                if (activeSession) markAttendance(activeSession.id, student.id, "present");
              }}
            />
          ))}
        </div>
      ) : null}

      {tab === "alerts" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Alerts" title="School pulse" label="Unread" value={String(messages.length)} />
          {messages.map((message) => (
            <AppRow key={message.id} title={message.subject} meta={message.recipient_email ?? "Parent"} status={message.status} />
          ))}
        </div>
      ) : null}

      {tab === "admin" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Admin" title="Stockholm Campus" label="Open invoices" value={String(invoices.filter((invoice) => invoice.status !== "paid").length)} progress={91} />
          <AppRow title="Students" meta={`${students.length} active learners`} status="Open" action={() => setTab("attend")} />
          <AppRow title="Events" meta={`${events.length} scheduled`} status="Plan" action={() => setTab("today")} />
          <AppRow title="Payments" meta={`${invoices.length} invoices`} status="Review" tone="orange" action={() => toast.info("Payment review opened")} />
        </div>
      ) : null}
    </MobileChrome>
  );
}
