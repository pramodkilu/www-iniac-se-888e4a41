import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, GraduationCap } from 'lucide-react';

const TeacherStudents = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const [p, cc, pr] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('completed_chapters').select('*').order('completed_at', { ascending: false }),
        supabase.from('chapter_progress').select('*'),
      ]);
      setProfiles(p.data || []);
      setCompleted(cc.data || []);
      setProgress(pr.data || []);
      setLoading(false);
    })();
  }, []);

  const students = useMemo(() => profiles.map(p => {
    const done = completed.filter(c => c.user_id === p.user_id);
    const grades = new Set(done.map(c => c.grade_id));
    const inProgress = progress.filter(pp => pp.user_id === p.user_id);
    const last = done[0]?.completed_at || null;
    return {
      ...p,
      chaptersCompleted: done.length,
      gradesExplored: grades.size,
      inProgress: inProgress.length,
      lastActivity: last,
    };
  }).filter(s => !search || (s.full_name || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.chaptersCompleted - a.chaptersCompleted),
  [profiles, completed, progress, search]);

  const detail = useMemo(() => {
    if (!selected) return null;
    const done = completed.filter(c => c.user_id === selected.user_id);
    const inProg = progress.filter(p => p.user_id === selected.user_id);
    return { done, inProg };
  }, [selected, completed, progress]);

  if (loading) {
    return (
      <DashboardLayout title="Students">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Students" description="Browse and inspect each student's progress.">
      <Card className="bg-white/10 border-white/20 mb-6">
        <CardContent className="p-4 flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
          <span className="text-sm text-gray-400 whitespace-nowrap">{students.length} total</span>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader><CardTitle className="text-white">Roster</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Student</TableHead>
                  <TableHead className="text-gray-400">Completed</TableHead>
                  <TableHead className="text-gray-400">In Progress</TableHead>
                  <TableHead className="text-gray-400">Grades</TableHead>
                  <TableHead className="text-gray-400">Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow
                    key={s.user_id}
                    className="border-white/10 cursor-pointer hover:bg-white/5"
                    onClick={() => setSelected(s)}
                  >
                    <TableCell className="text-white">{s.full_name || '—'}</TableCell>
                    <TableCell className="text-cyan-400">{s.chaptersCompleted}</TableCell>
                    <TableCell className="text-yellow-400">{s.inProgress}</TableCell>
                    <TableCell className="text-purple-400">{s.gradesExplored}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {s.lastActivity ? new Date(s.lastActivity).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-6">No students found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              {selected?.full_name || 'Student'}
            </DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{detail.done.length}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{detail.inProg.length}</div>
                  <div className="text-xs text-gray-400">In Progress</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-400">{new Set(detail.done.map(d => d.grade_id)).size}</div>
                  <div className="text-xs text-gray-400">Grades</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Recent Completions</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {detail.done.slice(0, 10).map(d => (
                    <div key={d.id} className="flex justify-between bg-white/5 rounded px-3 py-2 text-sm">
                      <span>Chapter {d.chapter_id} (Grade {d.grade_id})</span>
                      <span className="text-gray-500">{new Date(d.completed_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {detail.done.length === 0 && <p className="text-gray-500 text-sm">No chapters completed yet.</p>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeacherStudents;
