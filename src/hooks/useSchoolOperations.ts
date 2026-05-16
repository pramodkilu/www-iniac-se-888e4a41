import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

export type School = Tables<"schools">;
export type Program = Tables<"programs">;
export type Batch = Tables<"batches">;
export type Student = Tables<"students">;
export type Enrollment = Tables<"enrollments">;
export type Session = Tables<"sessions">;
export type AttendanceRecord = Tables<"attendance_records">;

const mockSchool: School = {
  id: "mock-school",
  name: "Stockholm Campus",
  slug: "stockholm-campus",
  city: "Stockholm",
  status: "active",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockPrograms: Program[] = [
  {
    id: "mock-program-robotics",
    school_id: mockSchool.id,
    name: "Robotics Basics",
    description: "Hands-on robotics and sensor learning.",
    category: "robotics",
    age_range: "Grade 3-5",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-program-ai",
    school_id: mockSchool.id,
    name: "AI Explorers",
    description: "Image recognition, data, and responsible AI.",
    category: "ai",
    age_range: "Grade 6-8",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockBatches: Batch[] = [
  {
    id: "mock-batch-robotics",
    school_id: mockSchool.id,
    program_id: "mock-program-robotics",
    teacher_id: null,
    name: "Robotics G3-5",
    grade_range: "Grade 3-5",
    schedule: "Tue, Thu - 16:00",
    capacity: 24,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockStudents: Student[] = [
  {
    id: "mock-student-aarav",
    school_id: mockSchool.id,
    full_name: "Aarav Sharma",
    grade: "Grade 4",
    date_of_birth: null,
    guardian_name: "Priya Sharma",
    guardian_email: "priya@example.com",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-student-maja",
    school_id: mockSchool.id,
    full_name: "Maja Lind",
    grade: "Grade 5",
    date_of_birth: null,
    guardian_name: "Erik Lind",
    guardian_email: "erik@example.com",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockSessions: Session[] = [
  {
    id: "mock-session-robotics",
    batch_id: "mock-batch-robotics",
    teacher_id: null,
    title: "AI Basics - Image Recognition",
    starts_at: new Date().toISOString(),
    ends_at: null,
    objective: "Students understand how computers recognize images.",
    status: "scheduled",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useSchoolOperations(options: { previewOnly?: boolean } = {}) {
  const previewOnly = options.previewOnly ?? false;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [usingMockFallback, setUsingMockFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (previewOnly) {
      setUsingMockFallback(true);
      setSchools([mockSchool]);
      setPrograms(mockPrograms);
      setBatches(mockBatches);
      setStudents(mockStudents);
      setEnrollments([]);
      setSessions(mockSessions);
      setAttendance([]);
      setLoading(false);
      return;
    }

    const [schoolRes, programRes, batchRes, studentRes, enrollmentRes, sessionRes, attendanceRes] =
      await Promise.all([
        supabase.from("schools").select("*").order("created_at", { ascending: true }),
        supabase.from("programs").select("*").order("created_at", { ascending: true }),
        supabase.from("batches").select("*").order("created_at", { ascending: true }),
        supabase.from("students").select("*").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*").order("enrolled_at", { ascending: false }),
        supabase.from("sessions").select("*").order("starts_at", { ascending: true }),
        supabase.from("attendance_records").select("*").order("created_at", { ascending: false }),
      ]);

    const hasSchemaError =
      schoolRes.error ||
      programRes.error ||
      batchRes.error ||
      studentRes.error ||
      enrollmentRes.error ||
      sessionRes.error ||
      attendanceRes.error;

    if (hasSchemaError) {
      const message =
        schoolRes.error?.message ||
        programRes.error?.message ||
        batchRes.error?.message ||
        studentRes.error?.message ||
        enrollmentRes.error?.message ||
        sessionRes.error?.message ||
        attendanceRes.error?.message ||
        "Unable to load school operations data.";
      setError(message);
      setUsingMockFallback(true);
      setSchools([mockSchool]);
      setPrograms(mockPrograms);
      setBatches(mockBatches);
      setStudents(mockStudents);
      setEnrollments([]);
      setSessions(mockSessions);
      setAttendance([]);
      setLoading(false);
      return;
    }

    const nextSchools = schoolRes.data ?? [];
    const nextPrograms = programRes.data ?? [];
    const nextBatches = batchRes.data ?? [];
    const nextStudents = studentRes.data ?? [];
    const nextSessions = sessionRes.data ?? [];

    setUsingMockFallback(
      nextSchools.length === 0 &&
        nextPrograms.length === 0 &&
        nextBatches.length === 0 &&
        nextStudents.length === 0,
    );
    setSchools(nextSchools.length > 0 ? nextSchools : [mockSchool]);
    setPrograms(nextPrograms.length > 0 ? nextPrograms : mockPrograms);
    setBatches(nextBatches.length > 0 ? nextBatches : mockBatches);
    setStudents(nextStudents.length > 0 ? nextStudents : mockStudents);
    setEnrollments(enrollmentRes.data ?? []);
    setSessions(nextSessions.length > 0 ? nextSessions : mockSessions);
    setAttendance(attendanceRes.data ?? []);
    setLoading(false);
  }, [previewOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const defaultSchoolId = schools[0]?.id ?? null;

  const programMap = useMemo(
    () => new Map(programs.map((program) => [program.id, program])),
    [programs],
  );

  const batchMap = useMemo(
    () => new Map(batches.map((batch) => [batch.id, batch])),
    [batches],
  );

  const addStudent = async (student: TablesInsert<"students">) => {
    if (usingMockFallback) {
      toast.info("Apply Supabase migrations to save students. Showing local preview data for now.");
      return;
    }
    const { error } = await supabase.from("students").insert(student);
    if (error) {
      setError(error.message);
      toast.error(error.message);
    }
    else {
      toast.success("Student added");
      load();
    }
  };

  const addProgram = async (program: TablesInsert<"programs">) => {
    if (usingMockFallback) {
      toast.info("Apply Supabase migrations to save programs. Showing local preview data for now.");
      return;
    }
    const { error } = await supabase.from("programs").insert(program);
    if (error) {
      setError(error.message);
      toast.error(error.message);
    }
    else {
      toast.success("Program added");
      load();
    }
  };

  const addBatch = async (batch: TablesInsert<"batches">) => {
    if (usingMockFallback) {
      toast.info("Apply Supabase migrations to save batches. Showing local preview data for now.");
      return;
    }
    const { error } = await supabase.from("batches").insert(batch);
    if (error) {
      setError(error.message);
      toast.error(error.message);
    }
    else {
      toast.success("Batch added");
      load();
    }
  };

  const addEnrollment = async (enrollment: TablesInsert<"enrollments">) => {
    if (usingMockFallback) {
      toast.info("Apply Supabase migrations to save enrollments. Showing local preview data for now.");
      return;
    }
    const { error } = await supabase.from("enrollments").insert(enrollment);
    if (error) {
      setError(error.message);
      toast.error(error.message);
    }
    else {
      toast.success("Student enrolled");
      load();
    }
  };

  const addSession = async (session: TablesInsert<"sessions">) => {
    if (usingMockFallback) {
      toast.info("Apply Supabase migrations to save sessions. Showing local preview data for now.");
      return;
    }
    const { error } = await supabase.from("sessions").insert(session);
    if (error) {
      setError(error.message);
      toast.error(error.message);
    }
    else {
      toast.success("Session created");
      load();
    }
  };

  const markAttendance = async (sessionId: string, studentId: string, status: string) => {
    if (usingMockFallback) {
      toast.info("Apply Supabase migrations to save attendance. Showing local preview data for now.");
      return;
    }
    const { error } = await supabase.from("attendance_records").upsert(
      {
        session_id: sessionId,
        student_id: studentId,
        status,
        marked_by: user?.id ?? null,
      },
      { onConflict: "session_id,student_id" },
    );
    if (error) {
      setError(error.message);
      toast.error(error.message);
    }
    else {
      toast.success("Attendance updated");
      load();
    }
  };

  return {
    loading,
    error,
    usingMockFallback,
    schools,
    programs,
    batches,
    students,
    enrollments,
    sessions,
    attendance,
    defaultSchoolId,
    programMap,
    batchMap,
    addStudent,
    addProgram,
    addBatch,
    addEnrollment,
    addSession,
    markAttendance,
    reload: load,
  };
}
