import { FormEvent, useState } from "react";
import { CalendarDays } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";
import { useSchoolModules } from "@/hooks/useSchoolModules";

export default function Calendar() {
  const { defaultSchoolId } = useSchoolOperations();
  const { events, addEvent } = useSchoolModules(defaultSchoolId);
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !startsAt) return;
    await addEvent({ school_id: defaultSchoolId, title, starts_at: new Date(startsAt).toISOString(), location, event_type: "event" });
    setTitle("");
    setStartsAt("");
    setLocation("");
  };

  return (
    <SchoolShell title="Events & Calendar" description="Create events, sessions, competitions, and parent meetings.">
      <div className="space-y-6">
        <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-violet-700" />Add event</CardTitle></CardHeader><CardContent><form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" /><Input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} type="datetime-local" /><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" /><Button className="bg-violet-700 hover:bg-violet-800">Add event</Button></form></CardContent></Card>
        <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle>Calendar</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Starts</TableHead><TableHead>Location</TableHead></TableRow></TableHeader><TableBody>{events.map((event) => <TableRow key={event.id}><TableCell className="font-bold">{event.title}</TableCell><TableCell>{event.event_type}</TableCell><TableCell>{new Date(event.starts_at).toLocaleString()}</TableCell><TableCell>{event.location ?? "-"}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </SchoolShell>
  );
}
