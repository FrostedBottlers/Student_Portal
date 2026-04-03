import "./globals.css";
import { Inter, Press_Start_2P } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeSwitcher from "./components/ThemeSwitcher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
  title: "Amusable Premium Portal",
  description: "Next-gen immersive academic portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pixel.variable} antialiased relative`}>
        <ThemeProvider>
          <div className="theme-bg-overlay" />
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
