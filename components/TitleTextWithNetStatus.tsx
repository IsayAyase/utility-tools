"use client";

import { racingSansOne } from "@/app/fonts";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function TitleTextWithNetStatus() {
    const isOnline = useOnlineStatus();
    console.log(isOnline);
    return (
        <Link href="/" className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger>
                    <h3
                        className={`text-xl italic font-semibold tracking-wide border-b-2 ${isOnline ? "border-red-500" : "border-muted-foreground"} ${racingSansOne.className}`}
                    >
                        BladeTools
                    </h3>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isOnline ? "Online" : "Offline"}</p>
                </TooltipContent>
            </Tooltip>
        </Link>
    );
}
