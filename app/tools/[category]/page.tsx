import LayoutWrapper from "@/components/LayoutWrapper";
import ToolsPage from "@/components/pages/ToolsPage";
import { categoryArray, isCategory } from "@/lib/tools";
import { notFound } from "next/navigation";

type paramType = {
    category: string;
};

export async function generateStaticParams() {
    return categoryArray.map((category) => {
        return {
            category: category.metadata.category,
        };
    });
}

export const dynamicParams = false;

export default async function page({ params }: { params: Promise<paramType> }) {
    const { category } = await params;
    if (!isCategory(category, true)) return notFound();

    return (
        <LayoutWrapper>
            <ToolsPage selectedCategory={category} />
        </LayoutWrapper>
    );
}
