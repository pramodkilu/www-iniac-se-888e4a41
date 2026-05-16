import { FormEvent, useState } from "react";
import { AlertCircle, UserPlus } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { KpiGrid } from "@/components/school/SchoolCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";

export default function Students() {
  const { students, defaultSchoolId, addStudent, usingMockFallback, loading } = useSchoolOperations();
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim()) return;
    await addStudent({
      school_id: defaultSchoolId,
      full_name: fullName,
      grade,
      guardian_name: guardianName,
      guardian_email: guardianEmail,
    });
    setFullName("");
    setGrade("");
    setGuardianName("");
    setGuardianEmail("");
  };

  return (
    <SchoolShell
      title="Students"
      description="Create and manage student records for the school operations flow."
    >
      <div className="space-y-6">
        {usingMockFallback ? (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            <AlertCircle className="size-5" />
            Supabase school tables are not populated yet. This page is showing mock fallback data.
          </div>
        ) : null}

        <KpiGrid
          kpis={[
            { label: "Students", value: String(students.length), detail: "active records", tone: "bg-blue-50 text-blue-700" },
            { label: "Guardians", value: String(students.filter((s) => s.guardian_email).length), detail: "with contact email", tone: "bg-violet-50 text-violet-700" },
            { label: "Grades", value: String(new Set(students.map((s) => s.grade).filter(Boolean)).size), detail: "represented", tone: "bg-emerald-50 text-emerald-700" },
            { label: "Status", value: loading ? "..." : "Ready", detail: "student module", tone: "bg-orange-50 text-orange-700" },
          ]}
        />

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-violet-700" />
              Add student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
              <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade" />
              <Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Guardian name" />
              <Input value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} placeholder="Guardian email" type="email" />
              <Button className="bg-violet-700 hover:bg-violet-800">Add student</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Student directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-bold">{student.full_name}</TableCell>
                      <TableCell>{student.grade ?? "-"}</TableCell>
                      <TableCell>{student.guardian_name ?? "-"}</TableCell>
                      <TableCell>{student.guardian_email ?? "-"}</TableCell>
                      <TableCell>{student.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SchoolShell>
  );
}
