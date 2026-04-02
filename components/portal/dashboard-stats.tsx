"use client"

import { CalendarCheck, GraduationCap, BookOpen, CreditCard } from "lucide-react"
import { mockStudent } from "@/lib/mock-data"
import { useReveal } from "@/hooks/use-reveal"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Attendance",
    value: `${mockStudent.attendance}%`,
    icon: CalendarCheck,
    color: mockStudent.attendance >= 75 ? "text-green-400" : "text-red-400",
    bgColor: mockStudent.attendance >= 75 ? "bg-green-500/10" : "bg-red-500/10",
    description: "Current semester",
  },
  {
    label: "CGPA",
    value: mockStudent.cgpa.toFixed(2),
    icon: GraduationCap,
    color: "text-[#1275d8]",
    bgColor: "bg-[#1275d8]/10",
    description: "Cumulative GPA",
  },
  {
    label: "Credits",
    value: `${mockStudent.credits}/${mockStudent.totalCredits}`,
    icon: BookOpen,
    color: "text-[#e19136]",
    bgColor: "bg-[#e19136]/10",
    description: "Earned / Required",
  },
  {
    label: "Due Amount",
    value: mockStudent.dueAmount === 0 ? "Nil" : `₹${mockStudent.dueAmount.toLocaleString()}`,
    icon: CreditCard,
    color: mockStudent.dueAmount === 0 ? "text-green-400" : "text-red-400",
    bgColor: mockStudent.dueAmount === 0 ? "bg-green-500/10" : "bg-red-500/10",
    description: "Fee balance",
  },
]

export function DashboardStats() {
  const { ref, isVisible } = useReveal()

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={stat.label}
          className={cn(
            "bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-2xl p-5 transition-all duration-500 hover:bg-foreground/10 hover:scale-[1.02] cursor-default",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-foreground/50">{stat.label}</p>
              <p className={cn("text-2xl font-semibold mt-1", stat.color)}>{stat.value}</p>
              <p className="text-xs text-foreground/40 mt-1">{stat.description}</p>
            </div>
            <div className={cn("p-3 rounded-xl", stat.bgColor)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
