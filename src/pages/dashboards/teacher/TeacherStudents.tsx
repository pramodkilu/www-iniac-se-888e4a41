import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, GraduationCap, CheckCircle2, Clock, Circle } from 'lucide-react';
import { chapters as allChapters } from '@/data/chapters';

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
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              {selected?.full_name || 'Student'}
            </DialogTitle>
          </DialogHeader>
          {detail && (() => {
            const doneIds = new Set(detail.done.map(d => d.chapter_id));
            const progMap = new Map(detail.inProg.map(p => [p.chapter_id, p]));
            const total = allChapters.length;
            const completedCount = detail.done.length;
            const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

            const checklist = allChapters.map(ch => {
              const completed = doneIds.has(ch.id);
              const inProg = progMap.get(ch.id);
              const status: 'done' | 'progress' | 'todo' = completed ? 'done' : inProg ? 'progress' : 'todo';
              return { id: ch.id, title: ch.title?.en || `Chapter ${ch.id}`, status, currentStep: inProg?.current_step, totalSteps: ch.build?.totalSteps };
            });

            const timeline = [...detail.done].sort((a, b) =>
              new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
            );

            return (
              <div className="space-y-4 overflow-hidden flex flex-col">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">{completedCount}</div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{detail.inProg.length}</div>
                    <div className="text-xs text-gray-400">In Progress</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{pct}%</div>
                    <div className="text-xs text-gray-400">Curriculum</div>
                  </div>
                </div>
                <Progress value={pct} className="h-2" />

                <Tabs defaultValue="checklist" className="flex-1 overflow-hidden flex flex-col">
                  <TabsList className="bg-white/5 border-white/10">
                    <TabsTrigger value="checklist">Chapter Checklist</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="checklist" className="flex-1 overflow-y-auto mt-3 pr-1">
                    <div className="space-y-1.5">
                      {checklist.map(c => (
                        <div
                          key={c.id}
                          className={`flex items-center gap-3 rounded px-3 py-2 text-sm border ${
                            c.status === 'done' ? 'bg-green-500/10 border-green-500/20' :
                            c.status === 'progress' ? 'bg-yellow-500/10 border-yellow-500/20' :
                            'bg-white/5 border-white/10'
                          }`}
                        >
                          {c.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                          ) : c.status === 'progress' ? (
                            <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                          )}
                          <span className="text-gray-400 w-8 shrink-0">#{c.id}</span>
                          <span className="flex-1 text-white truncate">{c.title}</span>
                          {c.status === 'progress' && c.currentStep && c.totalSteps && (
                            <span className="text-xs text-yellow-400 shrink-0">
                              Step {c.currentStep}/{c.totalSteps}
                            </span>
                          )}
                          {c.status === 'done' && (
                            <span className="text-xs text-green-400 shrink-0">Done</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="flex-1 overflow-y-auto mt-3 pr-1">
                    {timeline.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-8">No completions yet.</p>
                    ) : (
                      <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                        {timeline.map((d, i) => {
                          const ch = allChapters.find(x => x.id === d.chapter_id);
                          const prev = i > 0 ? new Date(timeline[i - 1].completed_at) : null;
                          const cur = new Date(d.completed_at);
                          const gap = prev ? Math.round((cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)) : null;
                          return (
                            <div key={d.id} className="relative">
                              <span className="absolute -left-[18px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
                              <div className="bg-white/5 rounded px-3 py-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-white font-medium">
                                    Ch {d.chapter_id}: {ch?.title?.en || '—'}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {cur.toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                  <span>Grade {d.grade_id}</span>
                                  {gap !== null && <span>· +{gap}d since previous</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeacherStudents;
