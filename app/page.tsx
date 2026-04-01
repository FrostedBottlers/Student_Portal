"use client";

import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

const ProfessionalLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]">
    <path d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" fill="url(#grad2)" fillOpacity="0.8" />
    <path d="M50 5 L95 25 L50 50 Z" fill="url(#grad1)" />
    <path d="M5 25 L50 50 L50 95 Z" fill="url(#grad3)" />
    <path d="M95 25 L50 50 L95 75 Z" fill="url(#grad4)" opacity="0.6"/>
    <defs>
      <linearGradient id="grad1" x1="50" y1="5" x2="50" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#a855f7" /></linearGradient>
      <linearGradient id="grad2" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#ec4899" /></linearGradient>
      <linearGradient id="grad3" x1="5" y1="25" x2="50" y2="95" gradientUnits="userSpaceOnUse"><stop stopColor="#4f46e5" /><stop offset="1" stopColor="#db2777" /></linearGradient>
      <linearGradient id="grad4" x1="50" y1="50" x2="95" y2="75" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff" /><stop offset="1" stopColor="#fbcfe8" /></linearGradient>
    </defs>
  </svg>
);

export default function Dashboard() {
  const [targetGrade, setTargetGrade] = useState(85);

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const cardVars = { hidden: { opacity: 0, scale: 0.95, y: 30 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } } };

  const classes = [
    { time: "08:00 AM", subject: "Quantum Computing", room: "Tech Park 401", active: false },
    { time: "10:45 AM", subject: "Machine Learning", room: "AI Block 205", active: true },
    { time: "01:30 PM", subject: "Advanced Math", room: "Main Block 102", active: false }
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#e8eef6] px-4 py-8 sm:px-6 lg:px-8 text-slate-800 font-sans">
      
      {/* ── Fluid Glass Waves Background (Option C) + Glitter Overlay ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Soft Shimmer Canvas Overlay for the glittery feel */}
        <div className="glitter-shimmer" />

        {/* Dynamic Translucent Waves */}
        <motion.div 
          animate={{ x: ["-10%", "-50%", "-10%"], rotate: [0, 5, 0] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] left-[10%] w-[150%] h-[500px] rounded-[100%] bg-gradient-to-r from-indigo-300/30 to-purple-200/40 blur-[40px] mix-blend-multiply border-b border-white/50" 
        />
        <motion.div 
          animate={{ x: ["-40%", "0%", "-40%"], rotate: [-5, 0, -5], y: [0, 50, 0] }} 
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] -left-[10%] w-[150%] h-[600px] rounded-[100%] bg-gradient-to-r from-pink-300/30 to-rose-200/40 blur-[40px] mix-blend-multiply border-t border-white/40" 
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col pointer-events-none min-h-screen">
        
        {/* ── Header ── */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="wet-glass w-full mb-12 flex items-center justify-between pointer-events-auto px-6 py-4 rounded-3xl"
        >
          <div className="flex items-center gap-4">
            <ProfessionalLogo />
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">Workspace</h1>
              <p className="text-[10px] text-indigo-500 uppercase tracking-[0.2em] font-bold">AcademiaPro <span className="text-pink-500">• Fluid UI</span></p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="text-right pr-2 hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Admin Session</p>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] text-indigo-500">Connected</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] ring-4 ring-white/80 backdrop-blur-md">
              A
            </div>
          </div>
        </motion.header>

        {/* ── Main Grid Container ── */}
        <motion.main 
          variants={containerVars} initial="hidden" animate="show"
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pointer-events-auto pb-10"
        >
          
          {/* Dashboard Cards wrapped in 3D Parallax Tilt with Wet Glass */}
          <motion.div variants={cardVars} className="relative perspective-[1500px] z-10">
            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.03} transitionSpeed={1500} className="h-full">
              <div className="wet-glass flex flex-col h-full rounded-[32px] p-8 relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-500 uppercase mb-8 flex items-center gap-2 drop-shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" /> Signal Check
                </h2>
                
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="neumorphic-button rounded-full w-40 h-40 flex justify-center items-center relative transition-all group-hover:bg-white/60">
                    <svg className="absolute w-full h-full transform -rotate-90 scale-[0.85] drop-shadow-[0_2px_5px_rgba(99,102,241,0.4)]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" className="stroke-white/50" strokeWidth="6" />
                      <circle cx="50" cy="50" r="45" fill="none" className="stroke-indigo-500" strokeWidth="8" strokeDasharray="283" strokeDashoffset="28" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">90<span className="text-xl text-slate-400">%</span></span>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex gap-4 text-center w-full px-2">
                    <div className="flex-1 py-2 bg-white/40 rounded-xl shadow-inner border border-white/50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Conducted</p>
                      <p className="text-xl font-black text-slate-700">400</p>
                    </div>
                    <div className="flex-1 py-2 bg-white/60 rounded-xl shadow-inner border border-white/80">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Attended</p>
                      <p className="text-xl font-black text-indigo-500">360</p>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          </motion.div>

          <motion.div variants={cardVars} className="relative perspective-[1500px] z-20">
            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.03} transitionSpeed={1500} className="h-full">
              <div className="wet-glass flex flex-col h-full relative rounded-[32px] p-8 group">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-500 uppercase mb-8 flex items-center gap-2 drop-shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" /> Grade Matrix
                </h2>
                
                <div className="flex-1 space-y-8 flex flex-col justify-center">
                  <div className="flex justify-between items-end border-b border-slate-200/50 pb-5">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Current Output</p>
                      <p className="text-4xl font-black text-slate-800 font-sans tracking-tight drop-shadow-sm">42<span className="text-lg text-slate-400 font-medium ml-1">/ 50</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Class</p>
                      <div className="neumorphic-inner bg-white/40 border border-white/60 h-12 w-12 rounded-xl flex items-center justify-center">
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-rose-500">A+</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 relative z-20">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-bold tracking-[0.1em] text-slate-600 uppercase block">Prediction Horizon</label>
                      <span className="text-xs font-black text-pink-600 bg-pink-100/50 border border-pink-200 block px-2 py-1 rounded shadow-sm">{targetGrade}%</span>
                    </div>
                    
                    <div className="neumorphic-inner h-4 rounded-full p-[3px] bg-white/50 relative flex items-center shadow-inner">
                      <input 
                        type="range" min="50" max="100" 
                        value={targetGrade} onChange={(e) => setTargetGrade(Number(e.target.value))}
                        className="w-full absolute inset-0 opacity-0 cursor-pointer z-10" 
                      />
                      <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all shadow-[0_0_10px_rgba(236,72,153,0.4)]" style={{ width: `${(targetGrade - 50) * 2}%` }} />
                      <div className="h-6 w-6 bg-white rounded-full shadow-lg border-2 border-pink-400 absolute transition-all" style={{ left: `calc(${(targetGrade - 50) * 2}% - 12px)` }} />
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          </motion.div>

          <motion.div variants={cardVars} className="relative md:col-span-2 lg:col-span-1 perspective-[1500px] z-30">
            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.03} transitionSpeed={1500} className="h-full">
              <div className="wet-glass flex flex-col h-full relative rounded-[32px] p-8 group">
                <div className="absolute top-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-500 uppercase mb-8 flex items-center gap-2 drop-shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Active Sequence
                </h2>
                
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  {classes.map((cls, i) => (
                    <motion.div 
                      key={i} whileHover={{ scale: 1.02, x: 5 }}
                      className={`relative p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${cls.active ? 'bg-white/60 shadow-[inset_0_2px_5px_rgba(255,255,255,1),0_5px_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/30' : 'bg-white/20 border border-white/40 shadow-inner'}`}
                    >
                      {cls.active && <div className="absolute -left-1 w-2 h-10 bg-purple-500 rounded-r-lg shadow-[0_0_8px_rgba(168,85,247,0.6)]" />}
                      <div className="flex-1 pl-2">
                        <p className={`text-sm font-extrabold tracking-tight ${cls.active ? 'text-purple-600' : 'text-slate-700'}`}>{cls.subject}</p>
                        <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{cls.room}</p>
                      </div>
                      <div className={`text-[10px] font-black tracking-wider px-3 py-1.5 rounded-lg ${cls.active ? 'bg-purple-100/80 text-purple-700 border-purple-200/50 border shadow-sm' : 'bg-transparent text-slate-400'}`}>
                        {cls.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Tilt>
          </motion.div>

        </motion.main>
      </div>
    </div>
  );
}
