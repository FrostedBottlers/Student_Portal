"use client"

import { useState, useEffect } from "react"
import { PortalSidebar } from "@/components/portal/portal-sidebar"
import { PortalHeader } from "@/components/portal/portal-header"
import { GrainOverlay } from "@/components/grain-overlay"
import { CustomCursor } from "@/components/custom-cursor"
import { cn } from "@/lib/utils"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) return null

  return (
    <div className="h-screen flex overflow-hidden bg-background relative">
      <CustomCursor />
      <div className="fixed inset-0 bg-gradient-to-br from-[#1275d8]/5 via-transparent to-[#e19136]/5 pointer-events-none" />
      <GrainOverlay />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex relative z-20">
        <PortalSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <PortalSidebar collapsed={false} onToggle={() => {}} isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <PortalHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
