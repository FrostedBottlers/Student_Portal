"use client"

import { Shader, Swirl, ChromaFlow } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState, useCallback } from "react"
import { Eye, EyeOff, Lock, User, RefreshCw, ShieldCheck, Mail, MapPin } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
interface AuthStartResponse {
  sessionId: string
  cookies: string
  csrfToken: string | null
  jsChallenge: string | null
  captchaToken: string | null
  captchaDataUri: string
}

interface SessionState {
  sessionId: string
  cookies: string
  csrfToken: string
  jsChallenge: string
  captchaToken: string
  captchaDataUri: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>(undefined)

  // ── Auth state ──
  const [session, setSession] = useState<SessionState | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // ── Shader load detection ──
  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) clearInterval(intervalId)
    }, 100)

    const fallbackTimer = setTimeout(() => setIsLoaded(true), 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // ── Horizontal scroll navigation ──
  const scrollToSection = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }, [])

  // ── Touch handling for mobile ──
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 2) scrollToSection(currentSection + 1)
        else if (deltaY < 0 && currentSection > 0) scrollToSection(currentSection - 1)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection, scrollToSection])

  // ── Wheel → horizontal scroll ──
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

  // ── Scroll sync ──
  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return
      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) { scrollThrottleRef.current = undefined; return }
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection && newSection >= 0 && newSection <= 2) setCurrentSection(newSection)
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

  // ── Auth bootstrap ──
  const bootstrapSession = useCallback(async () => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const res = await fetch("/api/auth/start")
      const body = await res.json()
      if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`)
      const data = body as AuthStartResponse
      setSession({
        sessionId: data.sessionId,
        cookies: data.cookies,
        csrfToken: data.csrfToken ?? "",
        jsChallenge: data.jsChallenge ?? "",
        captchaToken: data.captchaToken ?? "",
        captchaDataUri: data.captchaDataUri,
      })
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Failed to load login session")
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // Bootstrap when user scrolls to sign-in section
  useEffect(() => {
    if (currentSection === 1 && !session && !authLoading) {
      bootstrapSession()
    }
  }, [currentSection, session, authLoading, bootstrapSession])

  // ── Login submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setSubmitting(true)
    setAuthError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username, password, captcha: captchaInput,
          sessionId: session.sessionId, cookies: session.cookies,
          csrfToken: session.csrfToken, jsChallenge: session.jsChallenge,
          captchaToken: session.captchaToken,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Login failed")
      window.location.href = "/portal/dashboard"
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Login failed")
      await bootstrapSession()
    } finally {
      setSubmitting(false)
      setCaptchaInput("")
    }
  }

  const sectionLabels = ["Home", "Sign In", "About"]

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      {/* ── Shader background ── */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1275d8" colorB="#e19136" speed={0.8} detail={0.8} blend={50}
          />
          <ChromaFlow
            baseColor="#0066ff" upColor="#0066ff" downColor="#d1d1d1"
            leftColor="#e19136" rightColor="#e19136"
            intensity={0.9} radius={1.8} momentum={25} maskType="alpha" opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ── Nav ── */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button onClick={() => scrollToSection(0)} className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-foreground/25">
            <span className="font-sans text-xl font-bold text-foreground">R</span>
          </div>
          <span className="font-sans text-xl font-semibold tracking-tight text-foreground">ReVanced</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {sectionLabels.map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                currentSection === index ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(1)}>
          Get Started
        </MagneticButton>
      </nav>

      {/* ── Horizontal scroll container ── */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ═══ SECTION 1: HERO ═══ */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-end px-6 pb-16 pt-24 md:px-12 md:pb-24">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md duration-700">
              <p className="font-mono text-xs text-foreground/90">A Better Portal Experience</p>
            </div>
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-6xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-7xl lg:text-8xl">
              <span className="text-balance">
                Your portal,
                <br />
                <span className="font-semibold">reimagined</span>
              </span>
            </h1>
            <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-foreground/90 duration-1000 delay-200 md:text-xl">
              <span className="text-pretty">
                Access your academic records, financial details, and campus services — all through a modern, fluid interface.
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(1)}>
                Sign In
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(2)}>
                Learn More
              </MagneticButton>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Scroll to explore</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/80" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: SIGN IN (with CAPTCHA) ═══ */}
        <section className="flex min-h-screen w-screen shrink-0 items-center justify-center px-4 pt-20 md:px-12 md:pt-0">
          <div className="w-full max-w-md mx-4">
            <div className="bg-foreground/5 backdrop-blur-2xl border border-foreground/10 rounded-3xl p-8 shadow-2xl">
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1275d8] to-[#1275d8]/80 flex items-center justify-center mb-4 shadow-lg shadow-[#1275d8]/20">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
                <h2 className="text-2xl font-light text-foreground">
                  <span className="font-semibold">ReVanced</span> Portal
                </h2>
                <p className="text-sm text-foreground/50 mt-1">Sign in with your NetID</p>
              </div>

              {/* Error banner */}
              {authError && !authLoading && (
                <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Loading */}
              {authLoading && (
                <div className="flex flex-col items-center gap-4 py-12">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-2 border-foreground/10" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#1275d8]" />
                  </div>
                  <p className="text-sm text-foreground/50">Establishing session…</p>
                </div>
              )}

              {/* Form */}
              {!authLoading && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm text-foreground/70">
                      NetID <span className="text-foreground/40">(without @srmist.edu.in)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        id="username" type="text" required autoComplete="username"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. jd1234"
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-11 py-3.5 text-foreground placeholder:text-foreground/30 outline-none focus:border-[#1275d8]/50 focus:bg-foreground/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm text-foreground/70">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-11 py-3.5 text-foreground placeholder:text-foreground/30 outline-none focus:border-[#1275d8]/50 focus:bg-foreground/10 transition-all duration-200 pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-right">
                      <a href="https://ssp.srmist.edu.in/resetpassword/" target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#1275d8] hover:text-[#1275d8]/80 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  {/* CAPTCHA */}
                  <div className="space-y-2">
                    <label htmlFor="captcha" className="text-sm text-foreground/70">CAPTCHA</label>
                    <div className="flex items-center gap-3 mb-2">
                      {session?.captchaDataUri ? (
                        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={session.captchaDataUri} alt="CAPTCHA" className="h-10 w-auto select-none" draggable={false} />
                        </div>
                      ) : (
                        <div className="flex h-12 w-28 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 text-xs text-foreground/40">
                          No image
                        </div>
                      )}
                      <button type="button" onClick={bootstrapSession} disabled={authLoading} title="Refresh CAPTCHA"
                        className="group flex h-10 w-10 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 text-foreground/40 transition-all duration-200 hover:bg-foreground/10 hover:text-foreground disabled:opacity-50">
                        <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                      </button>
                    </div>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        id="captcha" type="text" required autoComplete="off"
                        value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Enter the characters above"
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-11 py-3.5 text-foreground placeholder:text-foreground/30 outline-none focus:border-[#1275d8]/50 focus:bg-foreground/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={submitting || !session}
                    className="w-full bg-gradient-to-r from-[#1275d8] to-[#1275d8]/90 hover:from-[#1275d8]/90 hover:to-[#1275d8] text-white rounded-xl py-3.5 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1275d8]/20 hover:shadow-[#1275d8]/30">
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : "Sign In"}
                  </button>
                </form>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-foreground/10 text-center">
                <p className="text-xs text-foreground/40">ReVanced Student Portal</p>
                <p className="text-xs text-foreground/30 mt-1">An enhanced portal experience</p>
              </div>
            </div>

            <p className="text-center mt-6 text-sm text-foreground/50">
              Need help?{" "}
              <a href="https://ssp.srmist.edu.in/resetpassword/" target="_blank" rel="noopener noreferrer"
                className="text-[#e19136] hover:text-[#e19136]/80 transition-colors">
                Contact IT Support
              </a>
            </p>
          </div>
        </section>

        {/* ═══ SECTION 3: ABOUT ═══ */}
        <section className="flex min-h-screen w-screen shrink-0 items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
              {/* Left — Story */}
              <div>
                <div className="mb-6 md:mb-12">
                  <h2 className="mb-3 font-sans text-3xl font-light leading-[1.1] tracking-tight text-foreground md:mb-4 md:text-6xl lg:text-7xl">
                    A portal
                    <br />
                    that actually
                    <br />
                    <span className="text-foreground/40">works</span>
                  </h2>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                    Built from the ground up to replace the sluggish legacy system with a fluid, modern interface
                    that respects your time.
                  </p>
                  <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">
                    Real-time data scraping, instant navigation, and a design that feels like it belongs in 2026 — not 2006.
                  </p>
                </div>
              </div>

              {/* Right — Features */}
              <div className="flex flex-col justify-center space-y-6 md:space-y-12">
                {[
                  { value: "⚡", label: "Instant Access", sublabel: "Real-time portal data" },
                  { value: "🔒", label: "Secure", sublabel: "Human-in-the-loop auth" },
                  { value: "🎨", label: "Modern UI", sublabel: "WebGL-powered design" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-4 border-l border-foreground/30 pl-4 md:gap-8 md:pl-8"
                    style={{
                      marginLeft: i % 2 === 0 ? "0" : "auto",
                      maxWidth: i % 2 === 0 ? "100%" : "85%",
                    }}
                  >
                    <div className="text-3xl md:text-5xl">{stat.value}</div>
                    <div>
                      <div className="font-sans text-base font-light text-foreground md:text-xl">{stat.label}</div>
                      <div className="font-mono text-xs text-foreground/60">{stat.sublabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="mt-8 md:mt-16 flex flex-col sm:flex-row gap-8">
              <a href="mailto:support@revanced.app" className="group block">
                <div className="mb-1 flex items-center gap-2">
                  <Mail className="h-3 w-3 text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Email</span>
                </div>
                <p className="text-base text-foreground transition-colors group-hover:text-foreground/70 md:text-xl">
                  support@revanced.app
                </p>
              </a>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-foreground/60" />
                  <span className="font-mono text-xs text-foreground/60">Status</span>
                </div>
                <p className="text-base text-foreground md:text-xl">Open Source Project</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  )
}
