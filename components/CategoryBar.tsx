import { Button } from "@/components/ui/button";
import { categoryArray } from "@/lib/tools";
import type { CategoriesWithAll } from "@/lib/tools/types";
import Link from "next/link";

function Category({
    name,
    isSelected,
}: {
    name: CategoriesWithAll;
    isSelected: boolean;
}) {
    const url = `/tools/${name === "all" ? "" : name || ""}`;
    return (
        <Link href={url}>
            <Button
                variant={isSelected ? "default" : "outline"}
                className="rounded-full capitalize"
            >
                <span>
                    {name}
                </span>
            </Button>
        </Link>
    );
}

function CategoryBar({
    selectedCategory,
}: {
    selectedCategory: CategoriesWithAll;
}) {
    return (
        <div className="flex flex-wrap gap-2 items-center">
            <Category isSelected={"all" === selectedCategory} name={"all"} />
            {categoryArray.map((tool) => (
                <Category
                    key={tool.metadata.category}
                    name={tool.metadata.category}
                    isSelected={tool.metadata.category === selectedCategory}
                />
            ))}
        </div>
    );
}

export default CategoryBar;
