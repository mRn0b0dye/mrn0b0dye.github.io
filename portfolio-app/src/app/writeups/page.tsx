"use client";

import { useState } from "react";
import Link from "next/link";
import { writeups } from "@/data/writeups";

export default function WriteupsArchivePage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const tags = ["All", "TryHackMe", "Blockchain", "Web3"];

  const filteredWriteups =
    selectedTag === "All"
      ? writeups
      : writeups.filter(
          (w) => w.platformTag === selectedTag || w.tags.includes(selectedTag)
        );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <Link href="/" className="font-mono text-xs text-accent hover:underline inline-block">
          ← Back to Overview
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-heading">Write-ups Archive</h1>
        <p className="text-sm text-body">
          Detailed technical walkthroughs, proof-of-concepts, and remediation analyses across penetration testing labs and smart contract audits.
        </p>
      </div>

      {/* FILTER TAGS */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              selectedTag === tag
                ? "border-accent bg-card text-accent font-medium shadow-sm"
                : "border-border bg-card text-muted hover:text-heading"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* WRITE-UPS LIST */}
      <div className="space-y-3">
        {filteredWriteups.length > 0 ? (
          filteredWriteups.map((w) => (
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
                    {w.tags.map((t) => (
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
                <div className="text-right shrink-0">
                  <span className="text-muted font-mono text-xs block">{w.readTime}</span>
                  <span className="text-muted font-mono text-[11px] block">{w.date}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-muted font-mono text-xs border border-border rounded-xl">
            No write-ups found for the selected tag.
          </div>
        )}
      </div>
    </div>
  );
}
