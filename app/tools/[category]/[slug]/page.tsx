import LayoutWrapper from "@/components/LayoutWrapper";
import ToolPageSwitch from "@/components/pages/ToolPageSwitch";
import { isCategory, toolsArray } from "@/lib/tools";
import { notFound } from "next/navigation";

type paramType = {
    category: string;
    slug: string;
};

export async function generateStaticParams() {
    return toolsArray.map((tool) => {
        return {
            category: tool.category,
            slug: tool.slug,
        };
    });
}

export const dynamicParams = false;

export default async function page({ params }: { params: Promise<paramType> }) {
    const { category, slug } = await params;
    if (!isCategory(category)) return notFound();

    return (
        <LayoutWrapper>
            <ToolPageSwitch category={category} slug={slug} />
        </LayoutWrapper>
    );
}
