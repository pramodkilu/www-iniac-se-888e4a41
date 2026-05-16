import { FormEvent, useState } from "react";
import { CalendarPlus, UserPlus } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { KpiGrid } from "@/components/school/SchoolCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";

export default function EnrollmentsSessions() {
  const {
    students,
    batches,
    enrollments,
    sessions,
    batchMap,
    addEnrollment,
    addSession,
  } = useSchoolOperations();

  const [studentId, setStudentId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [sessionBatchId, setSessionBatchId] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [objective, setObjective] = useState("");

  const enrollStudent = async (event: FormEvent) => {
    event.preventDefault();
    if (!studentId || !batchId) return;
    await addEnrollment({ student_id: studentId, batch_id: batchId, status: "active" });
    setStudentId("");
    setBatchId("");
  };

  const createSession = async (event: FormEvent) => {
    event.preventDefault();
    if (!sessionBatchId || !sessionTitle.trim() || !startsAt) return;
    await addSession({
      batch_id: sessionBatchId,
      title: sessionTitle,
      starts_at: new Date(startsAt).toISOString(),
      objective,
      status: "scheduled",
    });
    setSessionTitle("");
    setStartsAt("");
    setObjective("");
  };

  return (
    <SchoolShell
      title="Enrollments & Sessions"
      description="Connect students to batches and create sessions that attendance can use."
    >
      <div className="space-y-6">
        <KpiGrid
          kpis={[
            { label: "Students", value: String(students.length), detail: "available", tone: "bg-blue-50 text-blue-700" },
            { label: "Batches", value: String(batches.length), detail: "active groups", tone: "bg-violet-50 text-violet-700" },
            { label: "Enrollments", value: String(enrollments.length), detail: "saved links", tone: "bg-emerald-50 text-emerald-700" },
            { label: "Sessions", value: String(sessions.length), detail: "scheduled", tone: "bg-orange-50 text-orange-700" },
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="size-5 text-violet-700" />
                Enroll student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={enrollStudent} className="grid gap-3">
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>{student.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-violet-700 hover:bg-violet-800">Enroll</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarPlus className="size-5 text-violet-700" />
                Create session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createSession} className="grid gap-3">
                <Select value={sessionBatchId} onValueChange={setSessionBatchId}>
                  <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} placeholder="Session title" />
                <Input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} type="datetime-local" />
                <Input value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Objective" />
                <Button className="bg-violet-700 hover:bg-violet-800">Create session</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Enrollments</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Batch</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {enrollments.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-slate-500">No saved enrollments yet.</TableCell></TableRow>
                  ) : enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-bold">{students.find((student) => student.id === enrollment.student_id)?.full_name ?? "-"}</TableCell>
                      <TableCell>{batchMap.get(enrollment.batch_id)?.name ?? "-"}</TableCell>
                      <TableCell>{enrollment.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Sessions</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Batch</TableHead><TableHead>Starts</TableHead></TableRow></TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-bold">{session.title}</TableCell>
                      <TableCell>{batchMap.get(session.batch_id)?.name ?? "-"}</TableCell>
                      <TableCell>{new Date(session.starts_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </SchoolShell>
  );
}
