"use client";

import { motion } from "framer-motion";

export default function AnimatedGridBg() {
    return (
        <motion.div
            className="fixed -z-10 top-0 left-0 w-full h-full pointer-events-none"
            style={{
                backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
          radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
          radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
        `,
                backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
            }}
            animate={{
                backgroundPosition: ["0px 0px", "0px 40px"],
            }}
            transition={{
                duration: 3,
                ease: "linear",
                repeat: Infinity,
            }}
        >
            <div className="absolute top-0 left-0 w-full h-75">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(180deg, 
                        color-mix(in oklab, var(--background) 75%, transparent) 0%,
                        color-mix(in oklab, var(--background) 65%, transparent) 15%, 
                        color-mix(in oklab, var(--background) 60%, transparent) 30%, 
                        color-mix(in oklab, var(--background) 45%, transparent) 50%, 
                        color-mix(in oklab, var(--background) 40%, transparent) 55%, 
                        transparent 75%, 
                        transparent 100%
                    )`,
                        backdropFilter: `blur(0px)`,
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(180deg, 
                        color-mix(in oklab, var(--background) 60%, transparent) 0%,
                        color-mix(in oklab, var(--background) 50%, transparent) 10%, 
                        color-mix(in oklab, var(--background) 40%, transparent) 20%, 
                        color-mix(in oklab, var(--background) 30%, transparent) 30%, 
                        color-mix(in oklab, var(--background) 20%, transparent) 40%, 
                        transparent 100%
                    )`,
                        backdropFilter: `blur(8px)`,
                        maskImage: `linear-gradient(180deg, 
                        color-mix(in oklab, var(--foreground) 100%, transparent) 0%,
                        color-mix(in oklab, var(--foreground) 70%, transparent) 15%, 
                        color-mix(in oklab, var(--foreground) 50%, transparent) 25%, 
                        color-mix(in oklab, var(--foreground) 30%, transparent) 35%, 
                        color-mix(in oklab, var(--foreground) 20%, transparent) 45%, 
                        transparent 90%, 
                        transparent 100%
                    )`,
                    }}
                />
            </div>
        </motion.div>
    );
}
