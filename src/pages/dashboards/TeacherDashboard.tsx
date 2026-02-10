import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap, BookOpen, TrendingUp } from 'lucide-react';

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

  if (loading || dataLoading) {
    return (
      <DashboardLayout title="Teacher Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  // Build per-student stats
  const studentStats = profiles.map(p => {
    const chapters = completedChapters.filter(c => c.user_id === p.user_id);
    const grades = new Set(chapters.map(c => c.grade_id));
    return { ...p, chaptersCompleted: chapters.length, gradesExplored: grades.size };
  }).sort((a, b) => b.chaptersCompleted - a.chaptersCompleted);

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
