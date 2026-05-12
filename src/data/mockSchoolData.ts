import {
  Banknote,
  BookOpenCheck,
  Bot,
  CalendarDays,
  GraduationCap,
  Library,
  LucideIcon,
  MessageSquareText,
  School,
  ShieldCheck,
  Trophy,
  UserRound,
  UsersRound,
} from "lucide-react";

export type SchoolRole = "super-admin" | "school-admin" | "teacher" | "parent" | "student";

export type Kpi = {
  label: string;
  value: string;
  detail: string;
  tone: string;
};

export type SchoolNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const roles = [
  {
    id: "super-admin",
    title: "Super Admin",
    description: "Manage schools, plans, permissions, and platform analytics.",
    icon: ShieldCheck,
    tone: "bg-violet-100 text-violet-700",
  },
  {
    id: "school-admin",
    title: "School Admin",
    description: "Manage programs, batches, teachers, students, and parents.",
    icon: School,
    tone: "bg-blue-100 text-blue-700",
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Run sessions, mark attendance, and update student progress.",
    icon: GraduationCap,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "parent",
    title: "Parent",
    description: "Track attendance, payments, updates, and events.",
    icon: UserRound,
    tone: "bg-orange-100 text-orange-700",
  },
  {
    id: "student",
    title: "Student",
    description: "Continue lessons, submit projects, and earn achievements.",
    icon: Trophy,
    tone: "bg-pink-100 text-pink-700",
  },
] as const;

export const schoolNavItems: SchoolNavItem[] = [
  { label: "Overview", href: "/school", icon: School },
  { label: "Super Admin", href: "/school/dashboard/super-admin", icon: ShieldCheck },
  { label: "School Admin", href: "/school/dashboard/school-admin", icon: UsersRound },
  { label: "Teacher", href: "/school/dashboard/teacher", icon: GraduationCap },
  { label: "Parent", href: "/school/dashboard/parent", icon: UserRound },
  { label: "Student", href: "/school/dashboard/student", icon: Trophy },
  { label: "Attendance", href: "/school/modules/attendance", icon: CalendarDays },
  { label: "Payments", href: "/school/modules/payments", icon: Banknote },
  { label: "Courses", href: "/school/modules/courses", icon: BookOpenCheck },
  { label: "Messages", href: "/school/modules/messages", icon: MessageSquareText },
  { label: "Calendar", href: "/school/modules/calendar", icon: CalendarDays },
  { label: "Timetable", href: "/school/modules/timetable", icon: CalendarDays },
  { label: "Library", href: "/school/modules/library", icon: Library },
  { label: "Robotics AI", href: "/school/robotics", icon: Bot },
  { label: "Reports", href: "/school/reports", icon: Trophy },
  { label: "Mobile PWA", href: "/school/mobile", icon: UserRound },
  { label: "Architecture", href: "/school/architecture", icon: School },
];

export const dashboardContent: Record<
  SchoolRole,
  {
    title: string;
    subtitle: string;
    welcome: string;
    kpis: Kpi[];
    actions: string[];
  }
> = {
  "super-admin": {
    title: "Super Admin Dashboard",
    subtitle: "Platform-wide control for schools, users, programs, and revenue.",
    welcome: "Good morning, INIAC operations. All campuses are online.",
    actions: ["Add school", "Invite admin", "Review reports", "Open billing"],
    kpis: [
      { label: "Schools", value: "12", detail: "+2 onboarding", tone: "bg-violet-50 text-violet-700" },
      { label: "Students", value: "4,820", detail: "+14% this term", tone: "bg-blue-50 text-blue-700" },
      { label: "Active programs", value: "68", detail: "8 categories", tone: "bg-emerald-50 text-emerald-700" },
      { label: "Monthly revenue", value: "SEK 842k", detail: "91% collected", tone: "bg-orange-50 text-orange-700" },
    ],
  },
  "school-admin": {
    title: "School Admin Dashboard",
    subtitle: "Run programs, batches, users, payments, and parent updates.",
    welcome: "Welcome back, Stockholm Campus. Robotics has two sessions today.",
    actions: ["Create batch", "Import students", "Send update", "Review invoices"],
    kpis: [
      { label: "Students", value: "428", detail: "+18 this term", tone: "bg-blue-50 text-blue-700" },
      { label: "Teachers", value: "24", detail: "6 programs", tone: "bg-violet-50 text-violet-700" },
      { label: "Attendance", value: "91%", detail: "today average", tone: "bg-emerald-50 text-emerald-700" },
      { label: "Open invoices", value: "62", detail: "SEK 184k", tone: "bg-orange-50 text-orange-700" },
    ],
  },
  teacher: {
    title: "Teacher Dashboard",
    subtitle: "Manage sessions, attendance, curriculum, and progress.",
    welcome: "Hi John. You have 2 sessions and 5 progress notes pending.",
    actions: ["Mark attendance", "Open lesson", "Add progress", "Message parents"],
    kpis: [
      { label: "Today's sessions", value: "2", detail: "Robotics + AI", tone: "bg-violet-50 text-violet-700" },
      { label: "Students", value: "52", detail: "assigned", tone: "bg-blue-50 text-blue-700" },
      { label: "Attendance", value: "85%", detail: "last session", tone: "bg-emerald-50 text-emerald-700" },
      { label: "Pending notes", value: "5", detail: "parent-visible", tone: "bg-orange-50 text-orange-700" },
    ],
  },
  parent: {
    title: "Parent Dashboard",
    subtitle: "Follow your child’s attendance, progress, payments, and updates.",
    welcome: "Hello Priya. Aarav completed the AI image recognition activity.",
    actions: ["View update", "Check invoice", "Open calendar", "Message teacher"],
    kpis: [
      { label: "Attendance", value: "88%", detail: "this month", tone: "bg-emerald-50 text-emerald-700" },
      { label: "Sessions", value: "2/2", detail: "this week", tone: "bg-blue-50 text-blue-700" },
      { label: "Progress", value: "72%", detail: "Robotics Basics", tone: "bg-violet-50 text-violet-700" },
      { label: "Balance", value: "SEK 0", detail: "paid", tone: "bg-orange-50 text-orange-700" },
    ],
  },
  student: {
    title: "Student Dashboard",
    subtitle: "Continue courses, complete challenges, and collect achievements.",
    welcome: "Hi Aarav. Your next challenge is Smart Cricket Counter.",
    actions: ["Continue lesson", "Submit project", "View badges", "Join challenge"],
    kpis: [
      { label: "Courses", value: "3", detail: "active", tone: "bg-blue-50 text-blue-700" },
      { label: "Progress", value: "72%", detail: "current module", tone: "bg-violet-50 text-violet-700" },
      { label: "Badges", value: "9", detail: "3 gold", tone: "bg-orange-50 text-orange-700" },
      { label: "Rank", value: "#4", detail: "class leaderboard", tone: "bg-emerald-50 text-emerald-700" },
    ],
  },
};

export const recentActivities = [
  "Aarav completed AI Image Recognition.",
  "Robotics Basics attendance submitted.",
  "Parent update sent to Grade 4 families.",
  "Invoice batch generated for May.",
  "Drone Innovators challenge published.",
];

export const upcomingEvents = [
  { title: "Robotics Basics", date: "Tue 16:00", meta: "Grade 3-5" },
  { title: "AI Explorers", date: "Thu 17:30", meta: "Grade 6-8" },
  { title: "Robotics Competition", date: "20 May", meta: "Campus Hall" },
];

export const moduleRows = {
  attendance: [
    ["Robotics Basics", "24", "21 present", "87%"],
    ["AI Explorers", "28", "25 present", "89%"],
    ["Cricket Academy", "20", "17 present", "85%"],
  ],
  payments: [
    ["Aarav Sharma", "Robotics Basics", "SEK 1,200", "Paid"],
    ["Maja Lind", "AI Explorers", "SEK 1,450", "Pending"],
    ["Oskar Berg", "Cricket Academy", "SEK 950", "Overdue"],
  ],
  courses: [
    ["AI Basics", "4 modules", "72%", "Active"],
    ["Robotics Basics", "8 lessons", "64%", "Active"],
    ["Smart Cricket", "3 projects", "41%", "Draft"],
  ],
  messages: [
    ["Priya Sharma", "Progress update", "Read", "Today"],
    ["John Smith", "Attendance note", "Unread", "Today"],
    ["School Office", "Competition details", "Sent", "Yesterday"],
  ],
  calendar: [
    ["Robotics Basics", "Tue", "16:00-17:00", "Room A"],
    ["AI Explorers", "Thu", "17:30-18:30", "Lab 2"],
    ["Parent Meetings", "Fri", "14:00-16:00", "North Wing"],
  ],
  timetable: [
    ["Monday", "AI Basics", "15:30", "Teacher John"],
    ["Wednesday", "Robotics Build", "16:00", "Teacher Sofia"],
    ["Friday", "Challenge Lab", "17:00", "Teacher John"],
  ],
  library: [
    ["AI Basics Guide", "PDF", "Beginner", "Published"],
    ["Robot Build Sheet", "Checklist", "Grade 3-5", "Published"],
    ["Cricket Counter Template", "Project", "Draft", "Review"],
  ],
};

export const mobileScreens = [
  {
    title: "Parent home",
    lines: ["Aarav Sharma", "Attendance 88%", "Latest update: AI project complete"],
  },
  {
    title: "Parent attendance",
    lines: ["May attendance", "18 present", "2 absent"],
  },
  {
    title: "Parent payments",
    lines: ["May invoice", "SEK 1,200", "Paid"],
  },
  {
    title: "Parent messages",
    lines: ["Teacher John", "Progress note", "Robotics event reminder"],
  },
  {
    title: "Student courses",
    lines: ["AI Basics", "Robotics Basics", "Smart Cricket Counter"],
  },
  {
    title: "Leaderboard",
    lines: ["#1 Maja", "#2 Oskar", "#4 Aarav"],
  },
];

export const analyticsData = [
  { month: "Jan", attendance: 72, performance: 68, revenue: 42 },
  { month: "Feb", attendance: 81, performance: 74, revenue: 55 },
  { month: "Mar", attendance: 86, performance: 79, revenue: 61 },
  { month: "Apr", attendance: 78, performance: 83, revenue: 73 },
  { month: "May", attendance: 91, performance: 88, revenue: 84 },
];
