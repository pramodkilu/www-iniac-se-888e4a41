import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileScreenFrame } from "@/components/school/mobile/MobileScreenFrame";
import { type MobileFlowSpec } from "@/data/mobileSchoolData";

export function MobileFlowSection({
  flow,
  compact = false,
}: {
  flow: MobileFlowSpec;
  compact?: boolean;
}) {
  const screens = compact ? flow.screens.slice(0, 2) : flow.screens;

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">Mobile flow</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{flow.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{flow.description}</p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to={flow.route}>
            Open flow
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {screens.map((screen) => (
          <MobileScreenFrame key={screen.id} screen={screen} />
        ))}
      </div>
    </section>
  );
}
