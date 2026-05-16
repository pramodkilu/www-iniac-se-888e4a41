import { Link } from "react-router-dom";
import { ArrowRight, Smartphone } from "lucide-react";
import { MobileFlowSection } from "@/components/school/mobile/MobileFlowSection";
import { SchoolShell } from "@/components/school/SchoolShell";
import { Button } from "@/components/ui/button";
import { mobileFlows } from "@/data/mobileSchoolData";

export default function MobileAppPreview() {
  return (
    <SchoolShell
      title="Mobile / PWA App"
      description="Role-based mobile screens for parents, students, staff, and robotics AI learning. Built as responsive React pages so the same platform can ship as mobile web or PWA."
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_0.85fr] lg:p-8">
            <div className="flex flex-col justify-center">
              <div className="flex size-12 items-center justify-center rounded-[18px] bg-slate-950 text-white">
                <Smartphone className="size-6" />
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Mobile-first school experience for every role
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Parents get payments, attendance, and messages. Students get courses, progress, badges, and challenges.
                Staff get daily operations. Robotics uses a story-to-build-to-AI-check learning flow.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {mobileFlows.map((flow) => (
                  <Link
                    key={flow.key}
                    to={flow.route}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{flow.title}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{flow.screens.length} app screens</p>
                      </div>
                      <ArrowRight className="size-4 text-slate-700" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-[#f7f8f6] p-4">
              <div className="grid grid-cols-2 gap-3">
                {mobileFlows.flatMap((flow) => flow.screens.slice(0, 1)).map((screen) => (
                  <div key={screen.id} className="rounded-[20px] bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{screen.title}</p>
                    <p className="mt-3 text-lg font-semibold leading-tight text-slate-950">{screen.primaryValue}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{screen.primaryLabel}</p>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-4 w-full rounded-full bg-slate-950 font-semibold hover:bg-slate-800">
                <Link to="/school/mobile/parent">Preview parent app</Link>
              </Button>
            </div>
          </div>
        </section>

        {mobileFlows.map((flow) => (
          <MobileFlowSection key={flow.key} flow={flow} compact />
        ))}
      </div>
    </SchoolShell>
  );
}
