import { ReactNode } from "react";
import { Bell, ChevronLeft } from "lucide-react";
import { type MobileTab } from "@/components/school/mobile/runtime/MobilePrimitives";

export function MobileChrome({
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
  onBack,
  onBell,
}: {
  title: string;
  tabs: MobileTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  onBack?: () => void;
  onBell?: () => void;
}) {
  return (
    <article className="mx-auto w-full max-w-[390px] rounded-[34px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80">
      <div className="flex min-h-[720px] flex-col overflow-hidden rounded-[27px] bg-[#f7f8fc]">
        <div className="flex items-center justify-between px-5 pb-3 pt-4 text-[11px] font-black text-slate-900">
          <span>9:41</span>
          <div className="h-5 w-20 rounded-full bg-slate-950" />
          <span>5G</span>
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <button
            className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-violet-50 hover:text-violet-700"
            type="button"
            onClick={onBack}
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="text-xs font-black text-slate-700">{title}</p>
          <button
            className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-violet-50 hover:text-violet-700"
            type="button"
            onClick={onBell}
          >
            <Bell className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">{children}</div>

        <nav
          className="grid border-t border-slate-200 bg-white px-2 py-2 text-center"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`rounded-2xl px-1 py-2 text-[10px] font-black ${
                tab.id === activeTab ? "bg-violet-50 text-violet-700" : "text-slate-500"
              }`}
              type="button"
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon className="mx-auto mb-1 size-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </article>
  );
}
