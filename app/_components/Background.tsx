"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "next-themes";

export default function Background() {
    const { resolvedTheme } = useTheme();
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const isDark = resolvedTheme === "dark";
    const gridColor = isDark ? "#ffffff1a" : "#e5e7eb";
    const fadeColor = isDark ? "#0f172a" : "#ffffff";

    const gradient = useTransform(
        [springX, springY],
        ([x, y]) => `radial-gradient(circle 48vmax at ${x}px ${y}px, transparent 0%, transparent 15%, ${fadeColor} 25%)`
    );

    return (
        <div className="h-dvh w-screen top-0 left-0 fixed -z-10">
            <div
                className="absolute inset-0 -z-20"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, ${gridColor} 1px, transparent 1px),
                        linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />
            <motion.div
                className="absolute inset-0 pointer-events-none -z-10"
                style={{ background: gradient }}
            />
        </div>
    );
}
