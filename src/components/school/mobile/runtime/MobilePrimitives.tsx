import { LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type StatusTone } from "@/components/school/mobile/runtime/mobileUtils";

export type MobileTab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export function StatusPill({
  children,
  tone = "blue",
}: {
  children: string;
  tone?: StatusTone;
}) {
  const tones: Record<StatusTone, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    orange: "bg-orange-50 text-orange-700 ring-orange-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${tones[tone]}`}>{children}</span>;
}

export function AppMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-base font-black text-slate-950">{value}</p>
    </div>
  );
}

export function AppRow({
  title,
  meta,
  status,
  tone = "blue",
  action,
}: {
  title: string;
  meta: string;
  status?: string;
  tone?: StatusTone;
  action?: () => void;
}) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-2xl bg-white p-3 text-left shadow-sm transition hover:bg-violet-50"
      type="button"
      onClick={action}
    >
      <div>
        <p className="text-sm font-black text-slate-950">{title}</p>
        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{meta}</p>
      </div>
      {status ? <StatusPill tone={tone}>{status}</StatusPill> : null}
    </button>
  );
}

export function HeroCard({
  eyebrow,
  title,
  label,
  value,
  progress,
}: {
  eyebrow: string;
  title: string;
  label: string;
  value: string;
  progress?: number;
}) {
  return (
    <div className="rounded-[24px] bg-gradient-to-br from-violet-700 to-blue-600 p-5 text-white shadow-lg shadow-violet-200">
      <p className="text-xs font-bold opacity-80">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black leading-tight">{title}</h2>
      <div className="mt-5 rounded-2xl bg-white/15 p-3 backdrop-blur">
        <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">{label}</p>
        <p className="mt-1 text-xl font-black">{value}</p>
        {typeof progress === "number" ? <Progress value={progress} className="mt-3 h-2 bg-white/20 [&>div]:bg-white" /> : null}
      </div>
    </div>
  );
}
