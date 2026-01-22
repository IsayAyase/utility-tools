import LayoutWrapper from "@/components/LayoutWrapper";
import ToolPageRenderer from "@/components/pages/ToolPageRenderer";
import { isCategory, objectOfTools, toolsArray } from "@/lib/tools";
import { getRelatedToolsByKeywords } from "@/lib/tools/helper";
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

    const toolInfo = objectOfTools[category].tools[slug];
    if (!toolInfo) return notFound();
    
    const relatedTools = getRelatedToolsByKeywords(toolInfo.keywords, toolInfo.slug, 6);
    return (
        <LayoutWrapper >
            <ToolPageRenderer toolInfo={toolInfo} relatedTools={relatedTools} />
        </LayoutWrapper>
    );
}
