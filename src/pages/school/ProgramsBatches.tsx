import { FormEvent, useState } from "react";
import { BookOpenCheck, Layers } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";

export default function ProgramsBatches() {
  const { programs, batches, defaultSchoolId, addProgram, addBatch, programMap } = useSchoolOperations();
  const [programName, setProgramName] = useState("");
  const [category, setCategory] = useState("robotics");
  const [ageRange, setAgeRange] = useState("");
  const [batchName, setBatchName] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [schedule, setSchedule] = useState("");

  const createProgram = async (event: FormEvent) => {
    event.preventDefault();
    if (!programName.trim()) return;
    await addProgram({
      school_id: defaultSchoolId,
      name: programName,
      category,
      age_range: ageRange,
      status: "active",
    });
    setProgramName("");
    setAgeRange("");
  };

  const createBatch = async (event: FormEvent) => {
    event.preventDefault();
    if (!batchName.trim() || !selectedProgramId) return;
    await addBatch({
      school_id: defaultSchoolId,
      program_id: selectedProgramId,
      name: batchName,
      schedule,
      capacity: 24,
      status: "active",
    });
    setBatchName("");
    setSchedule("");
  };

  return (
    <SchoolShell
      title="Programs & Batches"
      description="Create programs, organize batches, and prepare sessions for attendance."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenCheck className="size-5 text-violet-700" />
              Add program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createProgram} className="grid gap-3">
              <Input value={programName} onChange={(e) => setProgramName(e.target.value)} placeholder="Program name" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                <Input value={ageRange} onChange={(e) => setAgeRange(e.target.value)} placeholder="Age / grade range" />
              </div>
              <Button className="bg-violet-700 hover:bg-violet-800">Add program</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-5 text-violet-700" />
              Add batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createBatch} className="grid gap-3">
              <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={batchName} onChange={(e) => setBatchName(e.target.value)} placeholder="Batch name" />
                <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Schedule" />
              </div>
              <Button className="bg-violet-700 hover:bg-violet-800">Add batch</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-bold">{program.name}</TableCell>
                    <TableCell>{program.category}</TableCell>
                    <TableCell>{program.age_range ?? "-"}</TableCell>
                    <TableCell>{program.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-bold">{batch.name}</TableCell>
                    <TableCell>{batch.program_id ? programMap.get(batch.program_id)?.name ?? "-" : "-"}</TableCell>
                    <TableCell>{batch.schedule ?? "-"}</TableCell>
                    <TableCell>{batch.capacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SchoolShell>
  );
}
