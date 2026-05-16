import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, BookOpenCheck, LayoutDashboard, MessageSquareText, Search, Sparkles, UserRound } from "lucide-react";
import { schoolNavItems, type SchoolNavItem } from "@/data/mockSchoolData";
import { Button } from "@/components/ui/button";

type SchoolShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SchoolShell({ title, description, children }: SchoolShellProps) {
  const location = useLocation();
  const mobileItems: (SchoolNavItem & { activePaths: string[] })[] = [
    { label: "Home", href: "/school", icon: LayoutDashboard, activePaths: ["/school"] },
    { label: "Roles", href: "/school/roles", icon: UserRound, activePaths: ["/school/roles", "/school/dashboard"] },
    { label: "Programs", href: "/school/programs", icon: BookOpenCheck, activePaths: ["/school/programs", "/school/enrollments", "/school/modules/courses", "/school/robotics"] },
    { label: "Messages", href: "/school/modules/messages", icon: MessageSquareText, activePaths: ["/school/modules/messages"] },
    { label: "Mobile", href: "/school/mobile", icon: UserRound, activePaths: ["/school/mobile"] },
  ];

  const isActivePath = (href: string, activePaths?: string[]) => {
    const paths = activePaths ?? [href];
    return paths.some((path) =>
      path === "/school"
        ? location.pathname === path
        : location.pathname === path || location.pathname.startsWith(`${path}/`) || location.pathname.startsWith(path),
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-4 lg:px-6">
          <Link to="/school" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[14px] bg-slate-950 text-white shadow-sm">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">INIAC School</p>
              <p className="text-[11px] font-medium text-slate-500">Learn, build, belong</p>
            </div>
          </Link>
          <div className="hidden min-w-0 flex-1 justify-center px-8 md:flex">
            <div className="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
              <Search className="size-4" />
              <span className="truncate">Search students, sessions, payments...</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="hidden rounded-full border-slate-200 bg-white sm:inline-flex">
              <Bell className="size-4" />
            </Button>
            <Button asChild className="hidden rounded-full bg-slate-950 px-5 font-semibold hover:bg-slate-800 sm:inline-flex">
              <Link to="/school/signup">Start demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1680px] lg:flex">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200/70 bg-white/70 p-4 backdrop-blur lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="mb-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Today</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">Robotics Basics at 16:00</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">24 students, Grade 3-5</p>
          </div>
          <nav className="space-y-1">
            {schoolNavItems.map((item) => {
              const active = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-200/70 backdrop-blur sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Nordic school SaaS
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
            ) : null}
          </div>
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 pb-2 pt-2 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
        {mobileItems.map((item) => {
          const active = isActivePath(item.href, item.activePaths);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 rounded-[14px] px-1 py-1.5 text-[10px] font-semibold ${
                active ? "bg-slate-950 text-white" : "text-slate-500"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
