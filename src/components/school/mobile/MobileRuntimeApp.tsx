import { useMemo, useState } from "react";
import {
  Award,
  Banknote,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Home,
  LucideIcon,
  MessageSquareText,
  Play,
  Send,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSchoolModules } from "@/hooks/useSchoolModules";
import { useSchoolOperations, type Student } from "@/hooks/useSchoolOperations";
import { type MobileFlowKey } from "@/data/mobileSchoolData";

type MobileTab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const currency = (amountCents: number, currencyCode = "SEK") =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);

const formatDateTime = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "Not scheduled";

function StatusPill({ children, tone = "blue" }: { children: string; tone?: "blue" | "green" | "orange" | "slate" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    orange: "bg-orange-50 text-orange-700 ring-orange-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${tones[tone]}`}>{children}</span>;
}

function AppMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-base font-black text-slate-950">{value}</p>
    </div>
  );
}

function AppRow({
  title,
  meta,
  status,
  tone = "blue",
  action,
}: {
  title: string;
  meta: string;
  status?: string;
  tone?: "blue" | "green" | "orange" | "slate";
  action?: () => void;
}) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-2xl bg-white p-3 text-left shadow-sm transition hover:bg-violet-50"
      type="button"
      onClick={action}
    >
      <div>
        <p className="text-sm font-black text-slate-950">{title}</p>
        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{meta}</p>
      </div>
      {status ? <StatusPill tone={tone}>{status}</StatusPill> : null}
    </button>
  );
}

function MobileChrome({
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
  onBack,
  onBell,
}: {
  title: string;
  tabs: MobileTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  onBack?: () => void;
  onBell?: () => void;
}) {
  return (
    <article className="mx-auto w-full max-w-[390px] rounded-[34px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80">
      <div className="flex min-h-[720px] flex-col overflow-hidden rounded-[27px] bg-[#f7f8fc]">
        <div className="flex items-center justify-between px-5 pb-3 pt-4 text-[11px] font-black text-slate-900">
          <span>9:41</span>
          <div className="h-5 w-20 rounded-full bg-slate-950" />
          <span>5G</span>
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <button
            className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-violet-50 hover:text-violet-700"
            type="button"
            onClick={onBack}
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="text-xs font-black text-slate-700">{title}</p>
          <button
            className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-violet-50 hover:text-violet-700"
            type="button"
            onClick={onBell}
          >
            <Bell className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">{children}</div>

        <nav className="grid border-t border-slate-200 bg-white px-2 py-2 text-center" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`rounded-2xl px-1 py-2 text-[10px] font-black ${
                tab.id === activeTab ? "bg-violet-50 text-violet-700" : "text-slate-500"
              }`}
              type="button"
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon className="mx-auto mb-1 size-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </article>
  );
}

function HeroCard({
  eyebrow,
  title,
  label,
  value,
  progress,
}: {
  eyebrow: string;
  title: string;
  label: string;
  value: string;
  progress?: number;
}) {
  return (
    <div className="rounded-[24px] bg-gradient-to-br from-violet-700 to-blue-600 p-5 text-white shadow-lg shadow-violet-200">
      <p className="text-xs font-bold opacity-80">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black leading-tight">{title}</h2>
      <div className="mt-5 rounded-2xl bg-white/15 p-3 backdrop-blur">
        <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">{label}</p>
        <p className="mt-1 text-xl font-black">{value}</p>
        {typeof progress === "number" ? <Progress value={progress} className="mt-3 h-2 bg-white/20 [&>div]:bg-white" /> : null}
      </div>
    </div>
  );
}

function ParentApp({
  student,
  defaultSchoolId,
}: {
  student: Student;
  defaultSchoolId?: string | null;
}) {
  const [tab, setTab] = useState("home");
  const [paidInvoiceIds, setPaidInvoiceIds] = useState<string[]>([]);
  const [readMessageIds, setReadMessageIds] = useState<string[]>([]);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const { invoices, messages, events, addMessage } = useSchoolModules(defaultSchoolId);
  const studentInvoices = invoices.filter((invoice) => !invoice.student_id || invoice.student_id === student.id);
  const outstanding = studentInvoices
    .filter((invoice) => invoice.status !== "paid" && !paidInvoiceIds.includes(invoice.id))
    .reduce((total, invoice) => total + invoice.amount_cents, 0);
  const latestMessage = messages[0];

  const tabs: MobileTab[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "attendance", label: "Attend", icon: CalendarDays },
    { id: "payments", label: "Pay", icon: Banknote },
    { id: "messages", label: "Chat", icon: MessageSquareText },
    { id: "profile", label: "Profile", icon: UserRound },
  ];

  const sendQuickMessage = () => {
    addMessage({
      school_id: defaultSchoolId ?? null,
      student_id: student.id,
      recipient_email: student.guardian_email,
      subject: "Parent question",
      body: "Thanks for the update. Please send more details after the next session.",
      status: "draft",
    });
    toast.success("Quick reply queued");
  };

  const payInvoice = (invoiceId: string, title: string) => {
    setPaidInvoiceIds((ids) => (ids.includes(invoiceId) ? ids : [...ids, invoiceId]));
    toast.success(`${title} marked paid in mobile preview`);
  };

  const markMessageRead = (messageId: string) => {
    setReadMessageIds((ids) => (ids.includes(messageId) ? ids : [...ids, messageId]));
  };

  const openNotifications = () => {
    setTab("messages");
    toast.info("Opened parent messages");
  };

  return (
    <MobileChrome
      title="Parent App"
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      onBack={() => setTab("home")}
      onBell={openNotifications}
    >
      {tab === "home" ? (
        <div className="space-y-4">
          <HeroCard eyebrow={`Hello, ${student.guardian_name ?? "Parent"}`} title={student.full_name} label="This week" value="2 / 2 sessions" progress={88} />
          <div className="grid grid-cols-3 gap-2">
            <AppMetric label="Attendance" value="88%" />
            <AppMetric label="Progress" value="72%" />
            <AppMetric label="Balance" value={currency(outstanding)} />
          </div>
          <AppRow
            title={latestMessage?.subject ?? "AI project completed"}
            meta={latestMessage?.body ?? "Aarav completed today's activity."}
            status={latestMessage && readMessageIds.includes(latestMessage.id) ? "Read" : "Update"}
            tone="green"
            action={() => latestMessage && markMessageRead(latestMessage.id)}
          />
          {events.slice(0, 2).map((event) => (
            <AppRow
              key={event.id}
              title={event.title}
              meta={`${formatDateTime(event.starts_at)} · ${event.location ?? "Campus"}`}
              status="Event"
              action={() => toast.info(`${event.title} added to family calendar`)}
            />
          ))}
        </div>
      ) : null}

      {tab === "attendance" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="May 2026" title="Attendance calendar" label="Monthly attendance" value="18 present" progress={90} />
          <div className="grid grid-cols-3 gap-2">
            <AppMetric label="Present" value="18" />
            <AppMetric label="Absent" value="2" />
            <AppMetric label="Late" value="1" />
          </div>
          {["Robotics Basics", "AI Explorers", "Build Lab"].map((item, index) => (
            <AppRow key={item} title={item} meta={index === 2 ? "May 03" : "May 12"} status={index === 2 ? "Absent" : "Present"} tone={index === 2 ? "orange" : "green"} />
          ))}
        </div>
      ) : null}

      {tab === "payments" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Invoices" title="Fees & payments" label="Current balance" value={currency(outstanding)} progress={outstanding > 0 ? 55 : 100} />
          {studentInvoices.map((invoice) => (
            <AppRow
              key={invoice.id}
              title={invoice.title}
              meta={`${invoice.invoice_number} · due ${invoice.due_date ?? "soon"}`}
              status={invoice.status === "paid" || paidInvoiceIds.includes(invoice.id) ? "Paid" : "Pay"}
              tone={invoice.status === "paid" || paidInvoiceIds.includes(invoice.id) ? "green" : "orange"}
              action={() => payInvoice(invoice.id, invoice.title)}
            />
          ))}
        </div>
      ) : null}

      {tab === "messages" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Communication" title="Teacher messages" label="Unread" value="2 messages" />
          {messages.map((message) => (
            <AppRow
              key={message.id}
              title={message.subject}
              meta={message.body}
              status={readMessageIds.includes(message.id) ? "read" : message.status}
              tone={readMessageIds.includes(message.id) || message.status === "sent" ? "green" : "blue"}
              action={() => markMessageRead(message.id)}
            />
          ))}
          <Button className="w-full bg-violet-700 hover:bg-violet-800" onClick={sendQuickMessage}>
            <Send className="mr-2 size-4" />
            Send quick reply
          </Button>
        </div>
      ) : null}

      {tab === "profile" ? (
        <div className="space-y-4">
          <HeroCard eyebrow="Linked child" title={student.full_name} label="Guardian" value={student.guardian_name ?? "Parent"} />
          <AppRow title="Grade" meta={student.grade ?? "Not set"} status="Active" tone="green" />
          <AppRow title="Guardian email" meta={student.guardian_email ?? "No email"} status="Verified" action={() => toast.info("Email preferences opened")} />
          <AppRow
            title="Notification settings"
            meta="Attendance, payments, and teacher updates"
            status={notificationsOn ? "On" : "Off"}
            tone={notificationsOn ? "green" : "slate"}
            action={() => setNotificationsOn((value) => !value)}
          />
        </div>
      ) : null}
    </MobileChrome>
  );
}

function StudentApp({ student, defaultSchoolId }: { student: Student; defaultSchoolId?: string | null }) {
  const [tab, setTab] = useState("home");
  const [progressBoost, setProgressBoost] = useState(0);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [earnedBadges, setEarnedBadges] = useState(["AI Explorer", "Fast Builder", "Problem Solver"]);
  const { courses } = useSchoolModules(defaultSchoolId);
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

function StaffApp({ defaultSchoolId }: { defaultSchoolId?: string | null }) {
  const [tab, setTab] = useState("today");
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});
  const { students, sessions, markAttendance } = useSchoolOperations();
  const { invoices, messages, events } = useSchoolModules(defaultSchoolId);
  const activeSession = sessions[0];

  const tabs: MobileTab[] = [
    { id: "today", label: "Today", icon: CalendarDays },
    { id: "attend", label: "Attend", icon: CheckCircle2 },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <MobileChrome
      title="Staff App"
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      onBack={() => setTab("today")}
      onBell={() => setTab("alerts")}
    >
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

function RoboticsApp() {
  const [tab, setTab] = useState("story");
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

export function MobileRuntimeApp({ flow }: { flow: MobileFlowKey }) {
  const { students, defaultSchoolId } = useSchoolOperations();
  const student = useMemo(() => students[0], [students]);

  if (flow === "robotics") return <RoboticsApp />;
  if (flow === "staff") return <StaffApp defaultSchoolId={defaultSchoolId} />;
  if (!student) return null;
  if (flow === "student") return <StudentApp student={student} defaultSchoolId={defaultSchoolId} />;
  return <ParentApp student={student} defaultSchoolId={defaultSchoolId} />;
}
