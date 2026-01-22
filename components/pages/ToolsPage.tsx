import CategoryBar from "@/components/CategoryBar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type CategoriesWithAll,
    objectOfTools,
    toolsArray,
    type Tool as ToolType,
} from "@/lib/tools";
import Link from "next/link";
import type { JSX } from "react";

export function ToolCard({
    data,
    variant = "default",
}: {
    data: ToolType;
    variant?: "default" | "simple" | "titleonly";
}) {
    const url = `/tools/${data.category}/${data.slug}`;
    const render = () => {
        if (variant === 'titleonly') {
            return (
                <CardContent>
                    <CardTitle>{data.name}</CardTitle>
                </CardContent>
            );
        } else if (variant === "simple") {
            return (
                <CardContent>
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription>{data.description}</CardDescription>
                </CardContent>
            );
        } else {
            return (
                <>
                    <CardHeader>
                        <CardTitle>{data.name}</CardTitle>
                        <CardDescription>{data.description}</CardDescription>
                    </CardHeader>
                </>
            );
        }
    };
    return (
        <Link href={url}>
            <Card>{render()}</Card>
        </Link>
    );
}

export function ToolCardGrid({ renderTools }: { renderTools: JSX.Element[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            ? toolsArray.map((tool) => <ToolCard key={tool.slug} data={tool} />)
            : Object.entries(objectOfTools[selectedCategory]?.tools || {}).map(
                  ([_, tool]) => <ToolCard key={tool.slug} data={tool} />,
              );
    return (
        <div className="space-y-4">
            <CategoryBar selectedCategory={selectedCategory} />
            <ToolCardGrid renderTools={renderTools} />
        </div>
    );
}
