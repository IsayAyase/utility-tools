"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { ListOfBlogPostsItem } from "@/lib/blogs/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BlogItemCard({
    post,
    onTagClick,
    className,
    linkClassName
}: {
    post: ListOfBlogPostsItem;
    onTagClick?: (tag: string | null) => void;
    className?: string
    linkClassName?: string
}) {
    const url = `/blogs/${post.slug}`;
    return (
        <Link href={url} className={cn("group h-full", linkClassName)}>
            <Card className={cn("h-full shadow-none group-hover:shadow-md group-hover:scale-[101%] transition-all duration-300 hover:border-border", className)}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg leading-tight">
                        {post.metadata.title}
                    </CardTitle>
                    <CardDescription className="space-x-1">
                        <span>{post.metadata.description}</span>
                        {post.metadata.description && (
                            <span className="text-sm text-muted-foreground italic underline group-hover:text-blue-500">
                                Read more
                            </span>
                        )}
                    </CardDescription>
                    <CardDescription className="flex flex-wrap items-center gap-1 text-muted-foreground text-sm">
                        <span>
                            {post.metadata.date
                                ? new Date(
                                      post.metadata.date,
                                  ).toLocaleDateString()
                                : ""}
                        </span>
                        <span>•</span>
                        <span>{post.metadata.author?.join(", ")}</span>
                        <span>•</span>
                        <span className="italic">{post.metadata.readTime}</span>
                    </CardDescription>
                    <div className="flex flex-wrap gap-1.5">
                        {post.metadata.tags?.map((tag) => (
                            <Badge
                                key={tag}
                                className={onTagClick ? "cursor-pointer" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTagClick?.(tag);
                                }}
                                variant={"outline"}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}
