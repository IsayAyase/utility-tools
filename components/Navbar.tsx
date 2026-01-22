"use client";

import { racingSansOne } from "@/app/fonts";
import { Input } from "@/components/ui/input";
import { mainData } from "@/contents/mainData";
import { Wrench } from "lucide-react";
import { useTheme } from "next-themes";
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
            <nav className="max-w-9xl mx-auto max-h-16 h-full px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    {/* {!iconUrl ? (
                        <span className="size-9 rounded-md bg-muted animate-pulse" />
                    ) : (
                        <Image
                            alt="Blade"
                            width={100}
                            height={100}
                            className="size-9 rounded-md object-cover"
                            src={iconUrl}
                        />
                    )} */}
                    {/* <Logo className="size-8" /> */}
                    <h3
                        className={`text-xl italic font-semibold tracking-wide ${racingSansOne.className}`}
                    >
                        {mainData.title}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 md:gap-4 h-5">
                    <div className="relative w-full hidden md:block">
                        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                        <Input
                            type="search"
                            placeholder="Search tools..."
                            className="pl-8 placeholder:text-xs text-xs h-7.5"
                        />
                    </div>

                    <Link href={"/tools"}>
                        <Button size={"sm"} variant="outline">
                            <span>Tools</span>
                            <Wrench />
                        </Button>
                    </Link>
                    
                    <Link
                        target="_blank"
                        className="hidden md:block"
                        href={"https://github.com/IsayAyase"}
                    >
                        <Button size={"icon-sm"} variant="outline">
                            <FaGithub />
                        </Button>
                    </Link>
                    <ToogleMode />
                </div>
            </nav>
        </div>
    );
}
