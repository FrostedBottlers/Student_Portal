"use client";

import { useCallback, useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

interface BootstrapSession {
  captchaDataUri: string;
}

// Sophisticated Glassy Vector Logo
const ProfessionalLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-500 hover:rotate-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
    <path d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" fill="url(#glossGrad2)" fillOpacity="0.8" />
    <path d="M50 5 L95 25 L50 50 Z" fill="url(#glossGrad1)" />
    <path d="M5 25 L50 50 L50 95 Z" fill="url(#glossGrad3)" />
    <path d="M95 25 L50 50 L95 75 Z" fill="url(#glossGrad4)" opacity="0.6"/>
    <defs>
      <linearGradient id="glossGrad1" x1="50" y1="5" x2="50" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#a855f7" /></linearGradient>
      <linearGradient id="glossGrad2" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#ec4899" /></linearGradient>
      <linearGradient id="glossGrad3" x1="5" y1="25" x2="50" y2="95" gradientUnits="userSpaceOnUse"><stop stopColor="#4f46e5" /><stop offset="1" stopColor="#db2777" /></linearGradient>
      <linearGradient id="glossGrad4" x1="50" y1="50" x2="95" y2="75" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff" /><stop offset="1" stopColor="#fbcfe8" /></linearGradient>
    </defs>
  </svg>
);

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
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/start");
      if (!res.ok) throw new Error(`Failed to bootstrap: ${res.status}`);
      const data = await res.json();
      if (!data.captchaDataUri) throw new Error("Missing CAPTCHA image in response");
      setSession(data);
    } catch (err: unknown) {
      setError("Unable to connect to the authentication server. Please retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  // ── Handle Login Form Submission ──────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !captchaInput) { setError("Please fill out all fields"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ netId: username, password, captchaText: captchaInput }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Authentication failed");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      bootstrapSession(); 
    } finally {
      setSubmitting(false);
      setCaptchaInput("");
    }
  };

  // ── Framer Motion Layout ──────────────────────────────────
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVars = { hidden: { opacity: 0, y: 30, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 70, damping: 15 } } };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#e8eef6] text-[#1c1e21] font-sans">
      
      {/* ── Fluid Glass Waves Background (Option C) + Glitter Overlay ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft Shimmer Canvas Overlay for the glittery feel */}
        <div className="glitter-shimmer" />

        {/* Dynamic Translucent Waves */}
        <motion.div 
          animate={{ x: ["-10%", "-50%", "-10%"], rotate: [0, 5, 0] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] -left-[20%] w-[150%] h-[300px] rounded-[100%] bg-gradient-to-r from-pink-300/30 to-rose-200/40 blur-[40px] mix-blend-multiply border-t border-white/40" 
        />
        <motion.div 
          animate={{ x: ["-30%", "0%", "-30%"], rotate: [-5, 0, -5], y: [0, 50, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[10%] w-[150%] h-[400px] rounded-[100%] bg-gradient-to-r from-indigo-300/30 to-purple-200/40 blur-[40px] mix-blend-multiply border-b border-white/50" 
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="wet-glass flex items-center justify-between w-full px-6 py-4 rounded-3xl"
        >
          <div className="flex items-center gap-4">
            <ProfessionalLogo />
            <span className="text-xl font-extrabold tracking-tight text-slate-800">
              Academia<span className="text-indigo-600 font-light">Pro</span>
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500 tracking-wide uppercase">
            <a href="#" className="hover:text-indigo-600 transition-colors">Ecosystem</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Developers</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </nav>

          <a href="https://ssp.srmist.edu.in/resetpassword/" target="_blank" rel="noopener noreferrer" className="neumorphic-button px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-all">
            Secure Access
          </a>
        </motion.header>

        {/* Main Content Split */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-between w-full mt-10 lg:mt-0 gap-16 pt-10">
          
          {/* Left Side: Editorial Typography */}
          <motion.div variants={containerVars} initial="hidden" animate="show" className="flex-1 lg:pr-12 drop-shadow-sm z-20">
            <motion.div variants={itemVars} className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-white/40 shadow-sm backdrop-blur-md text-xs font-bold tracking-widest text-indigo-700 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              System Operational
            </motion.div>
            
            <motion.h1 variants={itemVars} className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-slate-800 leading-[1.05] pb-6">
              The Smarter, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-[0_2px_10px_rgba(236,72,153,0.3)]">Spatial</span> OS <br />
              For Students.
            </motion.h1>
            
            <motion.p variants={itemVars} className="text-lg text-slate-600 max-w-xl font-medium leading-relaxed">
              Experience a meticulously crafted interface that reacts to your every move. Built for high performance, deep integration, and absolute clarity.
            </motion.p>
          </motion.div>

          {/* Right Side: Professional 3D Tilt Login Form with Wet Glass */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="flex-1 w-full max-w-md relative z-30 perspective-[1000px]"
          >
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={2000} gyroscope={true} className="w-full relative">
              
              {/* Overhauled Wet Glass plate */}
              <div className="wet-glass rounded-[32px] p-8 sm:p-10 relative">
                
                {/* Simulated Glass Reflection at the top edge */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/90 to-transparent opacity-80 pointer-events-none rounded-t-[32px]" />

                <div className="text-center mb-8 relative z-10">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access Node</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">SRM Authentication</p>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-6 relative z-10">
                    <motion.div 
                      animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-12 w-12 rounded-full border-[3px] border-slate-300 border-t-indigo-500" 
                    />
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.25em]">Bridging secure connection...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10 block">
                    
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-rose-50/90 text-rose-600 p-4 text-xs font-bold uppercase tracking-wider border border-rose-200 flex items-center gap-3 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)]">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {error}
                      </motion.div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div className="neumorphic-inner rounded-xl flex relative h-14 items-center px-4 transition-all focus-within:ring-2 focus-within:ring-indigo-400 focus-within:bg-white/80">
                        <input
                          id="username" type="text" required placeholder="University NetID"
                          value={username} onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-sm font-semibold h-full"
                        />
                      </div>

                      <div className="neumorphic-inner rounded-xl flex relative h-14 items-center px-4 transition-all focus-within:ring-2 focus-within:ring-indigo-400 focus-within:bg-white/80">
                        <input
                          id="password" type="password" required placeholder="Account Password"
                          value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-sm font-semibold h-full"
                        />
                      </div>
                    </div>

                    {/* Captcha Block */}
                    <div>
                      <div className="flex gap-4 mb-4">
                        <div className="neumorphic-inner flex-1 rounded-xl overflow-hidden flex items-center justify-center p-1 relative h-16 bg-white/50">
                          {session?.captchaDataUri ? (
                            <img src={session.captchaDataUri} alt="CAPTCHA" className="h-[120%] object-contain filter contrast-125 mix-blend-multiply opacity-80" draggable={false} />
                          ) : (
                             <span className="text-xs text-slate-300 font-bold tracking-[0.2em] uppercase animate-pulse">Scanning...</span>
                          )}
                        </div>
                        
                        <button
                          type="button" onClick={bootstrapSession} disabled={loading}
                          className="neumorphic-button h-16 w-16 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors shrink-0 outline-none"
                        >
                           <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                           </svg>
                        </button>
                      </div>

                      <div className="neumorphic-inner rounded-xl flex relative h-14 items-center px-4 transition-all focus-within:ring-2 focus-within:ring-pink-400 focus-within:bg-white/80">
                        <input
                          id="captcha" type="text" required autoComplete="off" placeholder="Enter security characters"
                          value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-sm font-bold h-full uppercase tracking-widest"
                        />
                      </div>
                    </div>

                    <button
                      type="submit" disabled={submitting || !session}
                      className="w-full block relative mt-8 pt-4 group"
                    >
                       <div className="absolute top-4 -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl transition duration-500 group-hover:opacity-70 group-hover:blur-2xl" />
                       <div className="relative w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-center items-center text-center font-bold text-white shadow-xl transition-all group-hover:-translate-y-[2px] cursor-pointer">
                         {submitting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white mr-3" /> : null}
                         <span className="tracking-[0.15em] uppercase text-xs font-black">{submitting ? "Processing..." : "Initialize Session"}</span>
                       </div>
                    </button>
                  </form>
                )}
              </div>
            </Tilt>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
