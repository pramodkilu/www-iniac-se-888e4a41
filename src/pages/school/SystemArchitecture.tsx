import { Bot, Cloud, Database, Globe2, Plug, Server, ShieldCheck, Smartphone, UsersRound } from "lucide-react";
import { SchoolShell } from "@/components/school/SchoolShell";

const layers = [
  { title: "Users", icon: UsersRound, items: ["Super Admin", "School Admin", "Teacher", "Parent", "Student"] },
  { title: "Web & Mobile Apps", icon: Smartphone, items: ["React web dashboard", "Responsive PWA", "Mobile-first role screens"] },
  { title: "API Gateway", icon: Globe2, items: ["Supabase client", "Edge functions", "Role-aware access"] },
  { title: "Microservices", icon: Server, items: ["Attendance", "Payments", "Messaging", "Reports"] },
  { title: "AI Engine", icon: Bot, items: ["Verification", "Lesson assistant", "Recommendations"] },
  { title: "Data Layer", icon: Database, items: ["Supabase Auth", "Postgres", "Storage"] },
  { title: "Integrations", icon: Plug, items: ["Stripe", "Swish manual", "Email", "Push"] },
  { title: "Infrastructure", icon: Cloud, items: ["Vercel", "Supabase", "Monitoring"] },
];

export default function SystemArchitecture() {
  return (
    <SchoolShell
      title="System Architecture"
      description="A visual platform map for users, apps, services, AI, data, integrations, and infrastructure."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {layers.map((layer, index) => (
          <div key={layer.title} className="relative rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <layer.icon className="size-6" />
              </div>
              <span className="text-sm font-black text-slate-300">0{index + 1}</span>
            </div>
            <h2 className="mt-5 text-lg font-black">{layer.title}</h2>
            <div className="mt-4 space-y-2">
              {layer.items.map((item) => (
                <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-violet-300" />
          <h2 className="text-xl font-black">Architecture principle</h2>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          Keep the frontend role-aware and fast, use Supabase for auth/data/storage, add edge
          functions for privileged workflows, and introduce AI/payment integrations after core
          school operations are stable.
        </p>
      </div>
    </SchoolShell>
  );
}
