import { Navigate, useParams } from "react-router-dom";
import { ActivityAndEvents, KpiGrid, WelcomeCard } from "@/components/school/SchoolCards";
import { SchoolShell } from "@/components/school/SchoolShell";
import { SchoolRole, dashboardContent } from "@/data/mockSchoolData";

const validRoles = new Set(["super-admin", "school-admin", "teacher", "parent", "student"]);

export default function DashboardRolePage() {
  const { role } = useParams();

  if (!role || !validRoles.has(role)) {
    return <Navigate to="/school/roles" replace />;
  }

  const content = dashboardContent[role as SchoolRole];

  return (
    <SchoolShell title={content.title} description={content.subtitle}>
      <div className="space-y-6">
        <WelcomeCard welcome={content.welcome} actions={content.actions} />
        <KpiGrid kpis={content.kpis} />
        <ActivityAndEvents />
      </div>
    </SchoolShell>
  );
}
