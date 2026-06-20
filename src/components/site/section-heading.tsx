"use client";

import { Link as LinkIcon, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SECTION_META } from "@/lib/data";

/**
 * Section heading with a hover-revealed anchor-link button and an optional
 * read-time chip. Renders an h2 with an optional id and a # icon that copies
 * the section URL to the clipboard on click and fires a toast notification.
 *
 * The read-time chip is auto-derived from SECTION_META[id] — no prop needed.
 * The `.section-anchor` also receives a `--read-progress` CSS variable
 * (0–100%) from the global ReadingProgress tracker, which fills a copper
 * underline as the reader scrolls through the section.
 */
export function SectionHeading({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const meta = SECTION_META[id];

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
    // Update the URL hash without scrolling
    history.replaceState(null, "", `#${id}`);
    // Fire a toast so the user knows the link was copied
    toast({
      title: "Link copied",
      description: `#${id} is on your clipboard.`,
    });
  };

  return (
    <h2 id={id} className={`group relative scroll-mt-20 ${className}`}>
      {children}
      <a
        href={`#${id}`}
        onClick={handleClick}
        className="section-anchor ml-1.5 inline-flex align-middle"
        aria-label={`Link to ${id} section`}
        title="Copy link to this section"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </a>
      {meta && (
        <span className="readtime-chip ml-2 align-middle" title={`≈ ${meta.readTime} minute read`}>
          <Clock className="h-2.5 w-2.5" />
          ≈ {meta.readTime} min
        </span>
      )}
    </h2>
  );
}
