import LayoutWrapper from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogPageRenderer from "./_components/BlogPageRenderer";
import TableOfContents from "./_components/TableOfContent";

type paramType = {
    slug: string;
};

export async function generateStaticParams() {
    const allBlogs = getAllBlogs();
    return allBlogs.map((blog) => {
        return {
            slug: blog.slug,
        };
    });
}

export const dynamicParams = false;

export default async function page({ params }: { params: Promise<paramType> }) {
    const { slug } = await params;
    const blog = getBlogBySlug(slug);
    if (!blog) return notFound();

    return (
        <LayoutWrapper>
            <div className="relative">
                <Button variant={'outline'} size={'sm'}>
                    <Link href="/blogs">More Blogs</Link>
                </Button>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[15rem_48rem] xl:grid-cols-[15rem_48rem_15rem] gap-6 mx-auto">
                    <aside className="hidden lg:flex justify-end">
                        <div className="sticky top-10 w-60 max-h-[calc(100dvh-200px)] overflow-auto">
                            <TableOfContents mdxContent={blog.content} />
                        </div>
                    </aside>

                    <main className="min-w-0 max-w-3xl mx-auto">
                        <BlogPageRenderer blog={blog} />
                    </main>
                </div>
            </div>
        </LayoutWrapper>
    );
}
