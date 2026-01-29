import CategoryBar from "@/components/CategoryBar";
import {
    Card,
    CardContent,
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
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export function ToolCard({
    data,
    variant = "default",
}: {
    data: ToolType;
    variant?: "default" | "simple" | "titleonly";
}) {
    const url = `/tools/${data.category}/${data.slug}`;
    const render = () => {
        if (variant === "titleonly") {
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
                        <div className="rounded-md p-2 border w-fit h-fit">
                            {data.icon}
                        </div>
                        <CardTitle className="text-lg">{data.name}</CardTitle>
                        <div className="w-fit text-xs px-2 rounded-full bg-secondary hover:bg-background transition-colors duration-150 border capitalize">
                            {data.category}
                        </div>
                        <CardDescription>{data.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <div className="flex items-center gap-0.5 group-hover:gap-2 transition-all duration-300">
                            <span>Open</span>
                            <MdOutlineKeyboardDoubleArrowRight className="size-5 group-hover:text-red-500 transition-colors duration-300" />
                        </div>
                    </CardFooter>
                </>
            );
        }
    };
    return (
        <Link className="h-full group" href={url}>
            <Card className="h-full hover:scale-[101%] hover:shadow-md transition-all duration-300 justify-between">
                {render()}
            </Card>
        </Link>
    );
}

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
