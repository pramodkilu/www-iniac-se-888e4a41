import { FormEvent, useState } from "react";
import { Banknote } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";
import { KpiGrid } from "@/components/school/SchoolCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";
import { useSchoolModules } from "@/hooks/useSchoolModules";

export default function Payments() {
  const { students, defaultSchoolId } = useSchoolOperations();
  const { invoices, addInvoice } = useSchoolModules(defaultSchoolId);
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const totalCents = invoices.reduce((sum, invoice) => sum + invoice.amount_cents, 0);
  const paidCents = invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.amount_cents, 0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await addInvoice({
      school_id: defaultSchoolId,
      student_id: studentId || null,
      invoice_number: `INV-${Date.now()}`,
      title,
      amount_cents: Math.round(Number(amount || 0) * 100),
      status: "pending",
      due_date: dueDate || null,
    });
    setTitle("");
    setAmount("");
    setDueDate("");
  };

  return (
    <SchoolShell title="Payments & Invoices" description="Create invoices and track payment status for parents.">
      <div className="space-y-6">
        <KpiGrid
          kpis={[
            { label: "Invoices", value: String(invoices.length), detail: "total records", tone: "bg-violet-50 text-violet-700" },
            { label: "Total billed", value: `SEK ${Math.round(totalCents / 100)}`, detail: "all invoices", tone: "bg-blue-50 text-blue-700" },
            { label: "Collected", value: `SEK ${Math.round(paidCents / 100)}`, detail: "paid invoices", tone: "bg-emerald-50 text-emerald-700" },
            { label: "Pending", value: String(invoices.filter((invoice) => invoice.status !== "paid").length), detail: "follow-up", tone: "bg-orange-50 text-orange-700" },
          ]}
        />

        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="size-5 text-violet-700" />Create invoice</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-5">
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue placeholder="Student" /></SelectTrigger>
                <SelectContent>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.full_name}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Invoice title" />
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount SEK" type="number" />
              <Input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
              <Button className="bg-violet-700 hover:bg-violet-800">Create</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Title</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Due</TableHead></TableRow></TableHeader>
              <TableBody>{invoices.map((invoice) => <TableRow key={invoice.id}><TableCell className="font-bold">{invoice.invoice_number}</TableCell><TableCell>{invoice.title}</TableCell><TableCell>{invoice.currency} {invoice.amount_cents / 100}</TableCell><TableCell>{invoice.status}</TableCell><TableCell>{invoice.due_date ?? "-"}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SchoolShell>
  );
}
