"use client";

import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import ToogleMode from "./ToogleMode";
import { Button } from "./ui/button";

export default function Navbar() {
    const [iconUrl, setIconUrl] = useState("");
    const { theme } = useTheme();
    useEffect(() => {
        setIconUrl(
            theme === "dark"
                ? "/garlic-tools-sm-dark.jpg"
                : "/garlic-tools-sm-light.jpg",
        );
    }, [theme]);

    return (
        <div className="w-full">
            <nav className="max-w-9xl mx-auto max-h-16 h-full px-6 py-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                    {!iconUrl ? (
                        <span className="size-9 rounded-md bg-muted animate-pulse" />
                    ) : (
                        <Image
                            alt="Garlic Tools"
                            width={100}
                            height={100}
                            className="size-9 rounded-md object-cover"
                            src={iconUrl}
                        />
                    )}
                    <h3 className="text-xl">Garlic Tools</h3>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-full hidden md:block">
                        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                        <Input
                            type="search"
                            placeholder="Search tools..."
                            className="pl-8 placeholder:text-xs text-xs h-9"
                        />
                    </div>
                    <Link target="_blank" href={"https://github.com/IsayAyase"}>
                        <Button size={"icon"} variant="outline">
                            <FaGithub />
                        </Button>
                    </Link>
                    <ToogleMode />
                </div>
            </nav>
        </div>
    );
}
