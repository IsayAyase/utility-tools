import LayoutWrapper from "@/components/LayoutWrapper";
import { getAllBlogs } from "@/lib/blogs";
import BlogsPage from "./_components/BlogsPage";

export default function Page() {
    const blogs = getAllBlogs(-1);
    const tags = [
        ...new Set(blogs.flatMap((post) => post.metadata.tags || [])),
    ];
    return (
        <LayoutWrapper className="max-w-4xl">
            <BlogsPage blogs={blogs} tags={tags} />
        </LayoutWrapper>
    );
}
