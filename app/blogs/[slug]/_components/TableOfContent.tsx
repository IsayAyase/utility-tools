"use client";

import { useEffect, useState } from "react";

export interface Heading {
    id: string;
    text: string;
    level: number;
}

export function extractHeadings(mdxContent: string): Heading[] {
    // Remove code blocks to avoid extracting headings from code
    const contentWithoutCodeBlocks = mdxContent
        .replace(/```[\s\S]*?```/g, "") // Remove fenced code blocks
        .replace(/`[^`]+`/g, ""); // Remove inline code

    const headingRegex = /^(#{1,6})\s+(.+)$/gm; // All heading levels (H1-H6)
    const headings: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();

        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
        headings.push({ id, text, level });
    }

    return headings;
}

export function TableOfContentsRenderer({
    headings,
    activeId,
}: {
    headings: Heading[];
    activeId?: string;
}) {
    if (headings.length === 0) {
        return null;
    }

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="w-full">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                On this page
            </h4>

            <ul className="space-y-1">
                {headings.map((heading, index) => (
                    <li
                        key={index}
                        className={`relative text-sm cursor-pointer transition-colors flex gap-2 items-center ${
                            heading.level === 1
                                ? ""
                                : heading.level === 2
                                  ? "pl-3"
                                  : "pl-6"
                        }`}
                        onClick={() => scrollToHeading(heading.id)}
                    >
                        {activeId === heading.id && (
                            <span className="w-0.5 h-5 bg-primary rounded-full" />
                        )}
                        <span
                            className={`block truncate ${
                                activeId === heading.id
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {heading.text}
                        </span>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export function useActiveHeading(headings: Heading[]): string | undefined {
    const [activeId, setActiveId] = useState<string>();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleHeadings = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visibleHeadings.length > 0) {
                    setActiveId(visibleHeadings[0].target.id);
                    return;
                }

                // Fallback: if no headings are visible, find the one that just passed
                const allHeadings = entries.map(entry => ({
                    id: entry.target.id,
                    top: entry.boundingClientRect.top
                })).filter(entry => entry.top < 80); // Above the top margin

                if (allHeadings.length > 0) {
                    const lastPassed = allHeadings.reduce((last, current) => 
                        current.top > last.top ? current : last
                    );
                    setActiveId(lastPassed.id);
                }
            },
            {
                rootMargin: "-80px 0px -50% 0px",
                threshold: [0, 0.1],
            },
        );

        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) {
                    observer.observe(element);
                }
            });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [headings]);

    return activeId;
}

export default function TableOfContents({
    mdxContent,
}: {
    mdxContent: string;
}) {
    const headings = extractHeadings(mdxContent);
    const activeId = useActiveHeading(headings);

    return (
        <>
            <TableOfContentsRenderer headings={headings} activeId={activeId} />
            <style jsx global>{`
                h1,
                h2,
                h3 {
                    scroll-margin-top: 80px;
                }
            `}</style>
        </>
    );
}
