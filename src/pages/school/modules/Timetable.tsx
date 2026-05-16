import { CalendarClock } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";

export default function Timetable() {
  const { sessions, batchMap } = useSchoolOperations();
  return (
    <SchoolShell title="Timetable / Schedule" description="Session schedule generated from batches and session records.">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><CalendarClock className="size-5 text-violet-700" />Upcoming timetable</CardTitle></CardHeader>
        <CardContent><Table><TableHeader><TableRow><TableHead>Session</TableHead><TableHead>Batch</TableHead><TableHead>Starts</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{sessions.map((session) => <TableRow key={session.id}><TableCell className="font-bold">{session.title}</TableCell><TableCell>{batchMap.get(session.batch_id)?.name ?? "-"}</TableCell><TableCell>{new Date(session.starts_at).toLocaleString()}</TableCell><TableCell>{session.status}</TableCell></TableRow>)}</TableBody></Table></CardContent>
      </Card>
    </SchoolShell>
  );
}
