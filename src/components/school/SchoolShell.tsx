import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpenCheck, LayoutDashboard, Menu, MessageSquareText, Sparkles, UserRound } from "lucide-react";
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
    { label: "Courses", href: "/school/modules/courses", icon: BookOpenCheck, activePaths: ["/school/modules/courses", "/school/robotics"] },
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
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <Link to="/school" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-violet-700 text-white">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-lg font-black tracking-wide">INIAC</p>
              <p className="text-[11px] font-bold text-slate-500">School Platform</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden bg-violet-700 hover:bg-violet-800 sm:inline-flex">
              <Link to="/school/signup">Start demo</Link>
            </Button>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="lg:flex">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <nav className="space-y-1">
            {schoolNavItems.map((item) => {
              const active = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    active
                      ? "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">
              EduFlex-style school SaaS
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
            ) : null}
          </div>
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 pb-2 pt-2 backdrop-blur lg:hidden">
        {mobileItems.map((item) => {
          const active = isActivePath(item.href, item.activePaths);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold ${
                active ? "bg-violet-50 text-violet-700" : "text-slate-500"
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
