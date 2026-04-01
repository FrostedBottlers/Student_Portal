"use client"

import { Bell, Menu, Search, User } from "lucide-react"
import { mockStudent, mockNotifications } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface PortalHeaderProps {
  onMenuClick: () => void
}

export function PortalHeader({ onMenuClick }: PortalHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = mockNotifications.length

  return (
    <header className="h-16 border-b border-foreground/10 bg-foreground/5 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-foreground/5 rounded-lg px-3 py-2 border border-foreground/10 focus-within:border-[#1275d8]/50 transition-colors">
          <Search className="w-4 h-4 text-foreground/40" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground/40 w-48 lg:w-64" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-[#1275d8]/10 text-[#1275d8] text-xs font-medium">
          ReVanced Portal
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-foreground/10">
                  <h3 className="text-sm font-medium text-foreground">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-foreground/5 hover:bg-foreground/5 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                          notification.type === "warning" && "bg-yellow-500",
                          notification.type === "info" && "bg-blue-500",
                          notification.type === "error" && "bg-red-500",
                          notification.type === "success" && "bg-green-500"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{notification.title}</p>
                          <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-foreground/40 mt-1">
                            {new Date(notification.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 border-l border-foreground/10">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{mockStudent.name}</p>
            <p className="text-xs text-foreground/60">{mockStudent.studentId}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1275d8] to-[#e19136] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
