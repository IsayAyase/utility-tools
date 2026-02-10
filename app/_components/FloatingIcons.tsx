"use client";

import { toolsArray } from "@/lib/tools";
import { cn } from "@/lib/utils";
import {
    motion,
    useMotionValue,
    useSpring,
    type MotionValue,
} from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const ICON_SIZE = 48; // px (matches text-5xl / svg size)
const HALF_ICON = ICON_SIZE / 2;

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

interface IconPosition {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
}

export default function FloatingIcons({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // evenly spread positions (percentage based)
    const [spreadPositions] = useState(() => {
        const positions: { x: number; y: number }[] = [];
        const minDistance = 15;
        const maxAttempts = 30;

        for (let i = 0; i < toolsArray.length; i++) {
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < maxAttempts) {
                const candidate = {
                    x: Math.random() * 90 + 5,
                    y: Math.random() * 90 + 5,
                };

                const isFarEnough = positions.every((pos) => {
                    const dx = candidate.x - pos.x;
                    const dy = candidate.y - pos.y;
                    return Math.sqrt(dx * dx + dy * dy) >= minDistance;
                });

                if (isFarEnough || positions.length === 0) {
                    positions.push(candidate);
                    placed = true;
                }
                attempts++;
            }

            if (!placed) {
                positions.push({
                    x: Math.random() * 90 + 5,
                    y: Math.random() * 90 + 5,
                });
            }
        }

        return positions;
    });

    const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);

    useEffect(() => {
        const update = () => {
            if (!containerRef.current) return;

            const { clientWidth: width, clientHeight: height } =
                containerRef.current;

            const centerX = width / 2;
            const centerY = height / 2;

            setIconPositions(
                spreadPositions.map((pos) => ({
                    x: centerX,
                    y: centerY,
                    baseX: (pos.x / 100) * width,
                    baseY: (pos.y / 100) * height,
                })),
            );
        };

        update();
        window.addEventListener("resize", update);

        const t = setTimeout(() => setHasAnimatedIn(true), 300);

        return () => {
            window.removeEventListener("resize", update);
            clearTimeout(t);
        };
    }, [spreadPositions]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative w-full h-full min-h-75 overflow-hidden rounded-lg bg-background",
                className,
            )}
        >
            {/* Faded border edges */}
            <div className="pointer-events-none absolute inset-0 rounded-lg z-10">
                {/* Top edge */}
                <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-background to-transparent" />
                {/* Bottom edge */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background to-transparent" />
                {/* Left edge */}
                <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent" />
                {/* Right edge */}
                <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent" />
            </div>

            {iconPositions.map((pos, i) => (
                <FloatingIcon
                    key={i}
                    icon={toolsArray[i].icon}
                    position={pos}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    hasAnimatedIn={hasAnimatedIn}
                    delay={i * 0.08}
                    containerRef={containerRef}
                />
            ))}
        </div>
    );
}

/* ===================== icon ===================== */

function FloatingIcon({
    icon,
    position,
    mouseX,
    mouseY,
    hasAnimatedIn,
    delay,
    containerRef,
}: {
    icon: ReactNode;
    position: IconPosition;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    hasAnimatedIn: boolean;
    delay: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const iconX = useMotionValue(position.x);
    const iconY = useMotionValue(position.y);

    const x = useSpring(iconX, { damping: 20, stiffness: 150 });
    const y = useSpring(iconY, { damping: 20, stiffness: 150 });

    useEffect(() => {
        const update = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();

            const dx = mouseX.get() - position.baseX;
            const dy = mouseY.get() - position.baseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const repelRadius = 150;
            let targetX = position.baseX;
            let targetY = position.baseY;

            if (distance < repelRadius && distance > 0) {
                const force = (repelRadius - distance) / repelRadius;
                const angle = Math.atan2(dy, dx);
                const repel = force * 80;

                targetX -= Math.cos(angle) * repel;
                targetY -= Math.sin(angle) * repel;
            }

            // 🔒 hard clamp
            targetX = clamp(targetX, HALF_ICON, rect.width - HALF_ICON);

            targetY = clamp(targetY, HALF_ICON, rect.height - HALF_ICON);

            iconX.set(targetX);
            iconY.set(targetY);
        };

        const ux = mouseX.on("change", update);
        const uy = mouseY.on("change", update);

        return () => {
            ux();
            uy();
        };
    }, [mouseX, mouseY, position.baseX, position.baseY, containerRef]);

    return (
        <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            initial={{
                x: position.x,
                y: position.y,
                scale: 0,
                opacity: 0,
            }}
            animate={{
                x: hasAnimatedIn ? position.baseX : position.x,
                y: hasAnimatedIn ? position.baseY : position.y,
                scale: 1,
                opacity: 1,
            }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay,
            }}
            style={{ x, y }}
            drag
            dragConstraints={containerRef}
            dragElastic={0}
        >
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                }}
                className="text-5xl text-foreground drop-shadow-lg [&>svg]:size-8 [&_svg]:size-8 opacity-40"
            >
                {icon}
            </motion.div>
        </motion.div>
    );
}
