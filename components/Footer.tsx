"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <div className="relative w-full p-4 h-footer-height" id="footer">
            <div className="absolute bottom-0 left-0 w-full h-full">
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
            <div className="-z-10 absolute bottom-0 left-0 right-0 flex justify-center w-full md:h-2/3 lg:h-3/4">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight text-muted-foreground mb-10">
                    Garlic Tools
                </h1>
            </div>
            <div className="absolute bottom-0 left-0 z-10 text-xs text-muted-foreground w-full h-0 my-4 flex flex-col items-center md:flex-row md:justify-center gap-1">
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
                <span>{` • Garlic Tools © ${new Date().getFullYear()}. All rights reserved.`}</span>
            </div>
        </div>
    );
}
