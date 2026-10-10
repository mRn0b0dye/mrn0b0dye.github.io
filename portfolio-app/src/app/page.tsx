import Link from "next/link";
import Image from "next/image";
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
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-border bg-card shadow-md flex items-center justify-center relative">
            <Image
              src={siteConfig.avatar}
              alt={`${siteConfig.name} profile picture`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, 160px"
              priority
            />
          </div>
        </div>

        {/* HEADLINE & BIO */}
        <div className="space-y-3 flex-1 text-center sm:text-left">
          {/* OPEN TO WORK STATUS PILL */}
          {siteConfig.isOpenToWork && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-card text-muted font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-heading font-medium"><b>{siteConfig.openToWorkText}</b></span>
            </div>
          )}

          <h1 className="text-3xl sm:text-3xl font-bold tracking-tight text-heading leading-tight">
            {siteConfig.name}
          </h1>

          <p className="text-body text-sm font-bold font-mono">{siteConfig.title}</p>

          {/* SOCIAL LINKS */}
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="text-accent hover:text-heading transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="text-accent hover:text-heading transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
              </svg>
            </a>
            <a
              href={`mailto:${siteConfig.socials.email}`}
              aria-label="Email"
              title="Gmail"
              className="text-accent hover:text-heading transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* RECENT WRITE-UPS SECTION */}
      <section id="writeups" className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xs font-mono font-bold text-heading uppercase tracking-wider">
            Recent Write-ups
          </h1>
          <b><Link href="/writeups" className="font-mono text-xs text-accent hover:underline">
            View All Write-ups ({writeups.length}) →
          </Link></b>
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
          <h1 className="text-xs font-mono font-bold text-heading uppercase tracking-wider">Projects</h1>
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
