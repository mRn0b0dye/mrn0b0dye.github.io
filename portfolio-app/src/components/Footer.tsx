import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

export function Footer() {
  return (
    <footer className="pt-8 border-t border-border mt-16 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted">
      <div>{siteConfig.title}</div>
      <div className="flex items-center gap-4">
        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-heading transition-colors"
        >
          GitHub
        </a>
        <a
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-heading transition-colors"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${siteConfig.socials.email}`}
          className="hover:text-heading transition-colors"
        >
          Gmail
        </a>
      </div>
    </footer>
  );
}
