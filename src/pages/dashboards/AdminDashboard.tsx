import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, BookOpen, UserCheck } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [completedChapters, setCompletedChapters] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'admin') fetchAll();
  }, [user, userRole]);

  const fetchAll = async () => {
    setDataLoading(true);
    const [p, reg, cc] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('roboliga_registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('completed_chapters').select('*'),
    ]);
    setProfiles(p.data || []);
    setRegistrations(reg.data || []);
    setCompletedChapters(cc.data || []);
    setDataLoading(false);
  };

  // Build chart data before early returns (hooks must be unconditional)
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

  const registrationTrend = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    registrations.forEach(r => {
      const day = r.created_at?.slice(0, 10);
      if (day && day in days) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      registrations: count,
    }));
  }, [registrations]);

  const chartConfig = {
    completions: { label: 'Completions', color: 'hsl(var(--primary))' },
    registrations: { label: 'Registrations', color: 'hsl(270 60% 60%)' },
  };

  if (loading || dataLoading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" description="Manage users, registrations, and track platform analytics.">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Users', value: profiles.length, icon: Users, color: 'text-cyan-400' },
          { label: 'Registrations', value: registrations.length, icon: UserCheck, color: 'text-purple-400' },
          { label: 'Chapters Completed', value: completedChapters.length, icon: BookOpen, color: 'text-green-400' },
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
          <CardHeader><CardTitle className="text-white text-sm">Chapter Completions (30 days)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader><CardTitle className="text-white text-sm">Registrations (30 days)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <LineChart data={registrationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="registrations" stroke="hsl(270 60% 60%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Users */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardHeader><CardTitle className="text-white">Users</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Joined</TableHead>
                  <TableHead className="text-gray-400">Chapters</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p) => (
                  <TableRow key={p.user_id} className="border-white/10">
                    <TableCell className="text-white">{p.full_name || '—'}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-cyan-400 font-medium">
                      {completedChapters.filter(c => c.user_id === p.user_id).length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Registrations */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader><CardTitle className="text-white">Recent Registrations</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Team</TableHead>
                  <TableHead className="text-gray-400">School</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.slice(0, 10).map((reg) => (
                  <TableRow key={reg.id} className="border-white/10">
                    <TableCell className="text-white">{reg.team_name}</TableCell>
                    <TableCell className="text-gray-400">{reg.school_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reg.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        reg.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{reg.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
