"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(nextTheme);
  };

  return (
    <header className="border-b border-border bg-header/90 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono font-semibold text-heading text-xs">Abdullah</span>
          <span className="text-muted font-mono text-xs">/</span>
          <span className="text-muted font-mono text-xs">portfolio</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 font-mono text-xs text-muted">
          <Link href="/#about" className="hover:text-heading transition-colors">
            About
          </Link>
          <Link href="/writeups" className="hover:text-heading transition-colors">
            Write-ups
          </Link>
          <Link href="/projects" className="hover:text-heading transition-colors">
            Projects
          </Link>
          <Link href="/#contact" className="hover:text-heading transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">

          <div className="h-4 w-px bg-border mx-1"></div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1 rounded border border-border bg-card text-heading font-mono text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {theme === "dark" ? "🔆 Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
