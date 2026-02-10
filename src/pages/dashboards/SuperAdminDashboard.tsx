import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Users, ShieldCheck, BookOpen, UserCheck, Trash2 } from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [completedChapters, setCompletedChapters] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || (userRole !== 'super_admin'))) {
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'super_admin') fetchAll();
  }, [user, userRole]);

  const fetchAll = async () => {
    setDataLoading(true);
    const [p, r, reg, cc] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
      supabase.from('roboliga_registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('completed_chapters').select('*'),
    ]);
    setProfiles(p.data || []);
    setRoles(r.data || []);
    setRegistrations(reg.data || []);
    setCompletedChapters(cc.data || []);
    setDataLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin' | 'super_admin') => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);
    if (error) {
      toast.error('Failed to update role');
    } else {
      toast.success('Role updated');
      fetchAll();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Only delete profile and role (can't delete auth.users from client)
    toast.info('User data cleared. Auth user must be removed from the backend.');
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('user_id', userId);
    fetchAll();
  };

  if (loading || dataLoading) {
    return (
      <DashboardLayout title="Super Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  const userMap = new Map(profiles.map(p => [p.user_id, p]));
  const roleMap = new Map(roles.map(r => [r.user_id, r]));

  return (
    <DashboardLayout title="Super Admin Dashboard" description="Full system control — manage users, roles, registrations, and analytics.">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: profiles.length, icon: Users, color: 'text-cyan-400' },
          { label: 'Roles Assigned', value: roles.length, icon: ShieldCheck, color: 'text-orange-400' },
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

      {/* Users & Roles Table */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-white">All Users & Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">User ID</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => {
                  const role = roleMap.get(profile.user_id);
                  return (
                    <TableRow key={profile.user_id} className="border-white/10">
                      <TableCell className="text-white">{profile.full_name || '—'}</TableCell>
                      <TableCell className="text-gray-400 text-xs font-mono">{profile.user_id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <Select
                          value={role?.role || 'student'}
                          onValueChange={(val: 'student' | 'teacher' | 'admin' | 'super_admin') => handleRoleChange(profile.user_id, val)}
                        >
                          <SelectTrigger className="w-36 bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(profile.user_id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Registrations */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent RoboLiga Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Team</TableHead>
                  <TableHead className="text-gray-400">School</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.slice(0, 10).map((reg) => (
                  <TableRow key={reg.id} className="border-white/10">
                    <TableCell className="text-white">{reg.team_name}</TableCell>
                    <TableCell className="text-gray-400">{reg.school_name}</TableCell>
                    <TableCell className="text-gray-400">{reg.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reg.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        reg.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {reg.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">{new Date(reg.created_at).toLocaleDateString()}</TableCell>
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

export default SuperAdminDashboard;
