"use client";

import { type Tool } from "@/lib/tools/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import LoadFFmpeg from "../LoadFFmpeg";
import { Badge } from "../ui/badge";
import { toolsPageCompObj } from "./tool-dynamic-import";

const ToolPageRenderer = ({
    toolInfo,
    relatedTools,
}: {
    toolInfo: Tool;
    relatedTools: Tool[];
}) => {
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

            <div className="flex items-center gap-1.5 overflow-x-auto py-2">
                <span className="text-muted-foreground text-sm italic shrink-0">
                    Related tools:
                </span>
                {relatedTools.map((t, i) => (
                    <Link key={i} href={`/tools/${t.category}/${t.slug}`} className="">
                        <Badge className="cursor-pointer whitespace-nowrap" variant={"outline"}>
                            {t.name}
                        </Badge>
                    </Link>
                ))}
            </div>

            <div className="relative min-h-96 h-full flex items-center justify-center mt-6">
                {Page}
            </div>

            {/* loading ffmpeg wasm */}
            <LoadFFmpeg />
        </div>
    );
};

export default ToolPageRenderer;
