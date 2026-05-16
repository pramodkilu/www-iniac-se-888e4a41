import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { MobileFlowSection } from "@/components/school/mobile/MobileFlowSection";
import { MobileRuntimeApp } from "@/components/school/mobile/MobileRuntimeApp";
import { SchoolShell } from "@/components/school/SchoolShell";
import { Button } from "@/components/ui/button";
import { getMobileFlow, mobileFlows } from "@/data/mobileSchoolData";

export default function MobileRolePreview() {
  const { flow } = useParams();
  const [searchParams] = useSearchParams();
  const activeFlow = getMobileFlow(flow);
  const activeTab = searchParams.get("tab") ?? "home";

  return (
    <SchoolShell title={activeFlow.title} description={activeFlow.description}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/school/mobile">
              <ChevronLeft className="mr-2 size-4" />
              All mobile flows
            </Link>
          </Button>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:justify-end sm:pb-0">
            {mobileFlows.map((item) => (
              <Button
                key={item.key}
                asChild
                variant={item.key === activeFlow.key ? "default" : "outline"}
                className={item.key === activeFlow.key ? "bg-violet-700 hover:bg-violet-800" : ""}
              >
                <Link to={item.route}>{item.title}</Link>
              </Button>
            ))}
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[430px_1fr]">
          <MobileRuntimeApp key={`${activeFlow.key}-${activeTab}`} flow={activeFlow.key} />
          <div className="space-y-4">
            <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                Coded app surface
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                This side is now functional
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the phone tabs, buttons, payment rows, message action, attendance actions, and robotics checklist.
                It reads from the existing school data hooks and falls back to preview data if Supabase tables are empty.
              </p>
            </div>
            <MobileFlowSection flow={activeFlow} compact />
          </div>
        </section>
      </div>
    </SchoolShell>
  );
}
