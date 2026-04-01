"use client"

import { User } from "lucide-react"
import { mockStudent } from "@/lib/mock-data"
import { useReveal } from "@/hooks/use-reveal"
import { cn } from "@/lib/utils"

const profileFields = [
  { label: "Student Name", value: mockStudent.name },
  { label: "Student ID", value: mockStudent.studentId },
  { label: "Register No.", value: mockStudent.registerNo },
  { label: "Email ID", value: mockStudent.email },
  { label: "Institution", value: mockStudent.institution },
  { label: "Program", value: mockStudent.program },
  { label: "Combo", value: mockStudent.combo },
  { label: "Batch", value: mockStudent.batch },
  { label: "Room No", value: mockStudent.roomNo },
  { label: "Section", value: mockStudent.section },
  { label: "Faculty Advisor", value: mockStudent.facultyAdvisor },
  { label: "Academic Advisor", value: mockStudent.academicAdvisor },
]

export function StudentProfileCard() {
  const { ref, isVisible } = useReveal()

  return (
    <div ref={ref} className={cn(
      "bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-2xl overflow-hidden transition-all duration-700",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="bg-[#1275d8] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-medium text-white">Student Profile</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {profileFields.map((field, index) => (
            <div key={field.label} className={cn(
              "flex flex-col sm:flex-row sm:items-center py-3 border-b border-foreground/5 last:border-0 transition-all duration-500",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )} style={{ transitionDelay: isVisible ? `${index * 50}ms` : "0ms" }}>
              <span className="text-sm text-foreground/50 sm:w-40 flex-shrink-0 mb-1 sm:mb-0">{field.label}</span>
              <span className="text-sm text-foreground font-medium break-all">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
