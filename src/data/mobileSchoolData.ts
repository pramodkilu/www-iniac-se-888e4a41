import {
  Award,
  Banknote,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Home,
  LucideIcon,
  MessageSquareText,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";

export type MobileFlowKey = "parent" | "student" | "staff" | "robotics";

export type MobileMetric = {
  label: string;
  value: string;
  tone?: string;
};

export type MobileListItem = {
  title: string;
  meta: string;
  status?: string;
  tone?: string;
};

export type MobileAction = {
  label: string;
  icon: LucideIcon;
};

export type MobileScreenSpec = {
  id: string;
  title: string;
  eyebrow: string;
  greeting: string;
  primaryLabel: string;
  primaryValue: string;
  progress?: number;
  accent: string;
  metrics: MobileMetric[];
  items: MobileListItem[];
  actions: MobileAction[];
};

export type MobileFlowSpec = {
  key: MobileFlowKey;
  title: string;
  description: string;
  route: string;
  screens: MobileScreenSpec[];
};

const parentActions: MobileAction[] = [
  { label: "Home", icon: Home },
  { label: "Pay", icon: Banknote },
  { label: "Chat", icon: MessageSquareText },
  { label: "Profile", icon: UserRound },
];

const studentActions: MobileAction[] = [
  { label: "Home", icon: Home },
  { label: "Courses", icon: Bot },
  { label: "Badges", icon: Award },
  { label: "Rank", icon: Trophy },
];

const staffActions: MobileAction[] = [
  { label: "Today", icon: CalendarDays },
  { label: "Attend", icon: CheckCircle2 },
  { label: "Alerts", icon: Bell },
  { label: "Admin", icon: ShieldCheck },
];

export const mobileFlows: MobileFlowSpec[] = [
  {
    key: "parent",
    title: "Parent App",
    description: "Daily child status, attendance, payments, messages, and profile in a compact mobile flow.",
    route: "/school/mobile/parent",
    screens: [
      {
        id: "parent-home",
        title: "Parent Home",
        eyebrow: "Hello, Priya",
        greeting: "Aarav Sharma",
        primaryLabel: "This week",
        primaryValue: "2 / 2 sessions",
        progress: 88,
        accent: "from-violet-600 to-blue-600",
        metrics: [
          { label: "Attendance", value: "88%" },
          { label: "Progress", value: "72%" },
          { label: "Balance", value: "SEK 0" },
        ],
        items: [
          { title: "AI Image Recognition", meta: "Completed today", status: "Great work", tone: "green" },
          { title: "Robotics Basics", meta: "Tue, 16:00", status: "Upcoming", tone: "blue" },
        ],
        actions: parentActions,
      },
      {
        id: "parent-attendance",
        title: "Attendance",
        eyebrow: "May 2026",
        greeting: "Attendance calendar",
        primaryLabel: "Monthly attendance",
        primaryValue: "18 present",
        progress: 90,
        accent: "from-emerald-500 to-teal-600",
        metrics: [
          { label: "Present", value: "18" },
          { label: "Absent", value: "2" },
          { label: "Late", value: "1" },
        ],
        items: [
          { title: "Robotics Basics", meta: "12 May", status: "Present", tone: "green" },
          { title: "AI Explorers", meta: "08 May", status: "Present", tone: "green" },
          { title: "Build Lab", meta: "03 May", status: "Absent", tone: "orange" },
        ],
        actions: parentActions,
      },
      {
        id: "parent-payments",
        title: "Payments",
        eyebrow: "Invoices",
        greeting: "Fees due",
        primaryLabel: "Current balance",
        primaryValue: "SEK 1,200",
        progress: 55,
        accent: "from-orange-500 to-amber-500",
        metrics: [
          { label: "Paid", value: "3" },
          { label: "Pending", value: "1" },
          { label: "Methods", value: "Swish" },
        ],
        items: [
          { title: "May Robotics", meta: "Due 20 May", status: "Pay now", tone: "orange" },
          { title: "April Robotics", meta: "INV-2404", status: "Paid", tone: "green" },
        ],
        actions: parentActions,
      },
      {
        id: "parent-messages",
        title: "Messages",
        eyebrow: "Parent communication",
        greeting: "Teacher updates",
        primaryLabel: "Unread",
        primaryValue: "2 messages",
        accent: "from-blue-600 to-indigo-600",
        metrics: [
          { label: "Teachers", value: "2" },
          { label: "School", value: "1" },
          { label: "Alerts", value: "3" },
        ],
        items: [
          { title: "John Smith", meta: "Aarav submitted the robot build.", status: "New", tone: "blue" },
          { title: "School Admin", meta: "Competition details shared.", status: "Read", tone: "green" },
        ],
        actions: parentActions,
      },
    ],
  },
  {
    key: "student",
    title: "Student App",
    description: "Courses, progress, leaderboard, achievements, and challenge-based learning for students.",
    route: "/school/mobile/student",
    screens: [
      {
        id: "student-home",
        title: "Student Home",
        eyebrow: "Hi, Aarav",
        greeting: "Continue learning",
        primaryLabel: "Current mission",
        primaryValue: "Robot Sensor Lab",
        progress: 72,
        accent: "from-blue-600 to-cyan-500",
        metrics: [
          { label: "Courses", value: "3" },
          { label: "Badges", value: "9" },
          { label: "Rank", value: "#4" },
        ],
        items: [
          { title: "AI Basics", meta: "Module 3 of 4", status: "Resume", tone: "blue" },
          { title: "Smart Cricket", meta: "Project due Friday", status: "Draft", tone: "orange" },
        ],
        actions: studentActions,
      },
      {
        id: "student-progress",
        title: "Progress",
        eyebrow: "Learning report",
        greeting: "Overall score",
        primaryLabel: "Completion",
        primaryValue: "85%",
        progress: 85,
        accent: "from-violet-600 to-fuchsia-500",
        metrics: [
          { label: "Math", value: "76%" },
          { label: "Robotics", value: "92%" },
          { label: "AI", value: "88%" },
        ],
        items: [
          { title: "Problem solving", meta: "Skill unlocked", status: "Gold", tone: "orange" },
          { title: "Team work", meta: "Peer lab activity", status: "Strong", tone: "green" },
        ],
        actions: studentActions,
      },
      {
        id: "student-leaderboard",
        title: "Leaderboard",
        eyebrow: "Grade 4",
        greeting: "Top builders",
        primaryLabel: "Your rank",
        primaryValue: "#4",
        progress: 68,
        accent: "from-amber-500 to-orange-600",
        metrics: [
          { label: "Points", value: "790" },
          { label: "Streak", value: "5d" },
          { label: "Wins", value: "3" },
        ],
        items: [
          { title: "Maja", meta: "910 pts", status: "#1", tone: "orange" },
          { title: "Oskar", meta: "850 pts", status: "#2", tone: "blue" },
          { title: "Aarav", meta: "790 pts", status: "#4", tone: "green" },
        ],
        actions: studentActions,
      },
      {
        id: "student-achievements",
        title: "Achievements",
        eyebrow: "Badge wallet",
        greeting: "9 badges earned",
        primaryLabel: "Latest badge",
        primaryValue: "AI Explorer",
        progress: 74,
        accent: "from-emerald-500 to-lime-500",
        metrics: [
          { label: "Gold", value: "3" },
          { label: "Silver", value: "4" },
          { label: "Bronze", value: "2" },
        ],
        items: [
          { title: "Fast Builder", meta: "Robot kit assembly", status: "Gold", tone: "orange" },
          { title: "Problem Solver", meta: "Debugged AI model", status: "Silver", tone: "blue" },
        ],
        actions: studentActions,
      },
    ],
  },
  {
    key: "staff",
    title: "Teacher/Admin App",
    description: "A quick operational mobile cockpit for sessions, attendance, alerts, and school admin work.",
    route: "/school/mobile/staff",
    screens: [
      {
        id: "teacher-today",
        title: "Teacher Today",
        eyebrow: "Hello, John",
        greeting: "2 sessions today",
        primaryLabel: "Next class",
        primaryValue: "Robotics Basics",
        progress: 64,
        accent: "from-slate-800 to-violet-700",
        metrics: [
          { label: "Students", value: "24" },
          { label: "Attendance", value: "85%" },
          { label: "Notes", value: "5" },
        ],
        items: [
          { title: "Grade 3-5", meta: "16:00 - 17:00", status: "Start", tone: "blue" },
          { title: "AI Explorers", meta: "17:30 - 18:30", status: "Prepare", tone: "orange" },
        ],
        actions: staffActions,
      },
      {
        id: "admin-pulse",
        title: "Admin Pulse",
        eyebrow: "School admin",
        greeting: "Stockholm Campus",
        primaryLabel: "Today attendance",
        primaryValue: "91%",
        progress: 91,
        accent: "from-blue-700 to-violet-700",
        metrics: [
          { label: "Students", value: "428" },
          { label: "Invoices", value: "62" },
          { label: "Events", value: "4" },
        ],
        items: [
          { title: "New enrollment", meta: "Aarav Sharma", status: "Review", tone: "blue" },
          { title: "Payment reminder", meta: "12 families", status: "Send", tone: "orange" },
        ],
        actions: staffActions,
      },
    ],
  },
  {
    key: "robotics",
    title: "Robotics AI Flow",
    description: "Mobile learning journey from story to build, AI verification, challenge, and result status.",
    route: "/school/mobile/robotics",
    screens: [
      {
        id: "robotics-story",
        title: "Story",
        eyebrow: "The Robot Adventure",
        greeting: "Help Robo cross the field",
        primaryLabel: "Mission",
        primaryValue: "Build sensor rover",
        progress: 25,
        accent: "from-cyan-500 to-blue-600",
        metrics: [
          { label: "Step", value: "1/4" },
          { label: "Parts", value: "8" },
          { label: "Time", value: "20m" },
        ],
        items: [
          { title: "Watch story", meta: "Mission intro", status: "Done", tone: "green" },
          { title: "Collect kit", meta: "Sensors + wheels", status: "Next", tone: "blue" },
        ],
        actions: studentActions,
      },
      {
        id: "robotics-build",
        title: "Build",
        eyebrow: "Build & simulate",
        greeting: "Assemble rover",
        primaryLabel: "Checklist",
        primaryValue: "72%",
        progress: 72,
        accent: "from-violet-600 to-blue-600",
        metrics: [
          { label: "Done", value: "6" },
          { label: "Left", value: "2" },
          { label: "Hints", value: "3" },
        ],
        items: [
          { title: "Mount wheels", meta: "Step 3", status: "Done", tone: "green" },
          { title: "Connect sensor", meta: "Step 4", status: "Active", tone: "blue" },
        ],
        actions: studentActions,
      },
      {
        id: "robotics-ai",
        title: "AI Verify",
        eyebrow: "Camera check",
        greeting: "AI is analyzing",
        primaryLabel: "Accuracy",
        primaryValue: "95%",
        progress: 95,
        accent: "from-emerald-500 to-blue-600",
        metrics: [
          { label: "Wheels", value: "OK" },
          { label: "Sensor", value: "OK" },
          { label: "Software", value: "OK" },
        ],
        items: [
          { title: "Wheel alignment", meta: "Computer vision", status: "Correct", tone: "green" },
          { title: "Cable placement", meta: "Model check", status: "Correct", tone: "green" },
        ],
        actions: studentActions,
      },
      {
        id: "robotics-challenge",
        title: "Challenge",
        eyebrow: "Obstacle track",
        greeting: "Beat your best time",
        primaryLabel: "Status",
        primaryValue: "Unlocked",
        progress: 100,
        accent: "from-orange-500 to-rose-500",
        metrics: [
          { label: "Attempts", value: "2" },
          { label: "Best", value: "48s" },
          { label: "Score", value: "820" },
        ],
        items: [
          { title: "Fastest run", meta: "48 seconds", status: "New best", tone: "orange" },
          { title: "Certificate", meta: "Available after submit", status: "Ready", tone: "blue" },
        ],
        actions: studentActions,
      },
    ],
  },
];

export const getMobileFlow = (key?: string) =>
  mobileFlows.find((flow) => flow.key === key) ?? mobileFlows[0];
