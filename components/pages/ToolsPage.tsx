import CategoryBar from "@/components/CategoryBar";
import { objectOfTools, toolsArray } from "@/lib/tools";
import type { CategoriesWithAll } from "@/lib/tools/types";
import type { JSX } from "react";
import ToolCard from "../ToolCard";

export function ToolCardGrid({ renderTools }: { renderTools: JSX.Element[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {renderTools.length > 0 ? (
                renderTools
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-lg">
                        No tools found
                    </span>
                </div>
            )}
        </div>
    );
}

export default function ToolsPage({
    selectedCategory,
}: {
    selectedCategory: CategoriesWithAll;
}) {
    const renderTools =
        selectedCategory === "all"
            ? toolsArray
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((tool) => <ToolCard key={tool.slug} data={tool} />)
            : Object.entries(objectOfTools[selectedCategory]?.tools || {})
                  .sort((a, b) => a[1].name.localeCompare(b[1].name))
                  .map(([, tool]) => <ToolCard key={tool.slug} data={tool} />);
    return (
        <div className="space-y-6">
            <CategoryBar selectedCategory={selectedCategory} />
            <ToolCardGrid renderTools={renderTools} />
        </div>
    );
}
