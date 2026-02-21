import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

const TeacherDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [completedChapters, setCompletedChapters] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'teacher')) {
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'teacher') fetchAll();
  }, [user, userRole]);

  const fetchAll = async () => {
    setDataLoading(true);
    const [p, cc] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('completed_chapters').select('*').order('completed_at', { ascending: false }),
    ]);
    setProfiles(p.data || []);
    setCompletedChapters(cc.data || []);
    setDataLoading(false);
  };

  // Build all computed/memoized values before early returns
  const studentStats = useMemo(() => profiles.map(p => {
    const chapters = completedChapters.filter(c => c.user_id === p.user_id);
    const grades = new Set(chapters.map(c => c.grade_id));
    return { ...p, chaptersCompleted: chapters.length, gradesExplored: grades.size };
  }).sort((a, b) => b.chaptersCompleted - a.chaptersCompleted), [profiles, completedChapters]);

  const completionTrend = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    completedChapters.forEach(c => {
      const day = c.completed_at?.slice(0, 10);
      if (day && day in days) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      completions: count,
    }));
  }, [completedChapters]);

  const gradeBreakdown = useMemo(() => {
    const grades: Record<number, number> = {};
    completedChapters.forEach(c => {
      grades[c.grade_id] = (grades[c.grade_id] || 0) + 1;
    });
    return Object.entries(grades)
      .map(([grade, count]) => ({ grade: `Grade ${grade}`, count }))
      .sort((a, b) => a.grade.localeCompare(b.grade));
  }, [completedChapters]);

  const chartConfig = {
    completions: { label: 'Completions', color: 'hsl(var(--primary))' },
    count: { label: 'Chapters', color: 'hsl(160 60% 45%)' },
  };

  if (loading || dataLoading) {
    return (
      <DashboardLayout title="Teacher Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teacher Dashboard" description="Monitor student progress and class performance.">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Students', value: profiles.length, icon: GraduationCap, color: 'text-cyan-400' },
          { label: 'Total Completions', value: completedChapters.length, icon: BookOpen, color: 'text-green-400' },
          { label: 'Avg per Student', value: profiles.length > 0 ? (completedChapters.length / profiles.length).toFixed(1) : '0', icon: TrendingUp, color: 'text-purple-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/10 border-white/20">
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card className="bg-white/10 border-white/20">
          <CardHeader><CardTitle className="text-white text-sm">Completion Trend (30 days)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <AreaChart data={completionTrend}>
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
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={gradeBreakdown}>
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

      {/* Student Progress Table */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardHeader><CardTitle className="text-white">Student Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Student</TableHead>
                  <TableHead className="text-gray-400">Chapters</TableHead>
                  <TableHead className="text-gray-400">Grades</TableHead>
                  <TableHead className="text-gray-400">Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentStats.map((s) => (
                  <TableRow key={s.user_id} className="border-white/10">
                    <TableCell className="text-white">{s.full_name || '—'}</TableCell>
                    <TableCell className="text-cyan-400 font-medium">{s.chaptersCompleted}</TableCell>
                    <TableCell className="text-purple-400">{s.gradesExplored}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        s.chaptersCompleted >= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                        s.chaptersCompleted >= 5 ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-white/10 text-gray-400'
                      }`}>
                        {s.chaptersCompleted >= 10 ? '🏆 Champion' : s.chaptersCompleted >= 5 ? '🥈 Explorer' : '🌟 Beginner'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader><CardTitle className="text-white">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {completedChapters.slice(0, 15).map((cc) => {
              const student = profiles.find(p => p.user_id === cc.user_id);
              return (
                <div key={cc.id} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                  <div>
                    <span className="text-white font-medium">{student?.full_name || 'Unknown'}</span>
                    <span className="text-gray-400 ml-2">completed Chapter {cc.chapter_id} (Grade {cc.grade_id})</span>
                  </div>
                  <span className="text-gray-500 text-sm">{new Date(cc.completed_at).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
