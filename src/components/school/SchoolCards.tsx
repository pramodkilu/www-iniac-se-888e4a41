import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle2, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Kpi, recentActivities, upcomingEvents } from "@/data/mockSchoolData";

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className={`mb-4 inline-flex rounded-2xl px-3 py-1 text-xs font-black ${kpi.tone}`}>
              {kpi.label}
            </div>
            <p className="text-3xl font-black tracking-tight">{kpi.value}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">{kpi.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function WelcomeCard({
  welcome,
  actions,
}: {
  welcome: string;
  actions: string[];
}) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-sm">
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Badge className="bg-violet-500 hover:bg-violet-500">Live campus view</Badge>
          <h2 className="mt-4 text-2xl font-black">{welcome}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Manage the school day from one calm workspace across web, tablet, and mobile.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {actions.map((action) => (
            <Button key={action} variant="secondary" className="justify-between rounded-xl">
              {action}
              <ArrowRight className="size-4" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityAndEvents() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <p className="text-sm font-semibold text-slate-700">{activity}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Upcoming events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.title} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 p-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="text-sm font-black">{event.title}</p>
                <p className="text-xs font-medium text-slate-500">{event.meta}</p>
              </div>
              <p className="text-xs font-black text-violet-700">{event.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link to={href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </Link>
  );
}

export function ProgressCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-black">{title}</p>
          <span className="text-sm font-black text-violet-700">{value}%</span>
        </div>
        <Progress value={value} className="mt-4" />
        <p className="mt-3 text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
