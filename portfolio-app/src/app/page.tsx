import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { writeups } from "@/data/writeups";
import { projects } from "@/data/projects";

export default function HomePage() {
  const cyberProjects = projects.filter((p) => p.category === "cybersecurity");
  const blockchainProjects = projects.filter((p) => p.category === "blockchain");

  return (
    <div className="space-y-12">
      {/* HERO SECTION WITH LARGE AVATAR & OPEN TO WORK BADGE */}
      <section id="about" className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pt-2">
        {/* LARGE AVATAR (160px on desktop) */}
        <div className="shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-border bg-card shadow-md flex items-center justify-center relative">
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 text-muted">
              <svg className="w-20 h-20 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="text-[10px] font-mono mt-1 opacity-75">Your Photo</span>
            </div>
          </div>
        </div>

        {/* HEADLINE & BIO */}
        <div className="space-y-3 flex-1 text-center sm:text-left">
          {/* OPEN TO WORK STATUS PILL */}
          {siteConfig.isOpenToWork && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-card text-muted font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-heading font-medium">{siteConfig.openToWorkText}</span>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-card text-muted font-mono text-xs ml-0 sm:ml-2">
            <span className="h-2 w-2 rounded-full bg-sky-500"></span>
            <span>{siteConfig.statusBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading leading-tight">
            {siteConfig.title}
          </h1>

          <p className="text-body text-sm leading-relaxed max-w-xl">{siteConfig.bio}</p>

          {/* SOCIAL LINKS */}
          <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 font-mono text-xs">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center gap-1.5 font-medium"
            >
              GitHub
            </a>
            <span className="text-border">·</span>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center gap-1.5 font-medium"
            >
              LinkedIn
            </a>
            <span className="text-border">·</span>
            <a
              href={`mailto:${siteConfig.socials.email}`}
              className="text-accent hover:underline flex items-center gap-1.5 font-medium"
            >
              Gmail
            </a>
          </div>
        </div>
      </section>

      {/* RECENT WRITE-UPS SECTION */}
      <section id="writeups" className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-heading uppercase tracking-wider">
            Recent Write-ups
          </h2>
          <Link href="/writeups" className="font-mono text-xs text-accent hover:underline">
            View All Write-ups ({writeups.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {writeups.map((w) => (
            <Link
              key={w.slug}
              href={`/writeups/${w.slug}`}
              className="block p-4 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-heading group-hover:text-accent transition-colors">
                      {w.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-tagBg text-tagText">
                      {w.platformTag}
                    </span>
                    {w.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-tagBg text-tagText"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-body text-xs leading-relaxed">{w.excerpt}</p>
                </div>
                <span className="text-muted font-mono text-xs shrink-0 pt-0.5">{w.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION (2 CLEAN CATEGORIES) */}
      <section id="projects" className="space-y-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-heading uppercase tracking-wider">Projects</h2>
          <Link href="/projects" className="font-mono text-xs text-accent hover:underline">
            View All Projects →
          </Link>
        </div>

        {/* 1. Cybersecurity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="text-heading font-semibold">Cybersecurity</span>
            <span>·</span>
            <span>Tooling & Scanners</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cyberProjects.slice(0, 2).map((p) => (
              <div key={p.title} className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-heading font-semibold text-xs">{p.title}</span>
                  <span className="text-muted font-mono text-[11px]">{p.tech[0]}</span>
                </div>
                <p className="text-body text-xs">{p.description}</p>
                <div className="flex items-center justify-between pt-1 font-mono text-xs">
                  <span className="text-tagText text-[11px]">{p.tech.join(" · ")}</span>
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline font-medium"
                  >
                    repo →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Blockchain */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="text-heading font-semibold">Blockchain</span>
            <span>·</span>
            <span>Smart Contracts & Security</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {blockchainProjects.slice(0, 2).map((p) => (
              <div key={p.title} className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-heading font-semibold text-xs">{p.title}</span>
                  <span className="text-muted font-mono text-[11px]">{p.tech[0]}</span>
                </div>
                <p className="text-body text-xs">{p.description}</p>
                <div className="flex items-center justify-between pt-1 font-mono text-xs">
                  <span className="text-tagText text-[11px]">{p.tech.join(" · ")}</span>
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline font-medium"
                  >
                    repo →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-xs font-mono font-bold text-heading uppercase tracking-wider">Contact</h2>
        <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-heading">
              Interested in collaborating or discussing security research?
            </p>
            <p className="text-xs text-body">
              Feel free to send an email directly to my inbox.
            </p>
          </div>
          <a
            href={`mailto:${siteConfig.socials.email}`}
            className="px-3.5 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/10 font-mono text-xs flex items-center gap-2 transition-colors font-medium w-fit"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span>Send Email</span>
          </a>
        </div>
      </section>
    </div>
  );
}
