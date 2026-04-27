import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Users, ShieldCheck, BookOpen, UserCheck, Trash2, KeyRound, Mail } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  provider: string;
}

const SuperAdminDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [completedChapters, setCompletedChapters] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Password change dialog
  const [pwDialog, setPwDialog] = useState<{ open: boolean; user: AuthUser | null }>({ open: false, user: null });
  const [newPw, setNewPw] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'super_admin')) {
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'super_admin') fetchAll();
  }, [user, userRole]);

  const fetchAll = async () => {
    setDataLoading(true);
    const [p, r, reg, cc, au] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
      supabase.from('roboliga_registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('completed_chapters').select('*'),
      supabase.functions.invoke('admin-users', { body: { action: 'list' } }),
    ]);
    setProfiles(p.data || []);
    setRoles(r.data || []);
    setRegistrations(reg.data || []);
    setCompletedChapters(cc.data || []);
    if (au.error) {
      console.error('admin-users list error:', au.error);
      toast.error('Failed to load auth users');
    } else {
      setAuthUsers((au.data as any)?.users || []);
    }
    setDataLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin' | 'super_admin') => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);
    if (error) toast.error('Failed to update role');
    else {
      toast.success('Role updated');
      fetchAll();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    toast.info('User data cleared. Auth user must be removed from the backend.');
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('user_id', userId);
    fetchAll();
  };

  const openPwDialog = (u: AuthUser) => {
    setNewPw('');
    setPwDialog({ open: true, user: u });
  };

  const handleSetPassword = async () => {
    if (!pwDialog.user) return;
    if (newPw.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwSubmitting(true);
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'set_password', user_id: pwDialog.user.id, password: newPw },
    });
    setPwSubmitting(false);
    if (error) {
      toast.error(error.message || 'Failed to update password');
    } else {
      toast.success(`Password updated for ${pwDialog.user.email}`);
      setPwDialog({ open: false, user: null });
      setNewPw('');
    }
  };

  const handleSendReset = async (u: AuthUser) => {
    const { error } = await supabase.functions.invoke('admin-users', {
      body: {
        action: 'send_reset',
        email: u.email,
        redirect_to: `${window.location.origin}/reset-password`,
      },
    });
    if (error) toast.error(error.message || 'Failed to send reset email');
    else toast.success(`Reset link sent to ${u.email}`);
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

  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));
  const roleMap = new Map(roles.map((r) => [r.user_id, r]));

  const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : '—');

  return (
    <DashboardLayout title="Super Admin Dashboard" description="Full system control — manage users, roles, registrations, and analytics.">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: authUsers.length, icon: Users, color: 'text-cyan-400' },
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

      {/* All Users with Login Info */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-white">All Users — Login Activity & Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Provider</TableHead>
                  <TableHead className="text-gray-400">Last Sign-In</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authUsers.map((u) => {
                  const profile = profileMap.get(u.id);
                  const role = roleMap.get(u.id);
                  return (
                    <TableRow key={u.id} className="border-white/10">
                      <TableCell className="text-white">{profile?.full_name || '—'}</TableCell>
                      <TableCell className="text-gray-300">{u.email}</TableCell>
                      <TableCell className="text-gray-400 text-xs capitalize">{u.provider}</TableCell>
                      <TableCell className="text-gray-400 text-xs">{fmt(u.last_sign_in_at)}</TableCell>
                      <TableCell className="text-gray-400 text-xs">{fmt(u.created_at)}</TableCell>
                      <TableCell>
                        <Select
                          value={role?.role || 'student'}
                          onValueChange={(val: 'student' | 'teacher' | 'admin' | 'super_admin') => handleRoleChange(u.id, val)}
                        >
                          <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openPwDialog(u)}
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                            title="Change password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSendReset(u)}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                            title="Send reset email"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Delete profile data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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

      {/* Change password dialog */}
      <Dialog open={pwDialog.open} onOpenChange={(open) => setPwDialog({ open, user: open ? pwDialog.user : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Set a new password for <span className="font-medium">{pwDialog.user?.email}</span>. The user will be able to sign in with the new password immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              type="text"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="At least 6 characters"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwDialog({ open: false, user: null })}>
              Cancel
            </Button>
            <Button onClick={handleSetPassword} disabled={pwSubmitting || newPw.length < 6}>
              {pwSubmitting ? 'Updating...' : 'Update password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
