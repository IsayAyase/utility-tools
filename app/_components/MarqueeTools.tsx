"use client";

import type { Tool } from "@/lib/tools/types";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

export default function MarqueeTools({ tools }: { tools: Tool[] }) {
    const controls = useAnimation();
    const duplicatedCategories = [...tools, ...tools];

    return (
        <div className="relative w-full overflow-hidden py-4">
            {/* Gradient overlays for fade effect */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent z-10" />

            {/* Marquee container */}
            <div className="flex">
                <motion.div
                    className="flex border-y"
                    animate={controls}
                    initial={{ x: 0 }}
                    onHoverStart={() => controls.stop()}
                    onHoverEnd={() =>
                        controls.start({
                            x: ["current", "-50%"],
                            transition: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 20,
                                ease: "linear",
                            },
                        })
                    }
                >
                    {duplicatedCategories.map((t, index) => (
                        <Link
                            key={`${t.name}-${index}`}
                            href={`/tools/${t.category}/${t.slug}`}
                            className="border-r px-6 py-3"
                        >
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="[&>svg]:size-5 [&_svg]:size-5">
                                    {t.icon}
                                </span>
                                <span className="text-lg font-medium text-foreground">
                                    {t.name}
                                </span>
                            </div>
                            <p className="line-clamp-2 text-muted-foreground text-sm">{t.description}</p>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
