import { MobilePhoneCard } from "@/components/school/MobilePhoneCard";
import { SchoolShell } from "@/components/school/SchoolShell";
import { mobileScreens } from "@/data/mockSchoolData";

export default function MobileAppPreview() {
  return (
    <SchoolShell
      title="Mobile / PWA Screens"
      description="Responsive React screens for parent, student, and robotics AI mobile flows."
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {mobileScreens.map((screen) => (
          <MobilePhoneCard key={screen.title} title={screen.title} lines={screen.lines} />
        ))}
        <MobilePhoneCard
          title="Robotics AI flow"
          lines={["Story mission", "Build checklist 72%", "AI verification 82%", "Challenge unlocked"]}
        />
      </div>
    </SchoolShell>
  );
}
