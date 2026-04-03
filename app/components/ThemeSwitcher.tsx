"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-[9999] flex items-center justify-end px-8 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 bg-[var(--panel-bg)] p-1.5 rounded-full shadow-[var(--shadow-neumorphic)] border border-[var(--panel-border)] backdrop-blur-xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-color)] ml-3 mr-2 opacity-80 select-none">
          THEME
        </span>
        <div className="flex bg-[var(--input-bg)] rounded-full p-1 relative shadow-inner gap-1">
          {/* Dark / Gold Icon */}
          <button
            onClick={() => setTheme("dark")}
            title="Dark Stealth"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              theme === "dark" ? "bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)]" : "hover:bg-[var(--text-main)]/10"
            }`}
          >
            <span className={`${theme === "dark" ? "text-black" : "text-[var(--text-main)]"} font-bold text-xs`}>D</span>
          </button>

          {/* Neo Light Icon */}
          <button
            onClick={() => setTheme("light")}
            title="Neo Light"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              theme === "light" ? "bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)]" : "hover:bg-[var(--text-main)]/10"
            }`}
          >
            <span className={`${theme === "light" ? "text-white" : "text-[var(--text-main)]"} font-sans font-bold text-xs`}>L</span>
          </button>

          {/* Minecraft Pixel Icon */}
          <button
            onClick={() => setTheme("minecraft")}
            title="Minecraft Sandbox"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              theme === "minecraft" ? "bg-[#71B238] shadow-[0_0_10px_#71B238]" : "hover:bg-[var(--text-main)]/10"
            }`}
          >
            <span className="text-white font-mono font-bold text-xs">M</span>
          </button>
        </div>
      </div>
    </div>
  );
}
