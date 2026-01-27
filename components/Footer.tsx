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
            const effectiveWidth = Math.min(parent.offsetWidth, 1280); // cap
            const length = el.innerText.length || 1;

            el.style.fontSize = `${(effectiveWidth / length) * 2}px`;
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div
            className="relative w-full mt-8 p-4 h-full bg-black text-white border-t border-muted-foreground/30"
            id="footer"
        >
            <div className="relative z-10 h-full w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:gap-4 mt-2 md:mt-6 md:mb-10">
                <div className="text-sm text-white/60">
                    {"Build by "}{" "}
                    <Link
                        href="https://x.com/prabhatlabs"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline hover:text-white/90 w-fit"
                    >
                        prabhatlabs
                    </Link>
                    {` • ${mainData.title} © ${new Date().getFullYear()}`}
                </div>

                <div className="flex items-center gap-4">
                    {mainData.footer.sections.map((sec, index) => (
                        <DropdownMenu key={index}>
                            <DropdownMenuTrigger className="text-sm flex items-center focus:outline-0 text-white/60 hover:text-white/90">
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

            <div className="absolute bottom-0 left-0 w-full h-36 md:h-40 lg:h-52 xl:h-60">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(180deg, 
                                    transparent 0%, 
                                    transparent 25%, 
                                    color-mix(in oklab, black 40%, transparent) 45%, 
                                    color-mix(in oklab, black 45%, transparent) 50%, 
                                    color-mix(in oklab, black 60%, transparent) 70%, 
                                    color-mix(in oklab, black 65%, transparent) 85%, 
                                    color-mix(in oklab, black 75%, transparent) 100%
                                )`,
                        backdropFilter: `blur(0px)`,
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(180deg, 
                    transparent 0%, 
                                    color-mix(in oklab, black 20%, transparent) 60%, 
                                    color-mix(in oklab, black 30%, transparent) 70%, 
                                    color-mix(in oklab, black 40%, transparent) 80%, 
                                    color-mix(in oklab, black 50%, transparent) 90%, 
                                    color-mix(in oklab, black 60%, transparent) 100%
                                )`,
                        backdropFilter: `blur(8px)`,
                        maskImage: `linear-gradient(180deg, 
                                    transparent 0%, 
                                    transparent 10%, 
                                    color-mix(in oklab, white 20%, transparent) 55%, 
                                    color-mix(in oklab, white 30%, transparent) 65%, 
                                    color-mix(in oklab, white 50%, transparent) 75%, 
                                    color-mix(in oklab, white 70%, transparent) 85%, 
                                    color-mix(in oklab, white 100%, transparent) 100%
                                )`,
                    }}
                />
            </div>

            <div className="flex justify-center w-full h-full">
                <h1
                    ref={ref}
                    className={`${racingSansOne.className}
                        text-red-900
                        whitespace-nowrap
                        tracking-tighter
                        leading-20 sm:leading-28 md:leading-36
                    `}
                >
                    Blade Tools
                </h1>
            </div>
        </div>
    );
}
