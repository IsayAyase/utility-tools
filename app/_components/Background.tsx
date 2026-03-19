"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function Background() {
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

    const gridColor = "var(--border)";
    const fadeColor = "var(--background)";

    const gradient = useTransform(
        [springX, springY],
        ([x, y]) =>
            `radial-gradient(circle 20vmax at ${x}px ${y}px, transparent 0%, transparent 15%, ${fadeColor} 100%)`,
    );

    return (
        <div className="h-dvh w-screen top-0 left-0 fixed -z-10 bg-muted">
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
