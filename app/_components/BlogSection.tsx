import { Button } from "@/components/ui/button";
import { getAllBlogs } from "@/lib/blogs";
import Link from "next/link";
import BlogItemCard from "../blogs/_components/BlogItemCard";

export default function BlogSection() {
    const blogs = getAllBlogs(3);
    return (
        <div className="my-10 md:my-20 grid grid-cols-1">
            <h3 className="text-2xl font-light">Blogs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                {blogs.map((post, index) => (
                    <BlogItemCard
                        key={post.slug}
                        post={post}
                        linkClassName={
                            index === blogs.length - 1
                                ? "md:col-span-2 md:h-full lg:col-span-1"
                                : ""
                        }
                    />
                ))}
            </div>
            <div className="flex items-center justify-center">
                <Link href="/blogs">
                    <Button variant={"outline"}>More Blogs</Button>
                </Link>
            </div>
        </div>
    );
}
