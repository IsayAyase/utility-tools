"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Tool as ToolType } from "@/lib/tools/types";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export default function ToolCard({
    data,
    variant = "default",
}: {
    data: ToolType;
    variant?: "default" | "simple" | "titleonly";
}) {
    const url = `/tools/${data.category}/${data.slug}`;
    const [isHovered, setIsHovered] = useState(false);
    const [maskStyle, setMaskStyle] = useState({
        maskImage: "radial-gradient(circle 0px at 0px 0px, black 100%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(circle 0px at 0px 0px, black 100%, transparent 100%)",
    });
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const maskSize = useMotionValue(0);
    
    const springConfig = { damping: 25, stiffness: 200 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);
    // Lower stiffness for size to make shrink animation more visible
    const smoothSize = useSpring(maskSize, { damping: 30, stiffness: 150 });

    useEffect(() => {
        const updateMask = () => {
            const x = smoothX.get();
            const y = smoothY.get();
            const size = smoothSize.get();
            const gradient = `radial-gradient(circle ${size}px at ${x}px ${y}px, black 100%, transparent 100%)`;
            setMaskStyle({
                maskImage: gradient,
                WebkitMaskImage: gradient,
            });
        };

        const unsubscribeX = smoothX.on("change", updateMask);
        const unsubscribeY = smoothY.on("change", updateMask);
        const unsubscribeSize = smoothSize.on("change", updateMask);

        return () => {
            unsubscribeX();
            unsubscribeY();
            unsubscribeSize();
        };
    }, [smoothX, smoothY, smoothSize]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
        maskSize.set(400);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        maskSize.set(0);
        setIsHovered(false);
    };

    const render = () => {
        if (variant === "titleonly") {
            return (
                <CardContent>
                    <CardTitle>{data.name}</CardTitle>
                </CardContent>
            );
        } else if (variant === "simple") {
            return (
                <CardContent>
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription>{data.description}</CardDescription>
                </CardContent>
            );
        } else {
            return (
                <>
                    <CardHeader>
                        <div className="rounded-md p-2 border w-fit h-fit">
                            {data.icon}
                        </div>
                        <CardTitle className="text-lg">{data.name}</CardTitle>
                        <div className="w-fit text-xs px-2 rounded-full bg-secondary hover:bg-background transition-colors duration-150 border capitalize">
                            {data.category}
                        </div>
                        <CardDescription className="text-foreground/80">{data.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <div className="flex items-center gap-0.5 group-hover:gap-2 transition-all duration-300">
                            <span>Open</span>
                            <MdOutlineKeyboardDoubleArrowRight className="size-5 group-hover:text-red-500 transition-colors duration-300" />
                        </div>
                    </CardFooter>
                </>
            );
        }
    };

    return (
        <Link className="h-full group" href={url}>
            <motion.div
                className="relative h-full"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Card className="h-full hover:scale-[101%] shadow-md transition-all duration-300 justify-between relative overflow-hidden bg-card/5 backdrop-blur-[2px] gap-0">
                    {/* Light mode background overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none dark:hidden"
                        style={{
                            backgroundColor: data.lightBgColor,
                            ...maskStyle,
                        }}
                    />
                    {/* Dark mode background overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none hidden dark:block"
                        style={{
                            backgroundColor: data.darkBgColor,
                            ...maskStyle,
                        }}
                    />
                    {/* Content layer */}
                    <div className="relative z-10 flex flex-col justify-between h-full gap-6">
                        {render()}
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}
