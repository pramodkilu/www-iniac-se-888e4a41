import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Star, ChevronRight, CheckCircle2, Rocket, Zap, ArrowRight } from 'lucide-react';
import { chapters, tr } from '@/data/chapters';

const gradeForChapter = (id: number) =>
  id <= 6 ? 1 : id <= 12 ? 2 : id <= 18 ? 3 : id <= 24 ? 4 : 5;

const difficultyForChapter = (id: number): "Easy" | "Medium" | "Hard" =>
  id <= 6 ? "Easy" : id <= 18 ? "Medium" : "Hard";

const difficultyColors = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
};

const StudentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setDataLoading(true);
    const { data } = await supabase
      .from('completed_chapters')
      .select('chapter_id')
      .eq('user_id', user!.id);
    setCompletedIds((data || []).map((r: { chapter_id: number }) => r.chapter_id));
    setDataLoading(false);
  };

  if (loading || dataLoading) {
    return (
      <DashboardLayout title="My Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  const completedCount = completedIds.length;
  const gradesExplored = new Set(completedIds.map(id => gradeForChapter(id))).size;
  const xp = completedCount * 100;
  const level = completedCount >= 20 ? 'Master' : completedCount >= 10 ? 'Champion' : completedCount >= 5 ? 'Explorer' : 'Beginner';
  const levelEmoji = completedCount >= 20 ? '👑' : completedCount >= 10 ? '🏆' : completedCount >= 5 ? '🧭' : '🌟';
  const progressPct = Math.round((completedCount / 30) * 100);

  // Next chapter = first chapter not yet completed
  const nextChapter = chapters.find(c => !completedIds.includes(c.id));

  const completedChapters = chapters.filter(c => completedIds.includes(c.id));
  const inProgressChapters = chapters.filter(c => !completedIds.includes(c.id)).slice(0, showAll ? 30 : 6);

  const badges = [
    { name: 'First Build', emoji: '👣', unlocked: completedCount >= 1, req: 'Complete 1 chapter' },
    { name: 'Explorer', emoji: '🧭', unlocked: completedCount >= 5, req: 'Complete 5 chapters' },
    { name: 'Champion', emoji: '🏆', unlocked: completedCount >= 10, req: 'Complete 10 chapters' },
    { name: 'Master Builder', emoji: '👑', unlocked: completedCount >= 20, req: 'Complete 20 chapters' },
    { name: 'Multi-Grade', emoji: '🎓', unlocked: gradesExplored >= 3, req: 'Explore 3 grades' },
    { name: 'All 30!', emoji: '🚀', unlocked: completedCount >= 30, req: 'Complete all 30 chapters' },
  ];

  return (
    <DashboardLayout title="My Dashboard" description="Track your learning journey, progress, and achievements.">

      {/* ── Next chapter CTA ─────────────────────────────────────────────── */}
      {nextChapter && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-cyan-500/30 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-4xl shrink-0">🚀</div>
          <div className="flex-1">
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wide mb-0.5">Continue Learning</p>
            <p className="text-white font-bold text-lg">{tr(nextChapter.title, "en")}</p>
            <p className="text-gray-400 text-sm">{tr(nextChapter.subtitle, "en")}</p>
          </div>
          <Link to={`/chapter/${nextChapter.id}`}>
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-white gap-2 shrink-0">
              Start Chapter {nextChapter.id} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-cyan-400">{completedCount}</p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-0.5"><BookOpen className="w-3 h-3" /> Chapters Done</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-400">{xp}</p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-0.5"><Zap className="w-3 h-3" /> XP Earned</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl">{levelEmoji}</p>
            <p className="text-sm text-gray-400 mt-0.5">{level}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">{progressPct}%</p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-0.5"><Star className="w-3 h-3" /> Complete</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <Card className="bg-white/10 border-white/20 mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{completedCount} / 30 chapters</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {[1,6,12,18,24,30].map(n => (
              <span key={n} className={`text-[10px] ${completedCount >= n ? "text-cyan-400 font-bold" : "text-gray-600"}`}>
                {n === 30 ? "🏁" : `Ch${n}`}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Available Chapters ────────────────────────────────────────────── */}
      <Card className="bg-white/10 border-white/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2"><Rocket className="w-5 h-5 text-cyan-400" /> Available Chapters</span>
            <button onClick={() => setShowAll(s => !s)} className="text-xs text-cyan-400 hover:text-cyan-300 font-normal">
              {showAll ? "Show less" : "Show all"}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inProgressChapters.map(chapter => {
              const diff = difficultyForChapter(chapter.id);
              return (
                <Link key={chapter.id} to={`/chapter/${chapter.id}`}>
                  <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 rounded-xl p-3 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                      {chapter.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{tr(chapter.title, "en")}</p>
                      <p className="text-gray-500 text-xs truncate">{tr(chapter.theory.concept, "en")}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${difficultyColors[diff]}`}>{diff}</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Completed Chapters ────────────────────────────────────────────── */}
      {completedChapters.length > 0 && (
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Completed ({completedChapters.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {completedChapters.map(chapter => (
                <Link key={chapter.id} to={`/chapter/${chapter.id}`}>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer gap-1 px-2 py-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ch{chapter.id}: {tr(chapter.title, "en")}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Achievements ─────────────────────────────────────────────────── */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Achievements</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div key={badge.name}
                className={`rounded-xl p-4 text-center transition-all ${
                  badge.unlocked ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-white/5 opacity-40'
                }`}
              >
                <div className="text-3xl mb-1">{badge.emoji}</div>
                <p className="text-white text-sm font-semibold">{badge.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{badge.req}</p>
                {badge.unlocked && <p className="text-yellow-400 text-[10px] mt-1 font-bold">✅ Unlocked!</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </DashboardLayout>
  );
};

export default StudentDashboard;
