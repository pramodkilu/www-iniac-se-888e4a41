import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Camera, Save, User, Trophy, BookOpen, Calendar } from 'lucide-react';
import Header from '@/components/Header';

interface CompletedChapter {
  id: string;
  chapter_id: number;
  grade_id: number;
  completed_at: string;
}

const Profile = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [completedChapters, setCompletedChapters] = useState<CompletedChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { from: '/profile' } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCompletedChapters();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('completed_chapters')
        .select('*')
        .eq('user_id', user!.id)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      setCompletedChapters(data || []);
    } catch (error) {
      console.error('Error fetching completed chapters:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('user_id', user.id);
      
      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl + '?t=' + Date.now()); // Add timestamp to bust cache
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const getGradeLabel = (gradeId: number) => {
    const gradeLabels: Record<number, string> = {
      1: 'Grade 1 - Foundations',
      2: 'Grade 2 - Building Basics',
      3: 'Grade 3 - Simple Machines',
      4: 'Grade 4 - Motion & Forces',
      5: 'Grade 5 - Energy Systems',
      6: 'Grade 6 - Electricity',
      7: 'Grade 7 - Structures',
      8: 'Grade 8 - Automation',
      9: 'Grade 9 - Advanced Projects',
    };
    return gradeLabels[gradeId] || `Grade ${gradeId}`;
  };

  const getChapterTitle = (chapterId: number, gradeId: number) => {
    const titles = [
      "Cart With Wheels", "Aerodynamic Car", "Sign Boards", "Bottle Opener", "Challenge Ladder",
      "Trebuchet", "Suspension Car", "Trundle Wheel", "Pasta Maker", "Launcher",
      "Flipping Picture", "Zip Line", "Merry-Go-Round", "Screw Press", "Crane",
      "Windmill", "Balance Scale", "Hydraulic Arm", "Solar Oven", "Periscope",
      "Electric Motor", "Bridge Builder", "Pulley System", "Gear Train", "Catapult Pro",
      "Robotic Arm", "Wind Turbine", "Suspension Bridge", "Compound Machine", "Final Project"
    ];
    const chapterIndex = (chapterId - 1) % 30;
    return titles[chapterIndex] || `Chapter ${chapterId}`;
  };

  const getRoleBadgeStyle = (role: string | null) => {
    switch (role) {
      case 'admin': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'teacher': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center overflow-hidden cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeStyle(userRole)}`}>
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'Student'}
              </div>
              
              <CardDescription className="text-gray-400 mt-2">
                {user?.email}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-200">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Stats & Progress */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Learning Progress
              </CardTitle>
              <CardDescription className="text-gray-400">
                Track your completed chapters and achievements
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-400">{completedChapters.length}</div>
                  <div className="text-sm text-gray-400">Chapters Done</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {new Set(completedChapters.map(c => c.grade_id)).size}
                  </div>
                  <div className="text-sm text-gray-400">Grades Explored</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    {completedChapters.length >= 10 ? '🏆' : completedChapters.length >= 5 ? '🥈' : '🌟'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {completedChapters.length >= 10 ? 'Champion' : completedChapters.length >= 5 ? 'Explorer' : 'Beginner'}
                  </div>
                </div>
              </div>

              {/* Completed Chapters List */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Completed Chapters
                </h3>
                
                {completedChapters.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {completedChapters.map((chapter) => (
                      <div 
                        key={chapter.id}
                        className="bg-white/5 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white font-medium">
                            {getChapterTitle(chapter.chapter_id, chapter.grade_id)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {getGradeLabel(chapter.grade_id)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(chapter.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <p className="text-gray-400">
                      No chapters completed yet. Start your learning journey!
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="mt-4 border-white/20 text-white hover:bg-white/10"
                    >
                      Explore Chapters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
