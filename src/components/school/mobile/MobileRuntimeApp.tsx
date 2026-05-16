import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { type MobileFlowKey } from "@/data/mobileSchoolData";
import { useSchoolOperations } from "@/hooks/useSchoolOperations";
import { ParentApp } from "@/components/school/mobile/runtime/ParentApp";
import { RoboticsApp } from "@/components/school/mobile/runtime/RoboticsApp";
import { StaffApp } from "@/components/school/mobile/runtime/StaffApp";
import { StudentApp } from "@/components/school/mobile/runtime/StudentApp";

export function MobileRuntimeApp({ flow }: { flow: MobileFlowKey }) {
  const [searchParams] = useSearchParams();
  const { students, defaultSchoolId } = useSchoolOperations({ previewOnly: true });
  const student = useMemo(() => students[0], [students]);
  const initialTab = searchParams.get("tab") ?? undefined;

  if (flow === "robotics") return <RoboticsApp initialTab={initialTab} />;
  if (flow === "staff") return <StaffApp defaultSchoolId={defaultSchoolId} initialTab={initialTab} />;
  if (!student) return null;
  if (flow === "student") return <StudentApp student={student} defaultSchoolId={defaultSchoolId} initialTab={initialTab} />;
  return <ParentApp student={student} defaultSchoolId={defaultSchoolId} initialTab={initialTab} />;
}
