import Link from "next/link";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  const cyberProjects = projects.filter((p) => p.category === "cybersecurity");
  const blockchainProjects = projects.filter((p) => p.category === "blockchain");

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Link href="/" className="font-mono text-xs text-accent hover:underline inline-block">
          ← Back to Overview
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-heading">All Projects</h1>
        <p className="text-sm text-body">
          Open-source penetration testing tools, reconnaissance scripts, and decentralized smart contract security suites.
        </p>
      </div>

      {/* 1. Cybersecurity Subcategory */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="text-heading font-semibold text-sm">Cybersecurity & Offensive Tooling</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cyberProjects.map((p) => (
            <div
              key={p.title}
              className="p-5 rounded-xl border border-border bg-card space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-heading font-semibold text-sm">{p.title}</span>
                  <span className="text-muted font-mono text-xs">{p.tech[0]}</span>
                </div>
                <p className="text-body text-xs leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 font-mono text-xs">
                <span className="text-tagText text-[11px]">{p.tech.join(" · ")}</span>
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-medium"
                >
                  GitHub Repo →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Blockchain Subcategory */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="text-heading font-semibold text-sm">Blockchain & Smart Contract Security</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blockchainProjects.map((p) => (
            <div
              key={p.title}
              className="p-5 rounded-xl border border-border bg-card space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-heading font-semibold text-sm">{p.title}</span>
                  <span className="text-muted font-mono text-xs">{p.tech[0]}</span>
                </div>
                <p className="text-body text-xs leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 font-mono text-xs">
                <span className="text-tagText text-[11px]">{p.tech.join(" · ")}</span>
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-medium"
                >
                  GitHub Repo →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
