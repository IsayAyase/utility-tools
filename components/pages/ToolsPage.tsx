import CategoryBar from "@/components/CategoryBar";
import {
    Card,
    CardDescription,
    CardFooter,
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
import { BiLinkExternal } from "react-icons/bi";
import { Button } from "../ui/button";

export function ToolCard({ data }: { data: ToolType }) {
    const url = `/tools/${data.category}/${data.slug}`;
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            {/* <CardContent></CardContent> */}
            <CardFooter>
                <Link href={url}>
                    <Button className="w-full cursor-pointer">
                        <span>Open</span>
                        <BiLinkExternal />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
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
