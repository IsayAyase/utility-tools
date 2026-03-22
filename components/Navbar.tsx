"use client";

import { toolsArray } from "@/lib/tools";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineFeedback } from "react-icons/md";
import SearchBar from "./SearchBar";
import TitleTextWithNetStatus from "./TitleTextWithNetStatus";
import ToogleMode from "./ToogleMode";
import { Button } from "./ui/button";

const SCROLL_THRESHOLD = 500;

export default function Navbar() {
    const [progress, setProgress] = useState(0); // 0 = top, 1 = fully scrolled

    useEffect(() => {
        const handleScroll = () => {
            const p = Math.min(window.scrollY / SCROLL_THRESHOLD, 1);
            setProgress(p);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Interpolate between start and end values based on progress
    const lerp = (start: number, end: number) =>
        start + (end - start) * progress;

    const maxWidth = lerp(1280, 768);
    const shadowOpacity = lerp(0, 0.15);

    return (
        <div className="w-full fixed top-0 left-0 z-50 flex justify-center p-4">
            <nav
                style={{
                    maxWidth: `${maxWidth}px`,
                    boxShadow: `0 4px 24px rgba(0,0,0,${shadowOpacity})`,
                    width: "100%",
                }}
                className="backdrop-blur-lg bg-white/10 dark:bg-white/5 border rounded-lg p-4 pl-6 flex items-center justify-between transition-none"
            >
                <TitleTextWithNetStatus />

                <div className="flex items-center gap-2 md:gap-4 h-5">
                    <SearchBar toolsData={toolsArray} />

                    <Link href={"/tools"}>
                        <Button size={"sm"} variant="outline" className="bg-transparent hidden md:flex">
                            <span>Tools</span>
                            <Wrench />
                        </Button>
                        <Button size={"icon-sm"} variant="outline" className="bg-transparent md:hidden">
                            <Wrench />
                        </Button>
                    </Link>

                    <Link target="_blank" href={"https://x.com/prabhatlabs"}>
                        <Button size={"icon-sm"} variant="outline" className="bg-transparent">
                            <FaXTwitter />
                        </Button>
                    </Link>

                    <Link
                        target="_blank"
                        href={"https://github.com/IsayAyase/utility-tools"}
                        className="hidden md:block"
                    >
                        <Button size={"icon-sm"} variant="outline" className="bg-transparent">
                            <FaGithub />
                        </Button>
                    </Link>

                    <Link href={"/give-feedback"}>
                        <Button size={"icon-sm"} variant="outline" className="bg-transparent">
                            <MdOutlineFeedback />
                        </Button>
                    </Link>

                    <ToogleMode />
                </div>
            </nav>
        </div>
    );
}
