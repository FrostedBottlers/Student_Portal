"use client";

import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "./components/ThemeProvider";

// Dummy Profile Data
const studentProfile = {
  name: "jd1234",
  role: "STUDENT",
  initials: "J",
  attendance: 90,
  conducted: 400,
  present: 360,
  margin: 26,
  internalMarks: 42,
  internalTotal: 50,
  grade: "A+",
  targetScore: 85,
  targetNeeded: 43
};

const navigationLinks = [
  "Fee Payment", "Personal Details", "Course Status", "Grade / Mark & Credit",
  "Attendance Details", "Exam Revaluation Results", "Exam Provisional Results",
  "Exam Time Table", "Internal Mark Details", "Hostel Booking", "Hostel Details",
  "Transport Details", "Finance Details", "Notice Board", "ABC ID Generation",
  "Transport Booking", "Exam HallTicket", "Summer Term / Compensatory Registration",
  "Photo for Degree certificate", "Scribe Request", "Review/Revaluation/Retotaling Registration",
  "Transcript", "Name Change - Gazette", "Certificate Correction", "Migration Certificate",
  "Duplicate Certificate", "Attestation", "Community Certificate", "Placement Insight Dashboard",
  "Student Review Feedback", "Service Request", "Stipend Request", "Grade Sheet Collection",
  "SRMIST Policies", "Scholarship Renewal Process", "e-Sanad (SRMIST) Registration", "Logout"
];

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Dashboard() {
  const { theme } = useTheme();

  return (
    <div className="relative flex h-screen w-full overflow-hidden text-[var(--text-main)] font-sans bg-[var(--bg-color)]">
      
      {/* Colossal 3D Knot Banner for Dark Mode Only */}
      {theme === "dark" && (
        <div 
          className="absolute right-0 top-0 w-[800px] h-screen bg-no-repeat bg-right-top bg-contain opacity-60 mix-blend-screen pointer-events-none z-0" 
          style={{ backgroundImage: "url('/golden_knot.png')" }} 
        />
      )}

      {/* ── Main Layout Wrapper ── */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
        
        {/* Top Header */}
        <header className="flex-none p-6 md:p-10 flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--text-main)]">Dashboard</h1>
              <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em]">ACADEMIAPRO</p>
            </div>
          </div>
          
          <div className="wet-glass px-4 py-2 flex items-center gap-4 rounded-full mt-10">
            <div className="w-8 h-8 rounded border border-[var(--panel-border)] flex items-center justify-center font-bold text-xs bg-[var(--input-bg)]">
              {studentProfile.initials}
            </div>
            <div className="flex flex-col pr-2">
              <span className="font-bold text-sm leading-tight">{studentProfile.name}</span>
              <span className="text-[9px] text-[var(--text-muted)] tracking-widest">{studentProfile.role}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content area */}
        <div className="flex-1 flex overflow-hidden w-full max-w-[1600px] mx-auto pointer-events-auto pb-10">
          
          {/* Scrollable Sidebar */}
          <aside className="w-72 shrink-0 border-r border-[var(--panel-border)]/20 px-6 overflow-y-auto custom-scrollbar h-full relative z-20 hidden md:block">
            <nav className="flex flex-col gap-1 pb-20">
              {navigationLinks.map((link) => (
                <Link 
                  key={link} 
                  href={`/${generateSlug(link)}`}
                  className="px-4 py-3 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--panel-bg)] hover:shadow-sm transition-all"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Neo-Neumorphic Grid Area */}
          <main className="flex-1 px-4 lg:px-10 overflow-y-auto custom-scrollbar h-full pt-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-32">
              
              {/* Card 1: LIVE ATTENDANCE */}
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={true} glareMaxOpacity={0.05} glareColor="var(--accent-color)" className="xl:col-span-1 rounded-[var(--radius-panel)] h-full">
                <div className="wet-glass p-8 flex flex-col h-full items-center text-center">
                  <h3 className="w-full text-left text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> Live Attendance
                  </h3>
                  
                  {/* Huge Ring */}
                  <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="80" stroke="var(--input-bg)" strokeWidth="16" fill="transparent" />
                      <motion.circle 
                        cx="96" cy="96" r="80" stroke="#3B82F6" strokeWidth="16" fill="transparent" 
                        strokeDasharray="502" strokeDashoffset={502 - (502 * studentProfile.attendance) / 100}
                        strokeLinecap="round" initial={{ strokeDashoffset: 502 }} animate={{ strokeDashoffset: 502 - (502 * studentProfile.attendance) / 100 }} transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-black text-[var(--text-main)]">{studentProfile.attendance}</span>
                      <span className="text-xl font-bold text-[var(--text-muted)]">%</span>
                    </div>
                  </div>

                  <div className="flex w-full gap-4 mb-8">
                    <div className="flex-1 neumorphic-inner rounded-xl py-3 flex flex-col">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Conducted</span>
                      <span className="text-xl font-black mt-1">{studentProfile.conducted}</span>
                    </div>
                    <div className="flex-1 neumorphic-inner rounded-xl py-3 flex flex-col text-blue-500">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Present</span>
                      <span className="text-xl font-black mt-1">{studentProfile.present}</span>
                    </div>
                  </div>

                  <div className="w-full neumorphic-inner rounded-xl p-4 text-left border border-blue-500/20 bg-blue-500/5">
                    <p className="text-[10px] font-bold text-blue-500 flex items-center gap-1"><span className="border border-blue-500 rounded-full w-3 h-3 flex items-center justify-center text-[8px]">i</span> Margin:</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold leading-relaxed">
                      You can miss <span className="font-black text-blue-500 mx-1">{studentProfile.margin}</span> more classes and retain 75% eligibility.
                    </p>
                  </div>
                </div>
              </Tilt>

              {/* Card 2: MARKS PREDICTOR */}
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={true} glareMaxOpacity={0.05} glareColor="var(--accent-color)" className="xl:col-span-1 rounded-[var(--radius-panel)] h-full">
                <div className="wet-glass p-8 flex flex-col h-full relative">
                  <h3 className="w-full text-left text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-color)]" /> Marks Predictor
                  </h3>

                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Internal Marks</span>
                      <div className="flex items-baseline mt-1">
                        <span className="text-4xl font-black">{studentProfile.internalMarks}</span>
                        <span className="text-lg font-bold text-[var(--text-muted)]">/{studentProfile.internalTotal}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Grade</span>
                      <div className="px-3 py-1 mt-1 rounded bg-[var(--input-bg)] shadow-inner font-black text-xl text-[var(--accent-color)]">
                        {studentProfile.grade}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 mb-10 w-full p-6 neumorphic-inner rounded-2xl relative pt-8">
                      <div className="flex justify-between w-full text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mb-4">
                        <span>Target Score</span>
                        <span className="text-[var(--accent-color)]">{studentProfile.targetScore}%</span>
                      </div>
                      <input type="range" min="50" max="100" defaultValue="85" className="w-full" />
                  </div>

                  <p className="text-sm font-semibold text-[var(--accent-color)] leading-relaxed px-2">
                    To achieve {studentProfile.targetScore}% overall, score <span className="font-black text-rose-500 mx-1">{studentProfile.targetNeeded}</span> / 50 in Finals.
                  </p>
                </div>
              </Tilt>

              {/* Card 3: TODAY'S SCHEDULE */}
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={true} glareMaxOpacity={0.05} glareColor="var(--accent-color)" className="xl:col-span-1 rounded-[var(--radius-panel)] h-full">
                <div className="wet-glass p-8 flex flex-col h-full relative">
                  <h3 className="w-full text-left text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" /> Today&apos;s Schedule
                  </h3>

                  <div className="flex flex-col gap-4">
                    <div className="neumorphic-inner p-5 rounded-2xl flex justify-between items-center group hover:bg-[var(--panel-bg)] transition-colors cursor-pointer">
                      <div>
                        <h4 className="font-bold text-sm leading-snug">Quantum<br/>Computing</h4>
                        <p className="text-[9px] text-[var(--text-muted)] font-bold tracking-widest uppercase mt-2">Tech Park 401</p>
                      </div>
                      <div className="text-[10px] font-bold text-blue-500 tracking-widest uppercase bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                        08:00 AM
                      </div>
                    </div>

                    <div className="neumorphic-inner p-5 rounded-2xl flex justify-between items-center group hover:bg-[var(--panel-bg)] transition-colors cursor-pointer border-l-4 border-l-purple-500 relative">
                      <div>
                        <h4 className="font-bold text-sm leading-snug text-purple-500">Machine<br/>Learning</h4>
                        <p className="text-[9px] text-[var(--text-muted)] font-bold tracking-widest uppercase mt-2">AI Block 205</p>
                      </div>
                      <div className="text-[10px] font-bold text-purple-500 tracking-widest uppercase bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                        10:45 AM
                      </div>
                    </div>

                    <div className="neumorphic-inner p-5 rounded-2xl flex justify-between items-center group hover:bg-[var(--panel-bg)] transition-colors cursor-pointer opacity-70">
                      <div>
                        <h4 className="font-bold text-sm leading-snug">Advanced<br/>Math</h4>
                        <p className="text-[9px] text-[var(--text-muted)] font-bold tracking-widest uppercase mt-2">Main Block 102</p>
                      </div>
                      <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase bg-[var(--input-bg)] px-3 py-1.5 rounded-full shadow-inner">
                        01:30 PM
                      </div>
                    </div>
                  </div>
                </div>
              </Tilt>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
