import { Link } from "react-router-dom";
import { Mail, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SchoolShell } from "@/components/school/SchoolShell";

export default function SignUp() {
  return (
    <SchoolShell title="Create your account" description="Mock signup UI. Supabase auth remains untouched for the existing app.">
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <UserRound className="size-4" /> Full name
            </span>
            <Input placeholder="Aarav Sharma" />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Mail className="size-4" /> Email
            </span>
            <Input placeholder="name@school.se" type="email" />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <Phone className="size-4" /> Phone
            </span>
            <Input placeholder="+46 70 000 00 00" />
          </label>
          <Button asChild className="h-12 w-full bg-violet-700 hover:bg-violet-800">
            <Link to="/school/roles">Continue to role selection</Link>
          </Button>
        </div>
      </div>
    </SchoolShell>
  );
}
