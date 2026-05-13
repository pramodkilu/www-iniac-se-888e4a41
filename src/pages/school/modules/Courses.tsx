import { FormEvent, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { ProgressCard } from "@/components/school/SchoolCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";
import { useSchoolModules } from "@/hooks/useSchoolModules";

export default function Courses() {
  const { programs, programMap } = useSchoolOperations();
  const { courses, addCourse } = useSchoolModules();
  const [programId, setProgramId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await addCourse({ program_id: programId || null, title, description, status: "active", progress_percent: 0 });
    setTitle("");
    setDescription("");
  };

  return (
    <SchoolShell title="LMS / Courses" description="Create learning modules for AI, robotics, cricket, and project-based activities.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">{courses.slice(0, 3).map((course) => <ProgressCard key={course.id} title={course.title} value={course.progress_percent} description={course.description ?? "Course module"} />)}</div>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpenCheck className="size-5 text-violet-700" />Add course module</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
              <Select value={programId} onValueChange={setProgramId}><SelectTrigger><SelectValue placeholder="Program" /></SelectTrigger><SelectContent>{programs.map((program) => <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>)}</SelectContent></Select>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Module title" />
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
              <Button className="bg-violet-700 hover:bg-violet-800">Add module</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle>Course modules</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Program</TableHead><TableHead>Progress</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{courses.map((course) => <TableRow key={course.id}><TableCell className="font-bold">{course.title}</TableCell><TableCell>{course.program_id ? programMap.get(course.program_id)?.name ?? "-" : "-"}</TableCell><TableCell>{course.progress_percent}%</TableCell><TableCell>{course.status}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </SchoolShell>
  );
}
