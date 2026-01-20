"use client";

import type { CategoriesWithoutAll } from "@/lib/tools";
import dynamic from "next/dynamic";
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
    },
    image: {
        image_format_convert: dynamic(
            () => import("./image/ImageFormatConvertPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
    },
};

const ToolPageSwitch = ({
    category,
    slug,
}: {
    category: CategoriesWithoutAll;
    slug: string;
}) => {
    const Page = toolsPageCompObj[category]?.[slug];
    if (!Page) return notFound();

    return <Page />;
};

export default ToolPageSwitch;
