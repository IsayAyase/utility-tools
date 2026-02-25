"use client";

import { type Tool } from "@/lib/tools/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import LoadFFmpeg from "../LoadFFmpeg";
import ToolErrorBoundary from "./ErrorBountry";
import OfflineToolFallback from "./OfflineToolFallback";
import { toolsPageCompObj } from "./tool-dynamic-import";

const ToolPageRenderer = ({
    toolInfo,
    relatedTools,
}: {
    toolInfo: Tool;
    relatedTools: Tool[];
}) => {
    // state change -> trigger re-render -> remount component -> re run dynamic import
    const [_, setRetryKey] = useState(0);
    function onRetry() {
        setRetryKey((p) => p + 1);
    }

    // toolPageCompObj uses dynamic import, ssr: false, client side only
    const Page = toolsPageCompObj[toolInfo.category]?.[toolInfo.slug];
    if (!Page) return notFound();

    return (
        <div className="">
            <div className="md:space-y-1">
                <div className="flex items-center gap-3">
                    <div className="rounded-md p-2 border w-fit h-fit">
                        {toolInfo.icon}
                    </div>
                    <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                        {toolInfo.name}
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm md:text-base xl:text-lg">
                    {toolInfo.description}
                </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs mb-8">
                <h5 className="text-muted-foreground text-sm italic mb-1">
                    Related tools:
                </h5>
                {relatedTools.map((t, i) => (
                    <Link
                        key={i}
                        href={`/tools/${t.category}/${t.slug}`}
                        className="px-2 rounded-full bg-secondary hover:bg-background transition-colors duration-150 border"
                    >
                        {t.name}
                    </Link>
                ))}
            </div>

            <div className="relative min-h-96 h-full flex items-center justify-center">
                <ToolErrorBoundary
                    fallback={<OfflineToolFallback onRetry={onRetry} />}
                >
                    <Page />
                </ToolErrorBoundary>
            </div>

            {/* loading ffmpeg wasm */}
            <LoadFFmpeg />
        </div>
    );
};

export default ToolPageRenderer;
