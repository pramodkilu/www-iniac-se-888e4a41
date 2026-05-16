import { useState } from "react";
import { Banknote, CalendarDays, Home, MessageSquareText, Send, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSchoolModules } from "@/hooks/useSchoolModules";
import { type Student } from "@/hooks/useSchoolOperations";
import { MobileChrome } from "@/components/school/mobile/runtime/MobileChrome";
import { AppMetric, AppRow, HeroCard, type MobileTab } from "@/components/school/mobile/runtime/MobilePrimitives";
import { currency, formatDateTime } from "@/components/school/mobile/runtime/mobileUtils";

export function ParentApp({
  student,
  defaultSchoolId,
  initialTab,
}: {
  student: Student;
  defaultSchoolId?: string | null;
  initialTab?: string;
}) {
  const validTabs = ["home", "attendance", "payments", "messages", "profile"];
  const [tab, setTab] = useState(validTabs.includes(initialTab ?? "") ? initialTab ?? "home" : "home");
  const [paidInvoiceIds, setPaidInvoiceIds] = useState<string[]>([]);
  const [readMessageIds, setReadMessageIds] = useState<string[]>([]);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const { invoices, messages, events, addMessage } = useSchoolModules(defaultSchoolId, { previewOnly: true });
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

  return (
    <MobileChrome
      title="Parent App"
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      onBack={() => setTab("home")}
      onBell={() => {
        setTab("messages");
        toast.info("Opened parent messages");
      }}
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
