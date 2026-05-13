import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import Chapter from "./pages/Chapter";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import RoboLigaRegister from "./pages/RoboLigaRegister";
import Education from "./pages/Education";
import Programs from "./pages/Programs";
import Curriculum from "./pages/Curriculum";
import KitPlanning from "./pages/KitPlanning";
import AIResearch from "./pages/AIResearch";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import TeacherStudents from "./pages/dashboards/teacher/TeacherStudents";
import TeacherProgress from "./pages/dashboards/teacher/TeacherProgress";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import SchoolPlatformOverview from "./pages/school/SchoolPlatformOverview";
import SignUp from "./pages/school/SignUp";
import RoleSelection from "./pages/school/RoleSelection";
import DashboardRolePage from "./pages/school/DashboardRolePage";
import Students from "./pages/school/Students";
import ProgramsBatches from "./pages/school/ProgramsBatches";
import EnrollmentsSessions from "./pages/school/EnrollmentsSessions";
import Attendance from "./pages/school/modules/Attendance";
import Payments from "./pages/school/modules/Payments";
import Courses from "./pages/school/modules/Courses";
import Messages from "./pages/school/modules/Messages";
import SchoolCalendar from "./pages/school/modules/Calendar";
import Timetable from "./pages/school/modules/Timetable";
import Library from "./pages/school/modules/Library";
import RoboticsLearning from "./pages/school/robotics/RoboticsLearning";
import MobileAppPreview from "./pages/school/mobile/MobileAppPreview";
import MobileRolePreview from "./pages/school/mobile/MobileRolePreview";
import AnalyticsReports from "./pages/school/reports/AnalyticsReports";
import SystemArchitecture from "./pages/school/SystemArchitecture";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chapter/:id" element={<Chapter />} />
              <Route path="/roboliga/register" element={<RoboLigaRegister />} />
              <Route path="/education" element={<Education />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/kit-planning" element={<KitPlanning />} />
              <Route path="/ai-research" element={<AIResearch />} />
              {/* EduFlex-style school platform UI flow */}
              <Route path="/school" element={<SchoolPlatformOverview />} />
              <Route path="/school/signup" element={<SignUp />} />
              <Route path="/school/roles" element={<RoleSelection />} />
              <Route path="/school/dashboard/:role" element={<DashboardRolePage />} />
              <Route path="/school/students" element={<Students />} />
              <Route path="/school/programs" element={<ProgramsBatches />} />
              <Route path="/school/enrollments" element={<EnrollmentsSessions />} />
              <Route path="/school/modules/attendance" element={<Attendance />} />
              <Route path="/school/modules/payments" element={<Payments />} />
              <Route path="/school/modules/courses" element={<Courses />} />
              <Route path="/school/modules/messages" element={<Messages />} />
              <Route path="/school/modules/calendar" element={<SchoolCalendar />} />
              <Route path="/school/modules/timetable" element={<Timetable />} />
              <Route path="/school/modules/library" element={<Library />} />
              <Route path="/school/robotics" element={<RoboticsLearning />} />
              <Route path="/school/mobile" element={<MobileAppPreview />} />
              <Route path="/school/mobile/:flow" element={<MobileRolePreview />} />
              <Route path="/school/reports" element={<AnalyticsReports />} />
              <Route path="/school/architecture" element={<SystemArchitecture />} />
              {/* Dashboard routes */}
              <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<TeacherStudents />} />
              <Route path="/teacher/progress" element={<TeacherProgress />} />
              <Route path="/teacher/*" element={<TeacherDashboard />} />
              <Route path="/student/*" element={<StudentDashboard />} />
              {/* Placeholder pages for header nav links */}
              <Route path="/innovation" element={<ComingSoon />} />
              <Route path="/partners"   element={<ComingSoon />} />
              <Route path="/about"      element={<ComingSoon />} />
              <Route path="/contact"    element={<ComingSoon />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
