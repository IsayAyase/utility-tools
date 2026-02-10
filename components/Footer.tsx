"use client";

import { racingSansOne } from "@/app/fonts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mainData } from "@/contents/mainData";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function Footer() {
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const resize = () => {
            const parent = el.parentElement!;
            const effectiveWidth = Math.min(parent.offsetWidth, 800); // cap
            const length = el.innerText.length || 1;

            const fontsize = (effectiveWidth / length) * 2;
            el.style.fontSize = `${fontsize}px`;
            el.style.height = `${fontsize - 50}px`;
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div
            className="relative w-full mt-8 p-4 pb-20 h-full border-t bg-background"
            id="footer"
        >
            <div className="relative z-10 h-full w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:gap-4 mt-2 md:mt-6">
                <div className="text-sm text-muted-foreground">
                    {"Build by "}{" "}
                    <Link
                        href="https://x.com/prabhatlabs"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline w-fit"
                    >
                        prabhatlabs
                    </Link>
                    {` • ${mainData.title} © ${new Date().getFullYear()}`}
                </div>

                <div className="flex items-center gap-4">
                    {mainData.footer.sections.map((sec, index) => (
                        <DropdownMenu key={index}>
                            <DropdownMenuTrigger className="text-sm flex items-center focus:outline-0">
                                <span>{sec.title}</span>
                                <RiArrowDropDownLine className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top">
                                {sec.links.map((link, index) => (
                                    <DropdownMenuItem key={index}>
                                        <Link
                                            href={link.url}
                                            target={link.target}
                                        >
                                            {link.title}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ))}
                </div>
            </div>

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

            <div className="flex justify-center w-full h-full">
                <h1
                    ref={ref}
                    className={`${racingSansOne.className}
                        text-muted-foreground
                        whitespace-nowrap
                        tracking-tighter
                        leading-none
                    `}
                >
                    Blade Tools
                </h1>
            </div>
        </div>
    );
}
