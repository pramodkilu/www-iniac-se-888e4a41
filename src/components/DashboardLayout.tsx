import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, Users, BookOpen, Trophy, Settings,
  ShieldCheck, GraduationCap, UserCheck, ArrowLeft, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const roleNavItems: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  super_admin: [
    { label: 'Overview', href: '/super-admin', icon: LayoutDashboard },
    { label: 'All Users', href: '/super-admin/users', icon: Users },
    { label: 'Roles', href: '/super-admin/roles', icon: ShieldCheck },
    { label: 'Registrations', href: '/super-admin/registrations', icon: UserCheck },
    { label: 'Analytics', href: '/super-admin/analytics', icon: Trophy },
  ],
  admin: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Registrations', href: '/admin/registrations', icon: UserCheck },
    { label: 'Analytics', href: '/admin/analytics', icon: Trophy },
  ],
  teacher: [
    { label: 'Overview', href: '/teacher', icon: LayoutDashboard },
    { label: 'Students', href: '/teacher/students', icon: GraduationCap },
    { label: 'Progress', href: '/teacher/progress', icon: BookOpen },
  ],
  student: [
    { label: 'Overview', href: '/student', icon: LayoutDashboard },
    { label: 'My Progress', href: '/student/progress', icon: BookOpen },
    { label: 'Achievements', href: '/student/achievements', icon: Trophy },
  ],
};

const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  const { userRole, signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = roleNavItems[userRole || 'student'] || roleNavItems.student;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleBadge = () => {
    const styles: Record<string, string> = {
      super_admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      admin: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      teacher: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      student: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };
    return styles[userRole || 'student'] || styles.student;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-900/95 backdrop-blur-md border-b border-white/10 flex items-center px-4">
        <Link to="/" className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight hidden sm:inline">INIAC</span>
        </Link>

        <h1 className="text-white font-semibold text-lg flex-1">{title}</h1>

        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full border ${getRoleBadge()}`}>
            {(userRole || 'student').replace('_', ' ')}
          </span>
          <span className="text-sm text-gray-400 hidden md:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-gray-400 hover:text-white hover:bg-white/10">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-56 bg-slate-900/80 backdrop-blur-md border-r border-white/10 p-4 hidden md:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-white/10 flex md:hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="flex-1 md:ml-56 p-6 pb-24 md:pb-6">
          {description && (
            <p className="text-gray-400 mb-6">{description}</p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
