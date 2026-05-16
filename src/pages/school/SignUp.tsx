import { Link } from "react-router-dom";
import { CheckCircle2, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SchoolShell } from "@/components/school/SchoolShell";

export default function SignUp() {
  return (
    <SchoolShell title="Create your school workspace" description="A guided onboarding flow for school teams and families. Existing Supabase auth remains untouched.">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8">
          <p className="text-sm font-semibold text-slate-500">Step 1 of 2</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Tell us who is setting up the school.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            We keep onboarding short so admins can invite teachers and parents after the first workspace is ready.
          </p>
          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UserRound className="size-4" /> Full name
              </span>
              <Input className="h-12 rounded-2xl border-slate-200 bg-slate-50" placeholder="Aarav Sharma" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail className="size-4" /> Email
              </span>
              <Input className="h-12 rounded-2xl border-slate-200 bg-slate-50" placeholder="name@school.se" type="email" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Phone className="size-4" /> Phone
              </span>
              <Input className="h-12 rounded-2xl border-slate-200 bg-slate-50" placeholder="+46 70 000 00 00" />
            </label>
            <Button asChild className="h-12 w-full rounded-full bg-slate-950 font-semibold hover:bg-slate-800">
              <Link to="/school/roles">Continue to role selection</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold text-slate-300">What happens next</p>
          <div className="mt-6 space-y-4">
            {["Choose your role", "Preview the right dashboard", "Invite families when ready"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <CheckCircle2 className="size-5 text-emerald-300" />
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}
