
import RenderMDX from "@/components/MdxRenderer";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blogs/types";

export default function BlogPageRenderer({ blog }: { blog: BlogPost }) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                        {blog.metadata.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {blog.metadata.description}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <span>
                        {blog.metadata.date
                            ? new Date(blog.metadata.date).toLocaleDateString()
                            : ""}
                    </span>
                    <span>{blog.metadata.author}</span>
                    <span>{blog.metadata.readTime}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {blog.metadata.tags?.map((tag) => (
                        <Badge
                            key={tag}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
            <RenderMDX source={blog.content} />
        </div>
    );
}
