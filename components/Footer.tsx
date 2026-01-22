"use client";

import { racingSansOne } from "@/app/fonts";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Footer() {
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const resize = () => {
            const parent = el.parentElement!;
            const effectiveWidth = Math.min(parent.offsetWidth, 1500); // cap
            const length = el.innerText.length || 1;

            el.style.fontSize = `${(effectiveWidth / length) * 2}px`;
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div className="relative w-full p-4 h-full mt-20" id="footer">
            <div className="absolute bottom-0 left-0 w-full h-36 md:h-40 lg:h-52 xl:h-60">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(180deg, 
                                    transparent 0%, 
                                    transparent 25%, 
                                    color-mix(in oklab, var(--background) 40%, transparent) 45%, 
                                    color-mix(in oklab, var(--background) 45%, transparent) 50%, 
                                    color-mix(in oklab, var(--background) 60%, transparent) 70%, 
                                    color-mix(in oklab, var(--background) 65%, transparent) 85%, 
                                    color-mix(in oklab, var(--background) 75%, transparent) 100%
                                )`,
                        backdropFilter: `blur(0px)`,
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(180deg, 
                    transparent 0%, 
                                    color-mix(in oklab, var(--background) 20%, transparent) 60%, 
                                    color-mix(in oklab, var(--background) 30%, transparent) 70%, 
                                    color-mix(in oklab, var(--background) 40%, transparent) 80%, 
                                    color-mix(in oklab, var(--background) 50%, transparent) 90%, 
                                    color-mix(in oklab, var(--background) 60%, transparent) 100%
                                )`,
                        backdropFilter: `blur(8px)`,
                        maskImage: `linear-gradient(180deg, 
                                    transparent 0%, 
                                    transparent 10%, 
                                    color-mix(in oklab, var(--foreground) 20%, transparent) 55%, 
                                    color-mix(in oklab, var(--foreground) 30%, transparent) 65%, 
                                    color-mix(in oklab, var(--foreground) 50%, transparent) 75%, 
                                    color-mix(in oklab, var(--foreground) 70%, transparent) 85%, 
                                    color-mix(in oklab, var(--foreground) 100%, transparent) 100%
                                )`,
                    }}
                />
            </div>
            <div className="flex justify-center w-full h-full">
                <h1
                    ref={ref}
                    className={`${racingSansOne.className}
                        text-muted-foreground
                        whitespace-nowrap
                        tracking-tighter
                        leading-none
                        mb-6 sm:mb-4 md:mb-6 
                    `}
                >
                    Blade Tools
                </h1>
            </div>
            <div className="absolute bottom-0 left-0 z-10 text-xs text-muted-foreground w-full h-fit my-2 sm:my-4 md:my-6 flex flex-col items-center sm:flex-row sm:justify-center gap-1">
                <span>
                    {"Build by"}{" "}
                    <Link
                        href="https://x.com/prabhatlabs"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                    >
                        prabhatlabs
                    </Link>
                </span>
                <span>{` • Blade © ${new Date().getFullYear()}. All rights reserved.`}</span>
            </div>
        </div>
    );
}
