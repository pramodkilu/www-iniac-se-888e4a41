import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { BookOpen, TrendingUp, Award, Target } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(160 60% 45%)', 'hsl(45 90% 55%)', 'hsl(280 65% 60%)', 'hsl(200 70% 50%)'];

const TeacherProgress = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, cc] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('completed_chapters').select('*').order('completed_at', { ascending: false }),
      ]);
      setProfiles(p.data || []);
      setCompleted(cc.data || []);
      setLoading(false);
    })();
  }, []);

  const trend = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    completed.forEach(c => {
      const day = c.completed_at?.slice(0, 10);
      if (day && day in days) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      completions: count,
    }));
  }, [completed]);

  const byGrade = useMemo(() => {
    const g: Record<number, number> = {};
    completed.forEach(c => { g[c.grade_id] = (g[c.grade_id] || 0) + 1; });
    return Object.entries(g).map(([grade, count]) => ({ grade: `Grade ${grade}`, count }))
      .sort((a, b) => a.grade.localeCompare(b.grade));
  }, [completed]);

  const topChapters = useMemo(() => {
    const c: Record<number, number> = {};
    completed.forEach(x => { c[x.chapter_id] = (c[x.chapter_id] || 0) + 1; });
    return Object.entries(c)
      .map(([chapter, count]) => ({ name: `Ch ${chapter}`, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [completed]);

  const stats = useMemo(() => {
    const active = new Set(completed.map(c => c.user_id)).size;
    const avg = profiles.length > 0 ? (completed.length / profiles.length).toFixed(1) : '0';
    const last7 = completed.filter(c => {
      const d = new Date(c.completed_at);
      return d.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
    }).length;
    return { total: completed.length, active, avg, last7 };
  }, [profiles, completed]);

  const chartConfig = {
    completions: { label: 'Completions', color: 'hsl(var(--primary))' },
    count: { label: 'Chapters', color: 'hsl(160 60% 45%)' },
  };

  if (loading) {
    return (
      <DashboardLayout title="Progress">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Progress" description="Class-wide learning analytics and trends.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Completions', value: stats.total, icon: BookOpen, color: 'text-green-400' },
          { label: 'Active Students', value: stats.active, icon: Target, color: 'text-cyan-400' },
          { label: 'Avg per Student', value: stats.avg, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Last 7 days', value: stats.last7, icon: Award, color: 'text-yellow-400' },
        ].map(s => (
          <Card key={s.label} className="bg-white/10 border-white/20">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card className="bg-white/10 border-white/20">
          <CardHeader><CardTitle className="text-white text-sm">Completion Trend (30 days)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="completions" fill="hsl(var(--primary) / 0.3)" stroke="hsl(var(--primary))" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardHeader><CardTitle className="text-white text-sm">Completions by Grade</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart data={byGrade}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="grade" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(160 60% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader><CardTitle className="text-white text-sm">Most Popular Chapters</CardTitle></CardHeader>
        <CardContent>
          {topChapters.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No completions yet.</p>
          ) : (
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <PieChart>
                <Pie data={topChapters} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {topChapters.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherProgress;
