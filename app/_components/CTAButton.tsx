"use client";

import { mainData } from "@/contents/mainData";
import { motion } from "framer-motion";
import Link from "next/link";

const darkBlobs = [
    {
        width: "65%",
        height: "200%",
        bottom: "-80%",
        left: "-10%",
        dark: "rgba(220,38,38,0.95)",
        light: "rgba(220,38,38,0.4)",
        blur: 18,
        animate: {
            x: [0, 12, -8, 0],
            y: [0, -8, 4, 0],
            scale: [1, 1.15, 0.95, 1],
            opacity: [0.9, 1, 0.8, 0.9],
        },
        lightOpacity: [0.5, 0.65, 0.4, 0.5],
        duration: 4,
        delay: 0,
    },
    {
        width: "50%",
        height: "180%",
        bottom: "-70%",
        left: "20%",
        dark: "rgba(234,88,12,0.85)",
        light: "rgba(234,88,12,0.35)",
        blur: 20,
        animate: {
            x: [0, -10, 14, 0],
            y: [0, -12, 6, 0],
            scale: [1, 0.9, 1.2, 1],
            opacity: [0.8, 1, 0.7, 0.8],
        },
        lightOpacity: [0.45, 0.6, 0.35, 0.45],
        duration: 5,
        delay: 0.8,
    },
    {
        width: "45%",
        height: "160%",
        bottom: "-65%",
        left: "45%",
        dark: "rgba(244,63,94,0.85)",
        light: "rgba(244,63,94,0.35)",
        blur: 18,
        animate: {
            x: [0, 8, -14, 0],
            y: [0, -6, -10, 0],
            scale: [1, 1.1, 0.85, 1],
            opacity: [0.75, 0.95, 0.65, 0.75],
        },
        lightOpacity: [0.4, 0.55, 0.3, 0.4],
        duration: 4.5,
        delay: 1.5,
    },
    {
        width: "40%",
        height: "150%",
        bottom: "-60%",
        right: "-5%",
        dark: "rgba(159,18,57,0.85)",
        light: "rgba(190,60,90,0.3)",
        blur: 16,
        animate: {
            x: [0, -12, 6, 0],
            y: [0, -10, 8, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.7, 1, 0.6, 0.7],
        },
        lightOpacity: [0.35, 0.5, 0.28, 0.35],
        duration: 3.8,
        delay: 2.2,
    },
    {
        width: "55%",
        height: "190%",
        bottom: "-75%",
        left: "30%",
        dark: "rgba(37,99,235,0.85)",
        light: "rgba(37,99,235,0.3)",
        blur: 22,
        animate: {
            x: [0, -14, 10, 0],
            y: [0, -10, 6, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.7, 0.95, 0.65, 0.7],
        },
        lightOpacity: [0.35, 0.5, 0.28, 0.35],
        duration: 5.5,
        delay: 3,
    },
    {
        width: "45%",
        height: "160%",
        bottom: "-62%",
        right: "10%",
        dark: "rgba(6,182,212,0.8)",
        light: "rgba(6,182,212,0.3)",
        blur: 18,
        animate: {
            x: [0, 10, -8, 0],
            y: [0, -14, 4, 0],
            scale: [1, 0.85, 1.15, 1],
            opacity: [0.65, 0.9, 0.6, 0.65],
        },
        lightOpacity: [0.35, 0.5, 0.28, 0.35],
        duration: 4.2,
        delay: 1.2,
    },
    {
        width: "40%",
        height: "145%",
        bottom: "-58%",
        left: "5%",
        dark: "rgba(56,189,248,0.75)",
        light: "rgba(56,189,248,0.28)",
        blur: 16,
        animate: {
            x: [0, 16, -6, 0],
            y: [0, -8, 12, 0],
            scale: [1, 1.2, 0.88, 1],
            opacity: [0.6, 0.85, 0.55, 0.6],
        },
        lightOpacity: [0.3, 0.45, 0.25, 0.3],
        duration: 4.8,
        delay: 2.8,
    },
    {
        width: "70%",
        height: "140%",
        bottom: "-70%",
        left: "15%",
        dark: "rgba(30,58,138,0.7)",
        light: "rgba(30,58,138,0.2)",
        blur: 24,
        animate: {
            x: [0, -8, 8, 0],
            y: [0, -6, 2, 0],
            scale: [1, 1.05, 0.95, 1],
            opacity: [0.6, 0.8, 0.55, 0.6],
        },
        lightOpacity: [0.25, 0.4, 0.2, 0.25],
        duration: 6,
        delay: 0.4,
    },
];

export default function CTAButton() {
    return (
        <Link href={mainData.ctaBtn.url}>
            <motion.button
                className="relative w-50 md:w-55 lg:w-60 h-15 py-3 rounded-lg bg-background text-foreground overflow-hidden cursor-pointer border group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
                whileHover="hovered"
            >
                {darkBlobs.map((blob, i) => (
                    <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                            width: blob.width,
                            height: blob.height,
                            bottom: blob.bottom,
                            left: "left" in blob ? blob.left : undefined,
                            right: "right" in blob ? blob.right : undefined,
                            borderRadius: "50%",
                            filter: `blur(${blob.blur}px)`,
                            background: `radial-gradient(circle, var(--blob-color-${i}) 0%, transparent 70%)`,
                        }}
                        animate={{
                            ...blob.animate,
                            opacity: blob.animate.opacity,
                        }}
                        transition={{
                            duration: blob.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: blob.delay,
                        }}
                    />
                ))}

                <style>{`
                    :root {
                        ${darkBlobs.map((b, i) => `--blob-color-${i}: ${b.light};`).join("\n")}
                    }
                    .dark {
                        ${darkBlobs.map((b, i) => `--blob-color-${i}: ${b.dark};`).join("\n")}
                    }
                `}</style>

                {/* Light mode overlay */}
                <div
                    className="absolute inset-0 rounded-lg pointer-events-none block dark:hidden"
                    style={{ background: "rgba(255,255,255,0.45)" }}
                />

                {/* Fade mask */}
                <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to top, transparent 0%, var(--background) 55%)",
                    }}
                />

                {/* Shimmer — parent hover driven */}
                <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    initial={{ x: "-100%", opacity: 0 }}
                    variants={{
                        hovered: {
                            x: ["-100%", "200%", "-100%"],
                            opacity: 1,
                            transition: {
                                duration: 1.5,
                                ease: "easeInOut",
                                delay: 0.1,
                            },
                        },
                    }}
                    style={{
                        background:
                            "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 55%, transparent 65%)",
                    }}
                />

                <motion.span
                    className="relative z-10 font-medium tracking-wide text-sm group-hover:text-base transition-all duration-300"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    {mainData.ctaBtn.text}
                </motion.span>
            </motion.button>
        </Link>
    );
}
