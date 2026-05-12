import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiGrid } from "@/components/school/SchoolCards";
import { SchoolShell } from "@/components/school/SchoolShell";
import { analyticsData } from "@/data/mockSchoolData";

export default function AnalyticsReports() {
  return (
    <SchoolShell
      title="Analytics & Reports"
      description="Academic performance, attendance analytics, and financial overview for school leaders."
    >
      <div className="space-y-6">
        <KpiGrid
          kpis={[
            { label: "Academic performance", value: "88%", detail: "+5% from April", tone: "bg-violet-50 text-violet-700" },
            { label: "Attendance", value: "91%", detail: "May average", tone: "bg-emerald-50 text-emerald-700" },
            { label: "Revenue collected", value: "84%", detail: "SEK 842k", tone: "bg-blue-50 text-blue-700" },
            { label: "Risk alerts", value: "12", detail: "needs follow-up", tone: "bg-orange-50 text-orange-700" },
          ]}
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black">Attendance analytics</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="attendance" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black">Academic and financial overview</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}
