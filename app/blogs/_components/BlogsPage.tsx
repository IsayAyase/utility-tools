"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ListOfBlogPostsItem } from "@/lib/blogs/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BlogItemCard from "./BlogItemCard";

const PAGE_SIZE = 10;

export default function BlogsPage({
    blogs,
    tags,
}: {
    blogs: ListOfBlogPostsItem[];
    tags: string[];
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [blogsToRender, setBlogsToRender] =
        useState<ListOfBlogPostsItem[]>(blogs);
    const [filteredBlogs, setFilteredBlogs] =
        useState<ListOfBlogPostsItem[]>(blogs);

    const currentPage = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(filteredBlogs.length / PAGE_SIZE);

    useEffect(() => {
        const tagParam = searchParams.get("tag");
        setSelectedTag(tagParam);

        if (!tagParam) {
            setFilteredBlogs(blogs);
        } else {
            const filtered = blogs.filter((post) =>
                post.metadata.tags?.includes(tagParam),
            );
            setFilteredBlogs(filtered);
        }
    }, [searchParams, blogs]);

    useEffect(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        setBlogsToRender(filteredBlogs.slice(start, end));
    }, [filteredBlogs, currentPage]);

    const handleSearchTag = (tag: string | null) => {
        setSelectedTag(tag);
        const params = new URLSearchParams(searchParams);
        if (tag) {
            params.set("tag", tag);
        } else {
            params.delete("tag");
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            const params = new URLSearchParams(searchParams);
            params.set("page", page.toString());
            router.push(`?${params.toString()}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="">
            <div className="space-y-2">
                <h2 className="text-3xl font-light">Blogs</h2>
                <p className="text-muted-foreground">
                    Welcome to the Blade Tools blog! Here, you'll find articles
                    about the development of the service, new features, and
                    guides on how to use the tools.
                </p>
                <div className="flex items-center gap-2 flex-wrap text-xs mb-8">
                    <h5 className="text-muted-foreground text-sm italic mb-1">
                        Tags:
                    </h5>
                    {tags.map((t, i) => (
                        <Link key={i} href={`?tag=${t}`}>
                            <Badge
                                className="cursor-pointer"
                                variant={"outline"}
                            >
                                {t}
                            </Badge>
                        </Link>
                    ))}
                </div>
            </div>

            <div className={`flex flex-col gap-6 my-6`}>
                {selectedTag && (
                    <p className="sm:text-lg font-light italic">
                        Showing posts for tag:{" "}
                        <span className="font-normal">[{selectedTag}]</span>{" "}
                        <span
                            className="underline cursor-pointer text-xs sm:text-sm"
                            onClick={() => handleSearchTag(null)}
                        >
                            show all
                        </span>
                    </p>
                )}
                {blogsToRender.length === 0 ? (
                    <p className="text-muted-foreground">No posts found.</p>
                ) : (
                    blogsToRender.map((post) => (
                        <BlogItemCard
                            key={post.slug}
                            post={post}
                            onTagClick={handleSearchTag}
                        />
                    ))
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        size={"icon"}
                        variant={"outline"}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        size={"icon"}
                        variant={"outline"}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

