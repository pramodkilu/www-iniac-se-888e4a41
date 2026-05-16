import { Link } from "react-router-dom";
import { SchoolShell } from "@/components/school/SchoolShell";
import { roles } from "@/data/mockSchoolData";

export default function RoleSelection() {
  return (
    <SchoolShell title="Choose your daily workspace" description="Each role gets a focused, parent-friendly dashboard with only the tools they need.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <Link
            key={role.id}
            to={`/school/dashboard/${role.id}`}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className={`flex size-12 items-center justify-center rounded-[18px] ${role.tone}`}>
              <role.icon className="size-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold tracking-tight">{role.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{role.description}</p>
            <p className="mt-5 text-sm font-semibold text-slate-950">Open dashboard</p>
          </Link>
        ))}
      </div>
    </SchoolShell>
  );
}
