import { Bell, ChevronLeft, MoreHorizontal, Wifi } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type MobileScreenSpec } from "@/data/mobileSchoolData";

const statusTone: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  orange: "bg-orange-50 text-orange-700 ring-orange-100",
};

export function MobileScreenFrame({ screen }: { screen: MobileScreenSpec }) {
  return (
    <article className="mx-auto w-full max-w-[330px] rounded-[34px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80">
      <div className="flex min-h-[610px] flex-col overflow-hidden rounded-[27px] bg-[#f7f8fc]">
        <div className="flex items-center justify-between px-5 pb-3 pt-4 text-[11px] font-black text-slate-900">
          <span>9:41</span>
          <div className="h-5 w-20 rounded-full bg-slate-950" />
          <div className="flex items-center gap-1">
            <Wifi className="size-3" />
            <span>82%</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-2">
          <button className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm" type="button">
            <ChevronLeft className="size-4" />
          </button>
          <p className="text-xs font-black text-slate-700">{screen.title}</p>
          <button className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm" type="button">
            <Bell className="size-4" />
          </button>
        </div>

        <div className={`mx-4 mt-3 rounded-[24px] bg-gradient-to-br ${screen.accent} p-5 text-white shadow-lg shadow-violet-200/70`}>
          <p className="text-xs font-bold opacity-80">{screen.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-black leading-tight">{screen.greeting}</h3>
          <div className="mt-5 rounded-2xl bg-white/15 p-3 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">{screen.primaryLabel}</p>
            <p className="mt-1 text-xl font-black">{screen.primaryValue}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 py-4">
          {screen.metrics.map((metric) => (
            <div key={`${screen.id}-${metric.label}`} className="rounded-2xl bg-white p-3 text-center shadow-sm">
              <p className="text-[10px] font-bold text-slate-500">{metric.label}</p>
              <p className="mt-1 text-base font-black text-slate-950">{metric.value}</p>
            </div>
          ))}
        </div>

        {typeof screen.progress === "number" ? (
          <div className="px-4">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-xs font-black">
                <span>Progress</span>
                <span className="text-violet-700">{screen.progress}%</span>
              </div>
              <Progress value={screen.progress} className="h-2 bg-slate-100 [&>div]:bg-violet-700" />
            </div>
          </div>
        ) : null}

        <div className="space-y-2 px-4 py-4">
          {screen.items.map((item) => (
            <div key={`${screen.id}-${item.title}`} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
              <div>
                <p className="text-sm font-black text-slate-950">{item.title}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.meta}</p>
              </div>
              {item.status ? (
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${
                    statusTone[item.tone ?? "blue"] ?? statusTone.blue
                  }`}
                >
                  {item.status}
                </span>
              ) : (
                <MoreHorizontal className="size-4 text-slate-400" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-4 border-t border-slate-200 bg-white px-2 py-2 text-center">
          {screen.actions.map((action, index) => (
            <button
              key={`${screen.id}-${action.label}`}
              className={`rounded-2xl px-1 py-2 text-[10px] font-black ${
                index === 0 ? "bg-violet-50 text-violet-700" : "text-slate-500"
              }`}
              type="button"
            >
              <action.icon className="mx-auto mb-1 size-4" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
