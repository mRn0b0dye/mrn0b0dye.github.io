import Link from "next/link";
import { notFound } from "next/navigation";
import { writeups } from "@/data/writeups";

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return writeups.map((w) => ({
    slug: w.slug,
  }));
}

export default function SingleWriteupPage({ params }: Props) {
  const writeup = writeups.find((w) => w.slug === params.slug);

  if (!writeup) {
    notFound();
  }

  return (
    <article className="space-y-8 max-w-3xl">
      {/* BACK LINK */}
      <div>
        <Link
          href="/writeups"
          className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
        >
          ← Back to all write-ups
        </Link>
      </div>

      {/* HEADER INFO */}
      <div className="space-y-3 pb-6 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-tagBg text-tagText font-medium">
            {writeup.platformTag}
          </span>
          {writeup.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-tagBg text-tagText">
              #{t}
            </span>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-heading leading-tight">
          {writeup.title}
        </h1>

        <div className="flex items-center gap-4 text-xs font-mono text-muted">
          <span>Published: {writeup.date}</span>
          <span>·</span>
          <span>Estimated: {writeup.readTime}</span>
        </div>
      </div>

      {/* WRITEUP BODY CONTENT */}
      <div
        className="prose prose-slate dark:prose-invert max-w-none text-body text-sm leading-relaxed space-y-4 [&>h2]:text-heading [&>h2]:text-lg [&>h2]:font-bold [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-border [&>ul]:list-disc [&>ul]:pl-5 [&>p]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: writeup.contentHtml }}
      />

      {/* FOOTER CALLOUT */}
      <div className="pt-8 border-t border-border flex items-center justify-between font-mono text-xs text-muted">
        <Link href="/writeups" className="text-accent hover:underline">
          ← View more write-ups
        </Link>
        <span>Authorized Environment Only</span>
      </div>
    </article>
  );
}
