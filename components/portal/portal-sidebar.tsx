"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { sidebarNavigation } from "@/lib/mock-data"
import {
  LayoutDashboard, BookOpen, GraduationCap, CalendarCheck, ClipboardList,
  Clock, Calendar, Ticket, FileText, FileSearch, FilePen, Mail, CreditCard,
  Landmark, User, IdCard, Building, Bus, Bell, BarChart3, MessageSquare,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BookOpen, GraduationCap, CalendarCheck, ClipboardList,
  Clock, Calendar, Ticket, FileText, FileSearch, FilePen, Mail, CreditCard,
  Landmark, User, IdCard, Building, Bus, Bell, BarChart3, MessageSquare,
}

interface PortalSidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobile?: boolean
  onCloseMobile?: () => void
}

export function PortalSidebar({ collapsed, onToggle, isMobile, onCloseMobile }: PortalSidebarProps) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    sidebarNavigation.map((g) => g.group)
  )

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
  }

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) onCloseMobile()
  }

  return (
    <aside className={cn(
      "h-full flex flex-col bg-foreground/5 backdrop-blur-xl border-r border-foreground/10 transition-all duration-300",
      collapsed ? "w-[72px]" : "w-[280px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-foreground/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1275d8] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">ReVanced</span>
              <span className="text-xs text-foreground/60">Student Portal</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#1275d8] flex items-center justify-center mx-auto">
            <span className="text-white font-semibold text-sm">R</span>
          </div>
        )}
        {!isMobile && (
          <button onClick={onToggle} className="p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {sidebarNavigation.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <button onClick={() => toggleGroup(group.group)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-foreground/40 uppercase tracking-wider hover:text-foreground/60 transition-colors">
                {group.group}
                <ChevronRight className={cn("w-3 h-3 transition-transform", expandedGroups.includes(group.group) && "rotate-90")} />
              </button>
            )}
            {(collapsed || expandedGroups.includes(group.group)) && (
              <ul className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] || FileText
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link href={item.href} onClick={handleLinkClick}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                          collapsed && "justify-center px-0",
                          isActive
                            ? "bg-[#1275d8]/20 text-[#1275d8] font-medium"
                            : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-[#1275d8]")} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-foreground/10">
        <Link href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  )
}
