import { getAllBlogs } from "@/lib/blogs";
import BlogItemCard from "../blogs/_components/BlogItemCard";
import FloatingIcons from "./FloatingIcons";

export default function BlogSection() {
    const blogs = getAllBlogs(3);
    return (
        <div className="my-10 md:my-20 grid grid-cols-1 lg:grid-cols-[auto_minmax(300px,1fr)] gap-6">
            <div>
                <h3 className="text-2xl font-light">Blogs</h3>
                <div className={`flex flex-col gap-6 my-6`}>
                    {blogs.map((post) => (
                        <BlogItemCard key={post.slug} post={post} />
                    ))}
                </div>
            </div>

            <FloatingIcons />
        </div>
    );
}
