import { Link } from "react-router-dom";
import { SchoolShell } from "@/components/school/SchoolShell";
import { roles } from "@/data/mockSchoolData";

export default function RoleSelection() {
  return (
    <SchoolShell title="Select your role" description="Choose a role to preview the correct dashboard and mobile navigation.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <Link
            key={role.id}
            to={`/school/dashboard/${role.id}`}
            className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`flex size-12 items-center justify-center rounded-2xl ${role.tone}`}>
              <role.icon className="size-6" />
            </div>
            <h2 className="mt-5 text-xl font-black">{role.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
          </Link>
        ))}
      </div>
    </SchoolShell>
  );
}
