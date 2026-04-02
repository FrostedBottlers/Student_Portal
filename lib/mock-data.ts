export const mockStudent = {
  name: "Rahul Sharma",
  studentId: "RA2211003010234",
  registerNo: "312223104089",
  email: "rs7890@srmist.edu.in",
  institution: "Faculty of Engineering and Technology",
  program: "B.Tech Computer Science and Engineering",
  combo: "CSE-A",
  batch: "2022-2026",
  roomNo: "B-204",
  section: "A",
  facultyAdvisor: "Dr. Priya Venkatesh",
  academicAdvisor: "Prof. Arun Kumar",
  attendance: 87,
  cgpa: 8.45,
  credits: 142,
  totalCredits: 180,
  dueAmount: 0,
  semester: 6,
  year: 3,
}

export const mockNotifications = [
  {
    id: 1,
    title: "Fee Payment Reminder",
    message: "Semester 6 fee payment deadline is April 15, 2026",
    date: "2026-04-01",
    type: "warning" as const,
  },
  {
    id: 2,
    title: "Exam Schedule Released",
    message: "End semester examination schedule has been published",
    date: "2026-03-28",
    type: "info" as const,
  },
  {
    id: 3,
    title: "Attendance Alert",
    message: "Your attendance in CS3501 is below 75%",
    date: "2026-03-25",
    type: "error" as const,
  },
  {
    id: 4,
    title: "Grade Sheet Available",
    message: "Semester 5 grade sheet is now available for download",
    date: "2026-03-20",
    type: "success" as const,
  },
]

export const mockUpcomingExams = [
  {
    id: 1,
    subject: "Database Management Systems",
    code: "CS3502",
    date: "2026-04-20",
    time: "09:00 AM",
    venue: "Block A - Hall 3",
  },
  {
    id: 2,
    subject: "Computer Networks",
    code: "CS3504",
    date: "2026-04-22",
    time: "02:00 PM",
    venue: "Block B - Hall 1",
  },
  {
    id: 3,
    subject: "Operating Systems",
    code: "CS3503",
    date: "2026-04-25",
    time: "09:00 AM",
    venue: "Block A - Hall 2",
  },
]

export const mockCourses = [
  {
    code: "CS3501",
    name: "Machine Learning",
    credits: 4,
    attendance: 82,
    internal: 42,
    maxInternal: 50,
    faculty: "Dr. Srinivas Rao",
  },
  {
    code: "CS3502",
    name: "Database Management Systems",
    credits: 4,
    attendance: 91,
    internal: 45,
    maxInternal: 50,
    faculty: "Prof. Meena Kumari",
  },
  {
    code: "CS3503",
    name: "Operating Systems",
    credits: 4,
    attendance: 78,
    internal: 38,
    maxInternal: 50,
    faculty: "Dr. Vijay Kumar",
  },
  {
    code: "CS3504",
    name: "Computer Networks",
    credits: 3,
    attendance: 95,
    internal: 47,
    maxInternal: 50,
    faculty: "Prof. Anitha Reddy",
  },
  {
    code: "CS3505",
    name: "Software Engineering",
    credits: 3,
    attendance: 88,
    internal: 44,
    maxInternal: 50,
    faculty: "Dr. Ramesh Babu",
  },
]

export const sidebarNavigation = [
  {
    group: "Main",
    items: [
      { name: "Dashboard", href: "/portal/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    group: "Academic",
    items: [
      { name: "Course Status", href: "/portal/course-status", icon: "BookOpen" },
      { name: "Grade / Mark & Credit", href: "/portal/grades", icon: "GraduationCap" },
      { name: "Attendance Details", href: "/portal/attendance", icon: "CalendarCheck" },
      { name: "Internal Mark Details", href: "/portal/internal-marks", icon: "ClipboardList" },
      { name: "Timetable", href: "/portal/timetable", icon: "Clock" },
      { name: "Exam Time Table", href: "/portal/exam-timetable", icon: "Calendar" },
      { name: "Exam HallTicket", href: "/portal/hall-ticket", icon: "Ticket" },
      { name: "Exam Provisional Results", href: "/portal/provisional-results", icon: "FileText" },
      { name: "Exam Revaluation Results", href: "/portal/revaluation-results", icon: "FileSearch" },
      { name: "Review/Revaluation/Retest Registration", href: "/portal/revaluation-registration", icon: "FilePen" },
      { name: "Summer Term / Compensatory Registration", href: "/portal/summer-registration", icon: "Mail" },
    ],
  },
  {
    group: "Financial",
    items: [
      { name: "Fee Payment", href: "/portal/fee-payment", icon: "CreditCard" },
      { name: "Finance Details", href: "/portal/finance-details", icon: "Landmark" },
      { name: "Stipend Request", href: "/portal/stipend-request", icon: "FileText" },
    ],
  },
  {
    group: "Services",
    items: [
      { name: "Personal Details", href: "/portal/personal-details", icon: "User" },
      { name: "Service Request", href: "/portal/service-request", icon: "FileText" },
      { name: "Transcript", href: "/portal/transcript", icon: "FileText" },
      { name: "ABC ID Generation", href: "/portal/abc-id", icon: "IdCard" },
    ],
  },
  {
    group: "Hostel & Transport",
    items: [
      { name: "Hostel Booking", href: "/portal/hostel-booking", icon: "Building" },
      { name: "Hostel Details", href: "/portal/hostel-details", icon: "Building" },
      { name: "Transport Booking", href: "/portal/transport-booking", icon: "Bus" },
      { name: "Transport Details", href: "/portal/transport-details", icon: "Bus" },
    ],
  },
  {
    group: "Others",
    items: [
      { name: "Notice Board", href: "/portal/notice-board", icon: "Bell" },
      { name: "Placement Insight Dashboard", href: "/portal/placement-insights", icon: "BarChart3" },
      { name: "Student Review Feedback", href: "/portal/student-feedback", icon: "MessageSquare" },
    ],
  },
]
