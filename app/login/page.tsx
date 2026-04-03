"use client";

import { useCallback, useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion, Variants } from "framer-motion";

interface BootstrapSession {
  captchaDataUri: string;
}

// Minimalist Gold Logo inspired by "Knot"
const PremiumLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="url(#goldGradient)" strokeWidth="8" strokeDasharray="60 30" strokeLinecap="round" className="animate-spin-slow" />
    <circle cx="50" cy="50" r="25" fill="url(#goldGradient)" />
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100">
        <stop stopColor="#fbbf24" />
        <stop offset="0.5" stopColor="var(--accent-color)" />
        <stop offset="1" stopColor="#78350f" />
      </linearGradient>
    </defs>
  </svg>
);

// Removed AnimatedKnot in favor of TrackingCharacters

export default function LoginPage() {
  const [session, setSession] = useState<BootstrapSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Bootstrap ────────────────────────
  const bootstrapSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
       // Dummy image data for CAPTCHA to make it look real without backend
       setSession({ captchaDataUri: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1zaXplPSIyMCI+N1g5UTwvdGV4dD48L3N2Zz4=" });
       setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !captchaInput) { setError("Please fill out all fields"); return; }
    setSubmitting(true);
    
    // Bypass authentication for frontend testing
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const containerVars: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVars: Variants = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { type: "tween", ease: "easeOut", duration: 0.8 } } };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-neutral-200">
      <div className="glitter-shimmer" />

      {/* Top Navbar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-8 py-6"
      >
        <div className="flex items-center gap-3">
          <PremiumLogo />
          <span className="text-xl font-medium tracking-widest text-neutral-100">
            SRMIST<span className="font-light text-[var(--accent-color)] ml-1">PORTAL</span>
          </span>
        </div>
        
        <nav className="hidden md:flex gap-10 text-xs font-semibold text-neutral-400 tracking-[0.2em] uppercase">
          <a href="#" className="hover:text-[var(--accent-color)] transition-colors">Work</a>
          <a href="#" className="hover:text-[var(--accent-color)] transition-colors">Case studies</a>
          <a href="#" className="hover:text-[var(--accent-color)] transition-colors">Services</a>
          <a href="#" className="hover:text-[var(--accent-color)] transition-colors">About</a>
          <a href="#" className="hover:text-[var(--accent-color)] transition-colors">Contact</a>
        </nav>

        <a href="https://ssp.srmist.edu.in/resetpassword/" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all">
          Let&apos;s talk
        </a>
      </motion.header>

      {/* Main Content Split */}
      <main className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center pt-24 pb-12 lg:py-0">
        
        {/* Left Side: Typography & Description */}
        <motion.div variants={containerVars} initial="hidden" animate="show" className="flex-1 px-8 lg:px-24 drop-shadow-lg z-20 space-y-6 w-full">
          <motion.div variants={itemVars} className="inline-block px-3 py-1 bg-neutral-800 border border-neutral-700/50 rounded-full text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
            Creative
          </motion.div>
          
          <motion.h1 variants={itemVars} className="text-4xl lg:text-7xl font-sans text-neutral-100 tracking-tight font-medium leading-[1.1]">
            <span className="italic text-[var(--accent-color)] pr-3 font-serif">Design</span> That Connects <br />
            Every Thread
          </motion.h1>
          
          <motion.p variants={itemVars} className="text-sm lg:text-base text-neutral-400 max-w-lg leading-relaxed font-light">
            Welcome to SRMIST STUDENT PORTAL. You can access student portal to know your academic and financial details. Students can login with NetID credentials.
          </motion.p>
          
          <motion.div variants={itemVars} className="flex gap-4 pt-4">
             <button className="bg-white text-black px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all">
                Get Started
             </button>
             <button className="bg-transparent border border-neutral-600 text-neutral-200 px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all">
                Learn More
             </button>
          </motion.div>

          <motion.div variants={itemVars} className="flex gap-8 pt-12 border-t border-neutral-800/80 mt-12">
             <div className="flex-1">
                <h4 className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-widest mb-2 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" /> Fluid Interaction
                </h4>
                <p className="text-[10px] text-neutral-500 leading-relaxed pr-6">Experience design built on connection, clarity & effortless movement</p>
             </div>
             <div className="flex-1">
                <h4 className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-widest mb-2 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" /> Crafted Precision
                </h4>
                <p className="text-[10px] text-neutral-500 leading-relaxed pr-6">Every detail interlocks to form a flawless digital journey</p>
             </div>
          </motion.div>
        </motion.div>

        {/* Right Side: The Form + 3D Element behind it */}
        <div className="flex-1 w-full relative min-h-[600px] flex items-center justify-center lg:justify-end lg:pr-24">
          {/* Right Side Image Banner (3D Knot replica) */}
          <div className="absolute inset-0 pointer-events-none mt-12 lg:mt-0 flex items-center justify-center lg:justify-end lg:pr-20 overflow-hidden">
             <div className="w-[800px] h-[800px] bg-no-repeat bg-center bg-contain opacity-70 mix-blend-screen scale-110 translate-x-20 rounded-full" 
                  style={{ backgroundImage: "url('/golden_knot.png')" }} />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="w-full max-w-md relative z-30 perspective-[2000px] mt-12 lg:mt-0 px-6 lg:px-0"
          >
            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={2000} scale={1.01} transitionSpeed={1500} className="w-full relative">
              
              <div className="wet-glass rounded-xl p-8 sm:p-10 relative">
                
                <div className="mb-8">
                  <h2 className="text-xl font-serif text-white tracking-wide italic mb-1 flex items-center">
                     <span className="w-8 h-[1px] bg-[var(--accent-color)] mr-3" /> Login Protocol
                  </h2>
                  <p className="text-xs text-neutral-500 tracking-widest uppercase">Secure authentication</p>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-6 relative z-10">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border border-[var(--accent-color)] border-t-transparent rounded-full" />
                    <p className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-[0.2em] animate-pulse">Initializing Interface...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-950/40 text-red-400 p-3 text-[10px] font-bold uppercase tracking-widest border border-red-900/50 flex flex-col gap-1 rounded bg-blur">
                        <span className="text-white">Authy Error</span>
                        {error}
                      </motion.div>
                    )}

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">NetID</label>
                        <div className="neumorphic-inner rounded h-11 flex items-center px-4 transition-all focus-within:border-[var(--accent-color)]/50">
                          <input
                            id="username" type="text" required autoComplete="off"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-white focus:outline-none focus:ring-0 text-sm font-medium tracking-wide h-full placeholder-neutral-700"
                            placeholder="Enter your NetID"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Secret Key</label>
                        <div className="neumorphic-inner rounded h-11 flex items-center px-4 transition-all focus-within:border-[var(--accent-color)]/50">
                          <input
                            id="password" type="password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-white focus:outline-none focus:ring-0 text-sm font-medium tracking-wide h-full placeholder-neutral-700"
                            placeholder="••••••••••"
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <a href="#" className="text-[9px] text-neutral-500 hover:text-[var(--accent-color)] uppercase tracking-widest transition-colors">Forgot Password?</a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">Security Check</label>
                      <div className="flex items-center gap-3">
                        <div className="neumorphic-inner rounded h-11 px-3 flex-1 flex items-center transition-all focus-within:border-[var(--accent-color)]/50">
                          <input
                            id="captcha" type="text" required autoComplete="off" placeholder="CODE"
                            value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-white focus:outline-none focus:ring-0 text-sm font-bold uppercase tracking-widest h-full placeholder-neutral-700"
                          />
                        </div>

                        <div className="flex-1 rounded overflow-hidden flex items-center justify-center p-0.5 relative h-11 neumorphic-inner">
                          {session?.captchaDataUri ? (
                             <img src={session.captchaDataUri} alt="CAPTCHA" className="h-[90%] object-contain filter invert hue-rotate-[180deg] saturate-0 brightness-150 opacity-80" draggable={false} />
                          ) : (
                             <span className="text-[8px] text-neutral-600 font-bold tracking-[0.2em] uppercase animate-pulse">Syncing...</span>
                          )}
                        </div>
                        
                        <button
                          type="button" onClick={bootstrapSession} disabled={loading}
                          className="h-11 w-11 shrink-0 flex items-center justify-center rounded border border-neutral-700/50 bg-neutral-800/30 text-neutral-400 hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)] transition-all outline-none"
                        >
                           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                           </svg>
                        </button>
                      </div>
                    </div>

                    <button type="submit" disabled={submitting} className="w-full theme-button rounded py-3 mt-4 flex items-center justify-center group">
                      {submitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-[2px] border-black/20 border-t-black mr-2" />
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      )}
                      <span className="text-xs tracking-[0.2em] uppercase font-bold">{submitting ? "Authenticating" : "Enter Portal"}</span>
                    </button>
                  </form>
                )}
              </div>
            </Tilt>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
