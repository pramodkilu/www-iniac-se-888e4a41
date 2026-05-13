import { FormEvent, useState } from "react";
import { Library as LibraryIcon } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";
import { useSchoolModules } from "@/hooks/useSchoolModules";

export default function Library() {
  const { programs, defaultSchoolId, programMap } = useSchoolOperations();
  const { resources, addResource } = useSchoolModules(defaultSchoolId);
  const [programId, setProgramId] = useState("");
  const [title, setTitle] = useState("");
  const [resourceType, setResourceType] = useState("guide");
  const [level, setLevel] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await addResource({ school_id: defaultSchoolId, program_id: programId || null, title, resource_type: resourceType, level, status: "published" });
    setTitle("");
    setLevel("");
  };

  return (
    <SchoolShell title="Library / Resources" description="Publish worksheets, build sheets, guides, links, and course resources.">
      <div className="space-y-6">
        <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><LibraryIcon className="size-5 text-violet-700" />Add resource</CardTitle></CardHeader><CardContent><form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-5"><Select value={programId} onValueChange={setProgramId}><SelectTrigger><SelectValue placeholder="Program" /></SelectTrigger><SelectContent>{programs.map((program) => <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>)}</SelectContent></Select><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" /><Input value={resourceType} onChange={(e) => setResourceType(e.target.value)} placeholder="Type" /><Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Level" /><Button className="bg-violet-700 hover:bg-violet-800">Publish</Button></form></CardContent></Card>
        <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle>Resources</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Program</TableHead><TableHead>Type</TableHead><TableHead>Level</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{resources.map((resource) => <TableRow key={resource.id}><TableCell className="font-bold">{resource.title}</TableCell><TableCell>{resource.program_id ? programMap.get(resource.program_id)?.name ?? "-" : "-"}</TableCell><TableCell>{resource.resource_type}</TableCell><TableCell>{resource.level ?? "-"}</TableCell><TableCell>{resource.status}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </SchoolShell>
  );
}
