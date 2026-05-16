import { FormEvent, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";
import { useSchoolModules } from "@/hooks/useSchoolModules";

export default function Messages() {
  const { students, defaultSchoolId } = useSchoolOperations();
  const { messages, addMessage } = useSchoolModules(defaultSchoolId);
  const [studentId, setStudentId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    await addMessage({ school_id: defaultSchoolId, student_id: studentId || null, recipient_email: recipientEmail, subject, body, status: "sent" });
    setSubject("");
    setBody("");
  };

  return (
    <SchoolShell title="Communication / Messages" description="Send parent updates, attendance alerts, reminders, and teacher notes.">
      <div className="space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquareText className="size-5 text-violet-700" />Send message</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-5">
              <Select value={studentId} onValueChange={(value) => {
                setStudentId(value);
                setRecipientEmail(students.find((student) => student.id === value)?.guardian_email ?? "");
              }}>
                <SelectTrigger><SelectValue placeholder="Student" /></SelectTrigger>
                <SelectContent>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.full_name}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Parent email" />
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
              <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message" />
              <Button className="bg-violet-700 hover:bg-violet-800">Send</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Messages</CardTitle></CardHeader>
          <CardContent><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Recipient</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{messages.map((message) => <TableRow key={message.id}><TableCell className="font-bold">{message.subject}</TableCell><TableCell>{message.recipient_email ?? "-"}</TableCell><TableCell>{message.status}</TableCell><TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell></TableRow>)}</TableBody></Table></CardContent>
        </Card>
      </div>
    </SchoolShell>
  );
}
