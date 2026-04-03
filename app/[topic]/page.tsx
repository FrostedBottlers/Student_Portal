"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useTheme } from "../components/ThemeProvider";

export default function GenericTopicPage() {
  const { topic } = useParams();
  const router = useRouter();
  const { theme } = useTheme();

  const formattedTitle = typeof topic === "string" 
    ? topic.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) 
    : "Module Details";

  // Comprehensive Dummy Data Generator for 38+ Categories
  const renderDummyContent = () => {
    const topicStr = String(topic).toLowerCase();

    // 1. Finance & Fees 
    if (topicStr.includes("fee") || topicStr.includes("finance") || topicStr.includes("stipend")) {
      return (
        <div className="space-y-4">
          <div className="p-4 neumorphic-inner rounded-xl mb-8 flex justify-between items-center text-rose-500">
             <span className="text-xs uppercase font-bold tracking-widest">Total Outstanding</span>
             <span className="text-2xl font-black">₹ 12,000</span>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 border-b border-[var(--panel-border)] bg-[var(--panel-bg)]/30 hover:bg-[var(--panel-bg)] transition-colors rounded-xl mb-2">
              <div>
                <p className="font-bold text-[var(--text-main)] text-sm">{topicStr.includes("stipend") ? "Monthly Stipend" : "Tuition Installment"} {i}</p>
                <p className="text-[10px] text-[var(--accent-color)] mt-1 tracking-widest uppercase">Ref: #TXN-09{i}8{i + 3}3</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[var(--text-main)]">₹ {i * 15},000</p>
                <p className={`text-[9px] px-2 py-0.5 rounded-full mt-1 border inline-block uppercase font-bold ${
                   i === 1 ? 'bg-rose-500/10 text-rose-500 border-rose-500/50' : 'bg-green-500/10 text-green-500 border-green-500/50'
                }`}>
                  {i === 1 ? 'Pending' : 'Completed'}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 2. Transcripts, Certificates & Documents
    if (topicStr.includes("certificate") || topicStr.includes("transcript") || topicStr.includes("gazette") || topicStr.includes("policy")) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="col-span-1 border border-[var(--panel-border)] bg-gray-50/10 dark:bg-black/20 rounded-2xl p-8 h-96 flex flex-col justify-between shadow-inner">
             {/* Simulated PDF / Paper Document */}
             <div className="space-y-4 opacity-50">
               <div className="h-4 w-3/4 bg-current rounded-full" />
               <div className="h-2 w-full bg-current rounded-full" />
               <div className="h-2 w-5/6 bg-current rounded-full" />
               <div className="h-2 w-full bg-current rounded-full" />
               <div className="h-10 w-full bg-current rounded mt-8" />
             </div>
             <div className="text-right">
               <div className="inline-block w-20 h-20 border-4 border-red-500/50 rounded-full flex items-center justify-center -rotate-12">
                 <span className="text-red-500/50 font-bold uppercase text-[10px] tracking-widest">OFFICIAL</span>
               </div>
             </div>
           </div>
           
           <div className="col-span-1 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">Actions</h3>
              <button className="w-full theme-button py-4 rounded-xl flex items-center justify-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 Download Copy
              </button>
              <button className="w-full bg-[var(--input-bg)] border border-[var(--panel-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all">
                 Request Physical Print
              </button>
           </div>
        </div>
      );
    }

    // 3. Forms (Hostel Booking, Profile, Service Request)
    if (topicStr.includes("booking") || topicStr.includes("details") || topicStr.includes("request")) {
      return (
         <form className="space-y-6 max-w-2xl bg-[var(--panel-bg)]/50 p-8 rounded-[var(--radius-panel)] border border-[var(--panel-border)]" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Request Type / Selection</label>
               <select className="w-full neumorphic-inner h-14 px-4 bg-transparent outline-none text-[var(--text-main)] appearance-none font-semibold text-sm">
                  <option>General Application</option>
                  <option>Premium Upgrade</option>
                  <option>Urgent Processing</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Additional Remarks</label>
               <textarea rows={4} className="w-full neumorphic-inner p-4 bg-transparent outline-none text-[var(--text-main)] resize-none font-medium text-sm" placeholder="Type your context here..."></textarea>
            </div>
            <button className="theme-button px-8 py-4 rounded-xl w-full sm:w-auto uppercase tracking-[0.2em] text-[10px]">
               Submit Application
            </button>
         </form>
      );
    }

    // Default Fallback: Beautiful Data List (Grades, Marks, Notices etc.)
    return (
      <div className="w-full text-left border-collapse rounded-[var(--radius-panel)] overflow-hidden border border-[var(--panel-border)] bg-[var(--panel-bg)]">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--panel-border)] text-[9px] text-[var(--text-muted)] tracking-[0.2em] uppercase bg-[var(--input-bg)]">
                <th className="p-4 text-left font-bold">Identifier</th>
                <th className="p-4 text-left font-bold">Subject / Scope</th>
                <th className="p-4 text-center font-bold">Metric / Data</th>
                <th className="p-4 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {[1,2,3,4,5].map(id => (
                <tr key={id} className="border-b border-[var(--panel-border)] hover:bg-[var(--input-bg)]/50 transition-colors">
                  <td className="p-4 text-[10px] font-mono tracking-widest text-[var(--accent-color)]">#NODE-40{id}</td>
                  <td className="p-4">Quantum Physics & Applied Theory</td>
                  <td className="p-4 text-center"><span className="px-3 py-1 bg-[var(--text-main)]/10 rounded-full text-xs font-bold border border-[var(--panel-border)]">9{id}%</span></td>
                  <td className="p-4 text-right"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] uppercase font-bold tracking-widest border border-green-500/20">Synced</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--bg-color)] text-[var(--text-main)]">
      
      {/* Container */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-none pb-20">
        
        {/* Simple Header */}
        <header className="flex-none p-6 md:p-10 pointer-events-auto">
          <button 
             onClick={() => router.push("/")}
             className="flex items-center text-[10px] uppercase tracking-[0.2em] font-black text-[var(--accent-color)] hover:text-[var(--text-main)] transition-colors group px-4 py-2 bg-[var(--input-bg)] rounded-full border border-[var(--panel-border)] w-fit"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK TO DASHBOARD
          </button>
        </header>

        <motion.div 
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.6, ease: "easeOut" }}
           className="px-6 md:px-12 pointer-events-auto w-full max-w-6xl mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-main)] mb-3">
              {formattedTitle}
            </h1>
            <p className="text-[var(--text-muted)] text-sm md:text-base font-medium max-w-2xl leading-relaxed">
               Dummy content specifically modeled for your interaction with the <strong className="text-[var(--accent-color)]">{formattedTitle}</strong> portal module. The system has automatically adopted the <span className="uppercase tracking-widest text-[10px] mx-1 border border-[var(--panel-border)] px-1 rounded bg-[var(--panel-bg)]">{theme}</span> active configuration.
            </p>
          </div>

          <div className="w-full">
            {renderDummyContent()}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
