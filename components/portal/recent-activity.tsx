"use client"

import { Calendar, Clock, MapPin } from "lucide-react"
import { mockUpcomingExams, mockNotifications } from "@/lib/mock-data"
import { useReveal } from "@/hooks/use-reveal"
import { cn } from "@/lib/utils"

export function RecentActivity() {
  const { ref, isVisible } = useReveal()

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Exams */}
      <div className={cn(
        "bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="px-6 py-4 border-b border-foreground/10">
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1275d8]" />
            Upcoming Exams
          </h3>
        </div>
        <div className="divide-y divide-foreground/5">
          {mockUpcomingExams.map((exam, index) => (
            <div key={exam.id}
              className={cn(
                "p-4 hover:bg-foreground/5 transition-all duration-300 cursor-default",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : "0ms" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{exam.subject}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">{exam.code}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-[#e19136] font-medium">
                    {new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-foreground/40">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exam.venue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className={cn(
        "bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )} style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}>
        <div className="px-6 py-4 border-b border-foreground/10">
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#e19136]/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#e19136]" />
            </span>
            Recent Notifications
          </h3>
        </div>
        <div className="divide-y divide-foreground/5">
          {mockNotifications.map((notification, index) => (
            <div key={notification.id}
              className={cn(
                "p-4 hover:bg-foreground/5 transition-all duration-300 cursor-default",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
              style={{ transitionDelay: isVisible ? `${(index + 2) * 100}ms` : "0ms" }}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  notification.type === "warning" && "bg-yellow-500",
                  notification.type === "info" && "bg-blue-500",
                  notification.type === "error" && "bg-red-500",
                  notification.type === "success" && "bg-green-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{notification.title}</p>
                  <p className="text-xs text-foreground/50 mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {new Date(notification.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
