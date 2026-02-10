import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, Star, Calendar } from 'lucide-react';

const gradeLabels: Record<number, string> = {
  1: 'Grade 1 - Foundations', 2: 'Grade 2 - Building Basics', 3: 'Grade 3 - Simple Machines',
  4: 'Grade 4 - Motion & Forces', 5: 'Grade 5 - Energy Systems', 6: 'Grade 6 - Electricity',
  7: 'Grade 7 - Structures', 8: 'Grade 8 - Automation', 9: 'Grade 9 - Advanced Projects',
};

const chapterTitles = [
  "Cart With Wheels", "Aerodynamic Car", "Sign Boards", "Bottle Opener", "Challenge Ladder",
  "Trebuchet", "Suspension Car", "Trundle Wheel", "Pasta Maker", "Launcher",
  "Flipping Picture", "Zip Line", "Merry-Go-Round", "Screw Press", "Crane",
  "Windmill", "Balance Scale", "Hydraulic Arm", "Solar Oven", "Periscope",
  "Electric Motor", "Bridge Builder", "Pulley System", "Gear Train", "Catapult Pro",
  "Robotic Arm", "Wind Turbine", "Suspension Bridge", "Compound Machine", "Final Project"
];

const StudentDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [completedChapters, setCompletedChapters] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setDataLoading(true);
    const { data } = await supabase
      .from('completed_chapters')
      .select('*')
      .eq('user_id', user!.id)
      .order('completed_at', { ascending: false });
    setCompletedChapters(data || []);
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

  const gradesExplored = new Set(completedChapters.map(c => c.grade_id)).size;
  const level = completedChapters.length >= 10 ? 'Champion' : completedChapters.length >= 5 ? 'Explorer' : 'Beginner';
  const levelEmoji = completedChapters.length >= 10 ? '🏆' : completedChapters.length >= 5 ? '🥈' : '🌟';

  return (
    <DashboardLayout title="My Dashboard" description="Track your learning journey, progress, and achievements.">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-cyan-400">{completedChapters.length}</p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1"><BookOpen className="w-3 h-3" /> Chapters</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">{gradesExplored}</p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1"><Star className="w-3 h-3" /> Grades</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl">{levelEmoji}</p>
            <p className="text-sm text-gray-400">{level}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-400">{completedChapters.length * 10}</p>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1"><Trophy className="w-3 h-3" /> XP</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Achievements</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'First Steps', emoji: '👣', unlocked: completedChapters.length >= 1, req: 'Complete 1 chapter' },
              { name: 'Explorer', emoji: '🧭', unlocked: completedChapters.length >= 5, req: 'Complete 5 chapters' },
              { name: 'Champion', emoji: '🏆', unlocked: completedChapters.length >= 10, req: 'Complete 10 chapters' },
              { name: 'Multi-Grade', emoji: '🎓', unlocked: gradesExplored >= 3, req: 'Explore 3 grades' },
            ].map((badge) => (
              <div
                key={badge.name}
                className={`rounded-xl p-4 text-center transition-all ${
                  badge.unlocked ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-white/5 opacity-50'
                }`}
              >
                <div className="text-3xl mb-1">{badge.emoji}</div>
                <p className="text-white text-sm font-medium">{badge.name}</p>
                <p className="text-gray-500 text-xs">{badge.req}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Chapters */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><BookOpen className="w-5 h-5" /> Completed Chapters</CardTitle></CardHeader>
        <CardContent>
          {completedChapters.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {completedChapters.map((chapter) => (
                <div key={chapter.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{chapterTitles[(chapter.chapter_id - 1) % 30] || `Chapter ${chapter.chapter_id}`}</p>
                    <p className="text-gray-400 text-sm">{gradeLabels[chapter.grade_id] || `Grade ${chapter.grade_id}`}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    {new Date(chapter.completed_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🚀</p>
              <p className="text-gray-400 mb-4">No chapters completed yet. Start learning!</p>
              <Button onClick={() => navigate('/')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Explore Chapters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentDashboard;
