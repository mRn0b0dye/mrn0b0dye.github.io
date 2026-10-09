"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

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
          {/* GitHub */}
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="text-muted hover:text-heading transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="text-muted hover:text-heading transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
            </svg>
          </a>

          {/* Gmail */}
          <a
            href={`mailto:${siteConfig.socials.email}`}
            title="Gmail"
            className="text-muted hover:text-heading transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>

          <div className="h-4 w-px bg-border mx-1"></div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1 rounded border border-border bg-card text-heading font-mono text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
