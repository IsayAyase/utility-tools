"use client";

import { racingSansOne } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiWorld } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiBuymeacoffee } from "react-icons/si";

export default function Footer() {
    return (
        <footer className="px-6 md:px-8 xl:px-20 py-8 md:py-12 mt-12 md:mt-20 relative border-t">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1
                        className={`${racingSansOne.className}
                        text-muted-foreground
                        whitespace-nowrap
                        tracking-tighter
                        leading-none
                        text-4xl sm:text-5xl lg:text-7xl
                    `}
                    >
                        Blade Tools
                    </h1>
                    <div className="hidden md:flex items-center gap-2 md:gap-4 h-5">
                        <Link
                            target="_blank"
                            href={"https://x.com/prabhatlabs"}
                        >
                            <Button size={"icon-sm"} variant="outline">
                                <FaXTwitter />
                            </Button>
                        </Link>

                        <Link
                            target="_blank"
                            href={"https://github.com/IsayAyase/utility-tools"}
                        >
                            <Button size={"icon-sm"} variant="outline">
                                <FaGithub />
                            </Button>
                        </Link>
                        
                        <Link
                            target="_blank"
                            href={"https://prabhatlabs.dev"}
                        >
                            <Button size={"icon-sm"} variant="outline">
                                <BiWorld />
                            </Button>
                        </Link>
                        
                        <Link
                            target="_blank"
                            href={"https://www.buymeacoffee.com/prabhatlabs"}
                        >
                            <Button size={"icon-sm"} variant="outline">
                                <SiBuymeacoffee />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <p className="text-muted-foreground text-xs lg:text-sm">
                        <span>
                            {"Build by"}{" "}
                            <Link
                                href="https://github.com/IsayAyase"
                                target="_blank"
                                rel="noreferrer"
                                className="underline"
                            >
                                IsayAyase
                            </Link>
                        </span>{" "}
                        <span className="hidden sm:inline-block">{`• bladetools.prabhatlabs.dev © 2025 • All rights reserved.`}</span>
                        <span className="inline-block sm:hidden">{`• bladetools.prabhatlabs.dev © 2025`}</span>
                    </p>
                    <p className="text-muted-foreground text-xs lg:text-sm">
                        <span className="block sm:hidden">
                            {"All rights reserved."}
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
