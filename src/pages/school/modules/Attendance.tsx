import { useMemo, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { KpiGrid } from "@/components/school/SchoolCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";

const statuses = ["present", "absent", "late", "excused"];

export default function Attendance() {
  const { sessions, students, attendance, batches, batchMap, markAttendance } = useSchoolOperations();
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id ?? "");
  const sessionId = selectedSessionId || sessions[0]?.id || "";
  const selectedSession = sessions.find((session) => session.id === sessionId);

  const attendanceMap = useMemo(
    () => new Map(attendance.filter((record) => record.session_id === sessionId).map((record) => [record.student_id, record])),
    [attendance, sessionId],
  );

  const presentCount = students.filter((student) => attendanceMap.get(student.id)?.status === "present").length;
  const markedCount = students.filter((student) => attendanceMap.has(student.id)).length;
  const batch = selectedSession ? batchMap.get(selectedSession.batch_id) : batches[0];

  return (
    <SchoolShell
      title="Attendance Management"
      description="Mark present, absent, late, and excused states for a selected session."
    >
      <div className="space-y-6">
        <KpiGrid
          kpis={[
            { label: "Session", value: selectedSession ? "1" : "0", detail: selectedSession?.title ?? "No session selected", tone: "bg-violet-50 text-violet-700" },
            { label: "Students", value: String(students.length), detail: "in attendance list", tone: "bg-blue-50 text-blue-700" },
            { label: "Marked", value: String(markedCount), detail: "attendance records", tone: "bg-emerald-50 text-emerald-700" },
            { label: "Present", value: String(presentCount), detail: "currently present", tone: "bg-orange-50 text-orange-700" },
          ]}
        />

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="size-5 text-violet-700" />
              Session
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <Select value={sessionId} onValueChange={setSelectedSessionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              {batch?.name ?? "No batch"} · {selectedSession ? new Date(selectedSession.starts_at).toLocaleString() : "-"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Mark attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Current status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const record = attendanceMap.get(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-bold">{student.full_name}</TableCell>
                        <TableCell>{student.grade ?? "-"}</TableCell>
                        <TableCell className="capitalize">{record?.status ?? "unmarked"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap justify-end gap-2">
                            {statuses.map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={record?.status === status ? "default" : "outline"}
                                className={record?.status === status ? "bg-violet-700 hover:bg-violet-800" : ""}
                                onClick={() => markAttendance(sessionId, student.id, status)}
                                disabled={!sessionId}
                              >
                                {status}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SchoolShell>
  );
}
