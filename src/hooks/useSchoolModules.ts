import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

export type Invoice = Tables<"invoices">;
export type ParentMessage = Tables<"parent_messages">;
export type CourseModule = Tables<"course_modules">;
export type SchoolEvent = Tables<"school_events">;
export type LibraryResource = Tables<"library_resources">;

const now = new Date().toISOString();

const mockInvoices: Invoice[] = [
  {
    id: "mock-invoice-1",
    school_id: "mock-school",
    student_id: "mock-student-aarav",
    invoice_number: "INV-2026-001",
    title: "Robotics Basics - May",
    amount_cents: 120000,
    currency: "SEK",
    status: "paid",
    due_date: "2026-05-30",
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-invoice-2",
    school_id: "mock-school",
    student_id: "mock-student-maja",
    invoice_number: "INV-2026-002",
    title: "AI Explorers - May",
    amount_cents: 145000,
    currency: "SEK",
    status: "pending",
    due_date: "2026-05-30",
    created_at: now,
    updated_at: now,
  },
];

const mockMessages: ParentMessage[] = [
  {
    id: "mock-message-1",
    school_id: "mock-school",
    student_id: "mock-student-aarav",
    sender_id: null,
    recipient_email: "priya@example.com",
    subject: "AI project completed",
    body: "Aarav completed the image recognition activity today.",
    status: "sent",
    read_at: null,
    created_at: now,
    updated_at: now,
  },
];

const mockCourses: CourseModule[] = [
  {
    id: "mock-course-1",
    program_id: "mock-program-ai",
    title: "AI Basics",
    description: "Image recognition, data, and model confidence.",
    progress_percent: 72,
    status: "active",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-course-2",
    program_id: "mock-program-robotics",
    title: "Robotics Build",
    description: "Build, test, and simulate a classroom robot.",
    progress_percent: 64,
    status: "active",
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
];

const mockEvents: SchoolEvent[] = [
  {
    id: "mock-event-1",
    school_id: "mock-school",
    title: "Robotics Basics",
    event_type: "session",
    starts_at: now,
    ends_at: null,
    location: "Room A",
    audience: "students",
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-event-2",
    school_id: "mock-school",
    title: "Robotics Competition",
    event_type: "competition",
    starts_at: "2026-05-20T14:00:00.000Z",
    ends_at: null,
    location: "Campus Hall",
    audience: "all",
    created_at: now,
    updated_at: now,
  },
];

const mockResources: LibraryResource[] = [
  {
    id: "mock-resource-1",
    school_id: "mock-school",
    program_id: "mock-program-robotics",
    title: "Robot Build Sheet",
    resource_type: "checklist",
    level: "Grade 3-5",
    url: null,
    status: "published",
    created_at: now,
    updated_at: now,
  },
];

export function useSchoolModules(
  defaultSchoolId?: string | null,
  options: { previewOnly?: boolean } = {},
) {
  const previewOnly = options.previewOnly ?? false;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [usingMockFallback, setUsingMockFallback] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [courses, setCourses] = useState<CourseModule[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (previewOnly) {
      setUsingMockFallback(true);
      setInvoices(mockInvoices);
      setMessages(mockMessages);
      setCourses(mockCourses);
      setEvents(mockEvents);
      setResources(mockResources);
      setLoading(false);
      return;
    }

    const [invoiceRes, messageRes, courseRes, eventRes, resourceRes] = await Promise.all([
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("parent_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("course_modules").select("*").order("sort_order", { ascending: true }),
      supabase.from("school_events").select("*").order("starts_at", { ascending: true }),
      supabase.from("library_resources").select("*").order("created_at", { ascending: false }),
    ]);

    if (invoiceRes.error || messageRes.error || courseRes.error || eventRes.error || resourceRes.error) {
      setError(
        invoiceRes.error?.message ||
          messageRes.error?.message ||
          courseRes.error?.message ||
          eventRes.error?.message ||
          resourceRes.error?.message ||
          "Unable to load school module data.",
      );
      setUsingMockFallback(true);
      setInvoices(mockInvoices);
      setMessages(mockMessages);
      setCourses(mockCourses);
      setEvents(mockEvents);
      setResources(mockResources);
      setLoading(false);
      return;
    }

    const noData =
      (invoiceRes.data?.length ?? 0) === 0 &&
      (messageRes.data?.length ?? 0) === 0 &&
      (courseRes.data?.length ?? 0) === 0 &&
      (eventRes.data?.length ?? 0) === 0 &&
      (resourceRes.data?.length ?? 0) === 0;

    setUsingMockFallback(noData);
    setInvoices(invoiceRes.data?.length ? invoiceRes.data : mockInvoices);
    setMessages(messageRes.data?.length ? messageRes.data : mockMessages);
    setCourses(courseRes.data?.length ? courseRes.data : mockCourses);
    setEvents(eventRes.data?.length ? eventRes.data : mockEvents);
    setResources(resourceRes.data?.length ? resourceRes.data : mockResources);
    setLoading(false);
  }, [previewOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const insertOrPreview = async <T,>(label: string, action: () => Promise<{ error: { message: string } | null }>) => {
    if (usingMockFallback) {
      toast.info(`Apply Supabase migrations to save ${label}. Showing preview data for now.`);
      return;
    }
    const { error } = await action();
    if (error) {
      setError(error.message);
      toast.error(error.message);
    }
    else {
      toast.success(`${label} saved`);
      load();
    }
  };

  const addInvoice = (invoice: TablesInsert<"invoices">) =>
    insertOrPreview("invoice", () => supabase.from("invoices").insert(invoice));

  const addMessage = (message: Omit<TablesInsert<"parent_messages">, "sender_id">) =>
    insertOrPreview("message", () =>
      supabase.from("parent_messages").insert({
        ...message,
        school_id: message.school_id ?? defaultSchoolId ?? null,
        sender_id: user?.id ?? null,
      }),
    );

  const addCourse = (course: TablesInsert<"course_modules">) =>
    insertOrPreview("course module", () => supabase.from("course_modules").insert(course));

  const addEvent = (event: TablesInsert<"school_events">) =>
    insertOrPreview("event", () => supabase.from("school_events").insert(event));

  const addResource = (resource: TablesInsert<"library_resources">) =>
    insertOrPreview("resource", () => supabase.from("library_resources").insert(resource));

  return {
    loading,
    error,
    usingMockFallback,
    invoices,
    messages,
    courses,
    events,
    resources,
    addInvoice,
    addMessage,
    addCourse,
    addEvent,
    addResource,
    reload: load,
  };
}
