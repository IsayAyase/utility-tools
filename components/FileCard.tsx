"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

interface FileCardProps {
    title: string;
    description?: string;
    icon: ReactNode;
    lightBgColor: string;
    darkBgColor?: string;
    href?: string;
    className?: string;
    linkClassName?: string;
}

export default function FileCard({
    title,
    description,
    icon,
    lightBgColor,
    darkBgColor,
    href,
    className,
    linkClassName
}: FileCardProps) {
    const [maskStyle, setMaskStyle] = useState({
        maskImage:
            "radial-gradient(circle 0px at 0px 0px, black 100%, transparent 100%)",
        WebkitMaskImage:
            "radial-gradient(circle 0px at 0px 0px, black 100%, transparent 100%)",
    });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const maskSize = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);
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
    };

    const handleMouseLeave = () => {
        maskSize.set(0);
    };

    const cardContent = (
        <motion.div
            className={cn(
                "relative w-full h-full aspect-6/5 rounded-lg border bg-card overflow-hidden cursor-pointer hover:scale-[101%] hover:shadow-md transition-all duration-300",
                className,
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Light mode background overlay */}
            <div
                className="absolute inset-0 pointer-events-none dark:hidden"
                style={{
                    backgroundColor: lightBgColor,
                    ...maskStyle,
                }}
            />
            {/* Dark mode background overlay */}
            <div
                className="absolute inset-0 pointer-events-none hidden dark:block"
                style={{
                    backgroundColor: darkBgColor || lightBgColor,
                    ...maskStyle,
                }}
            />

            {/* Content layer */}
            <div className="relative z-10 flex flex-col h-full p-6">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-0.5">{title}</h3>
                    {description && (
                        <p className="text-sm text-foreground/80 line-clamp-3">
                            {description}
                        </p>
                    )}
                </div>

                <div className="absolute bottom-4 right-4 opacity-15">
                    {icon}
                </div>
            </div>
        </motion.div>
    );

    if (href) {
        return (
            <Link href={href} className={cn("block", linkClassName)}>
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}
