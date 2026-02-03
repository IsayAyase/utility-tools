import LayoutWrapper from "@/components/LayoutWrapper";
import LoadingPage from "@/components/pages/LoadingPage";
import { getAllBlogs } from "@/lib/blogs";
import { Suspense } from "react";
import BlogsPage from "./_components/BlogsPage";

export default function Page() {
    const blogs = getAllBlogs(-1);
    const tags = [
        ...new Set(blogs.flatMap((post) => post.metadata.tags || [])),
    ];
    return (
        <LayoutWrapper className="max-w-4xl">
            <Suspense fallback={<LoadingPage />}>
                <BlogsPage blogs={blogs} tags={tags} />
            </Suspense>
        </LayoutWrapper>
    );
}
