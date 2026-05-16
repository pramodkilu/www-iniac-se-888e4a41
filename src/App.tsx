import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";

const Chapter = lazy(() => import("./pages/Chapter"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const RoboLigaRegister = lazy(() => import("./pages/RoboLigaRegister"));
const Education = lazy(() => import("./pages/Education"));
const Programs = lazy(() => import("./pages/Programs"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const KitPlanning = lazy(() => import("./pages/KitPlanning"));
const AIResearch = lazy(() => import("./pages/AIResearch"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const SuperAdminDashboard = lazy(() => import("./pages/dashboards/SuperAdminDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
const TeacherDashboard = lazy(() => import("./pages/dashboards/TeacherDashboard"));
const TeacherStudents = lazy(() => import("./pages/dashboards/teacher/TeacherStudents"));
const TeacherProgress = lazy(() => import("./pages/dashboards/teacher/TeacherProgress"));
const StudentDashboard = lazy(() => import("./pages/dashboards/StudentDashboard"));
const SchoolPlatformOverview = lazy(() => import("./pages/school/SchoolPlatformOverview"));
const SignUp = lazy(() => import("./pages/school/SignUp"));
const RoleSelection = lazy(() => import("./pages/school/RoleSelection"));
const DashboardRolePage = lazy(() => import("./pages/school/DashboardRolePage"));
const Students = lazy(() => import("./pages/school/Students"));
const ProgramsBatches = lazy(() => import("./pages/school/ProgramsBatches"));
const EnrollmentsSessions = lazy(() => import("./pages/school/EnrollmentsSessions"));
const Attendance = lazy(() => import("./pages/school/modules/Attendance"));
const Payments = lazy(() => import("./pages/school/modules/Payments"));
const Courses = lazy(() => import("./pages/school/modules/Courses"));
const Messages = lazy(() => import("./pages/school/modules/Messages"));
const SchoolCalendar = lazy(() => import("./pages/school/modules/Calendar"));
const Timetable = lazy(() => import("./pages/school/modules/Timetable"));
const Library = lazy(() => import("./pages/school/modules/Library"));
const RoboticsLearning = lazy(() => import("./pages/school/robotics/RoboticsLearning"));
const MobileAppPreview = lazy(() => import("./pages/school/mobile/MobileAppPreview"));
const MobileRolePreview = lazy(() => import("./pages/school/mobile/MobileRolePreview"));
const AnalyticsReports = lazy(() => import("./pages/school/reports/AnalyticsReports"));
const SystemArchitecture = lazy(() => import("./pages/school/SystemArchitecture"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-background p-6 text-sm font-medium text-muted-foreground">Loading...</div>}>
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
                <Route path="/partners" element={<ComingSoon />} />
                <Route path="/about" element={<ComingSoon />} />
                <Route path="/contact" element={<ComingSoon />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
