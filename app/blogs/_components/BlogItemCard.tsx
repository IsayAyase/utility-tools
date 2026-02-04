"use client";

import { Badge } from "@/components/ui/badge";
import type { ListOfBlogPostsItem } from "@/lib/blogs/types";
import Link from "next/link";

export default function BlogItemCard({
    post,
    onTagClick,
}: {
    post: ListOfBlogPostsItem;
    onTagClick?: (tag: string | null) => void;
}) {
    const url = `/blogs/${post.slug}`;
    return (
        <div>
            <Link href={url}>
                <h3 className="text-lg font-medium">{post.metadata.title}</h3>
                <div className="flex flex-wrap gap-2 items-center text-muted-foreground text-sm">
                    <span>
                        {post.metadata.date
                            ? new Date(post.metadata.date).toLocaleDateString()
                            : ""}
                    </span>
                    <span>•</span>
                    <span>{post.metadata.author?.join(", ")}</span>
                    <span>•</span>
                    <span className="italic">{post.metadata.readTime}</span>
                </div>
            </Link>
            <div className="flex flex-wrap gap-2 mt-1">
                {post.metadata.tags?.map((tag) => (
                    <Badge
                        key={tag}
                        className={onTagClick ? "cursor-pointer" : ""}
                        onClick={() => onTagClick?.(tag)}
                        variant={"outline"}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    );
}