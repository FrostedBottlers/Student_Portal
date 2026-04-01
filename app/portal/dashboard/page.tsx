"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { mockStudent, mockCourses, mockUpcomingExams, mockNotifications } from "@/lib/mock-data"
import { StudentProfileCard } from "@/components/portal/student-profile-card"
import { DashboardStats } from "@/components/portal/dashboard-stats"
import { RecentActivity } from "@/components/portal/recent-activity"
import { cn } from "@/lib/utils"
import { BookOpen, CalendarCheck, Clock, MapPin, ChevronRight, ChevronLeft } from "lucide-react"

export default function DashboardPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const scrollThrottleRef = useRef<number>(undefined)
  const totalSections = 4 // Overview, Courses, Activity, Profile

  const scrollToSection = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({ left: sectionWidth * index, behavior: "smooth" })
      setCurrentSection(index)
    }
  }, [])

  // Wheel → horizontal scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        if (!scrollContainerRef.current) return
        scrollContainerRef.current.scrollBy({ left: e.deltaY, behavior: "instant" })
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) setCurrentSection(newSection)
      }
    }
    const container = scrollContainerRef.current
    if (container) container.addEventListener("wheel", handleWheel, { passive: false })
    return () => { if (container) container.removeEventListener("wheel", handleWheel) }
  }, [currentSection])

  // Scroll sync
  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return
      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) { scrollThrottleRef.current = undefined; return }
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection && newSection >= 0 && newSection < totalSections) setCurrentSection(newSection)
        scrollThrottleRef.current = undefined
      })
    }
    const container = scrollContainerRef.current
    if (container) container.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
    }
  }, [currentSection])

  // Touch handling
  const touchStartRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    const handleTouchEnd = (e: TouchEvent) => {
      const dx = touchStartRef.current.x - e.changedTouches[0].clientX
      const dy = touchStartRef.current.y - e.changedTouches[0].clientY
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
        if (dy > 0 && currentSection < totalSections - 1) scrollToSection(currentSection + 1)
        else if (dy < 0 && currentSection > 0) scrollToSection(currentSection - 1)
      }
    }
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }
    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection, scrollToSection])

  const sectionLabels = ["Overview", "Courses", "Activity", "Profile"]

  return (
    <div className="h-full relative">
      {/* Navigation dots */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-full px-4 py-2">
        <button onClick={() => scrollToSection(Math.max(0, currentSection - 1))}
          className="p-1 text-foreground/40 hover:text-foreground transition-colors disabled:opacity-30"
          disabled={currentSection === 0}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        {sectionLabels.map((label, i) => (
          <button key={label} onClick={() => scrollToSection(i)}
            className={cn(
              "text-xs font-medium transition-all duration-300 px-2 py-1 rounded-full",
              currentSection === i
                ? "bg-[#1275d8]/20 text-[#1275d8]"
                : "text-foreground/50 hover:text-foreground"
            )}>
            {label}
          </button>
        ))}
        <button onClick={() => scrollToSection(Math.min(totalSections - 1, currentSection + 1))}
          className="p-1 text-foreground/40 hover:text-foreground transition-colors disabled:opacity-30"
          disabled={currentSection === totalSections - 1}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal scroll container */}
      <div ref={scrollContainerRef} data-scroll-container
        className="flex h-full overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}>

        {/* ═══ SECTION 1: OVERVIEW ═══ */}
        <section className="min-w-full h-full shrink-0 flex flex-col justify-center px-6 lg:px-12"
          style={{ scrollSnapAlign: "start" }}>
          <div className="max-w-5xl mx-auto w-full space-y-8">
            <div>
              <h1 className="text-2xl lg:text-4xl font-light text-foreground">
                Welcome back,{" "}
                <span className="font-semibold text-[#1275d8]">{mockStudent.name.split(" ")[0]}</span>
              </h1>
              <p className="text-foreground/50 mt-2 text-lg">
                {mockStudent.program} · Semester {mockStudent.semester} · Year {mockStudent.year}
              </p>
            </div>
            <DashboardStats />
            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Fee Payment", icon: "💳", href: "/portal/fee-payment" },
                { label: "Attendance", icon: "📊", href: "/portal/attendance" },
                { label: "Timetable", icon: "📅", href: "/portal/timetable" },
                { label: "Hall Ticket", icon: "🎫", href: "/portal/hall-ticket" },
              ].map((action) => (
                <a key={action.label} href={action.href}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-foreground/20 transition-all duration-200 hover:scale-[1.02]">
                  <span className="text-2xl mb-2">{action.icon}</span>
                  <span className="text-xs text-foreground/70 text-center">{action.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: COURSES ═══ */}
        <section className="min-w-full h-full shrink-0 flex flex-col justify-center px-6 lg:px-12"
          style={{ scrollSnapAlign: "start" }}>
          <div className="max-w-5xl mx-auto w-full">
            <div className="bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1275d8]" />
                  Current Courses
                </h3>
                <span className="text-xs text-foreground/50">Semester {mockStudent.semester}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/50 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-foreground/50 uppercase tracking-wider">Credits</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-foreground/50 uppercase tracking-wider">Attendance</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-foreground/50 uppercase tracking-wider">Internal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {mockCourses.map((course) => (
                      <tr key={course.code} className="hover:bg-foreground/5 transition-all duration-300">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-foreground">{course.name}</p>
                          <p className="text-xs text-foreground/50 mt-0.5">{course.code} | {course.faculty}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm text-foreground">{course.credits}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            course.attendance >= 75 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          )}>
                            {course.attendance}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm text-foreground">{course.internal}/{course.maxInternal}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: ACTIVITY ═══ */}
        <section className="min-w-full h-full shrink-0 flex flex-col justify-center px-6 lg:px-12"
          style={{ scrollSnapAlign: "start" }}>
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-xl font-medium text-foreground mb-6">Recent Activity</h2>
            <RecentActivity />
          </div>
        </section>

        {/* ═══ SECTION 4: PROFILE ═══ */}
        <section className="min-w-full h-full shrink-0 flex flex-col justify-center px-6 lg:px-12"
          style={{ scrollSnapAlign: "start" }}>
          <div className="max-w-2xl mx-auto w-full">
            <StudentProfileCard />
          </div>
        </section>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
