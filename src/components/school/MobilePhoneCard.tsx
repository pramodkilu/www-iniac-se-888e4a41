import { Bell, ChevronLeft, Home } from "lucide-react";

export function MobilePhoneCard({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70">
      <div className="flex h-[430px] flex-col rounded-[24px] bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <ChevronLeft className="size-4" />
          <Bell className="size-4" />
        </div>
        <h3 className="mt-6 text-lg font-black">{title}</h3>
        <div className="mt-5 space-y-3">
          {lines.map((line, index) => (
            <div key={line} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className={index === 0 ? "font-black" : "text-sm font-semibold text-slate-600"}>{line}</p>
            </div>
          ))}
        </div>
        <div className="mt-auto grid grid-cols-4 border-t border-slate-200 pt-3 text-center text-[10px] font-bold text-slate-500">
          {["Home", "Courses", "Messages", "More"].map((item, index) => (
            <span key={item} className={index === 0 ? "text-violet-700" : ""}>
              <Home className="mx-auto mb-1 size-4" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
