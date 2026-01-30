"use client";

import { type CategoriesWithoutAll, type Tool } from "@/lib/tools/types";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type ComponentType, type JSX } from "react";
import LoadingPage from "./LoadingPage";

type ToolComponentPage = ComponentType<JSX.IntrinsicElements["div"]>;

const toolsPageCompObj: Record<
    CategoriesWithoutAll,
    Record<string, ToolComponentPage>
> = {
    document: {
        word_to_pdf: dynamic(() => import("./document/WordToPdfPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        pdf_merge: dynamic(() => import("./document/PdfMergePage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        pdf_split: dynamic(() => import("./document/PdfSplitPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        pdf_add_text_watermark: dynamic(
            () => import("./document/PdfTextWaterMarkPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        pdf_add_image_watermark: dynamic(
            () => import("./document/PdfImageWatermarkPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        pdf_metadata_updater: dynamic(
            () => import("./document/PdfMetadataUpdaterPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
    },
    image: {
        image_resize_convert_format: dynamic(
            () => import("./image/ImageResizeConvertFormatPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        image_to_pdf: dynamic(() => import("./image/ImageToPdfPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),

        image_transform: dynamic(() => import("./image/ImageTransformPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
    },
    audio: {
        audio_trim_convert: dynamic(
            () => import("./audio/AudioTrimConvertPage"),
            {
                ssr: false,
                loading: () => <LoadingPage />,
            },
        ),
        audio_merge: dynamic(() => import("./audio/AudioMergePage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
    },
    video: {
        video_trim_convert: dynamic(
            () => import("./video/VideoTrimConvertPage"),
            {
                ssr: false,
                loading: () => <LoadingPage />,
            },
        ),
        burn_subtitle_in_video: dynamic(
            () => import("./video/BurnSubtitleInVideo"),
            {
                ssr: false,
                loading: () => <LoadingPage />,
            },
        )
    },
};

const ToolPageRenderer = ({
    toolInfo,
    relatedTools,
}: {
    toolInfo: Tool;
    relatedTools: Tool[];
}) => {
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
                <Page />
            </div>
        </div>
    );
};

export default ToolPageRenderer;
