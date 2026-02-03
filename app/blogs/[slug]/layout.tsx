import { mainData } from "@/contents/mainData";
import { getBlogBySlug } from "@/lib/blogs";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const blog = getBlogBySlug(slug);

    if (!blog) {
        return {
            title: `${mainData.title} | Blog Not Found`,
        };
    }

    const title = `${blog.metadata.title} | ${mainData.title}`;
    const description =
        blog.metadata.description ||
        `Read ${blog.metadata.title} on ${mainData.title}`;
    const keywords =
        blog.metadata.tags?.join(", ") ||
        blog.metadata.category ||
        "blog, article";
    const author = blog.metadata.author?.join(", ") || mainData.title;
    const publishDate =
        blog.metadata.date instanceof Date
            ? blog.metadata.date.toISOString()
            : new Date(blog.metadata.date).toISOString();

    return {
        title,
        description,
        keywords,
        authors: author ? [{ name: author }] : [],
        category: blog.metadata.category || "blog",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: publishDate,
            authors: author ? [author] : [],
            tags: blog.metadata.tags || [],
            images: blog.metadata.imageUrl
                ? [blog.metadata.imageUrl]
                : ["/preview_image_convert_blade_tools.webp"],
            siteName: mainData.title,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: blog.metadata.imageUrl
                ? [blog.metadata.imageUrl]
                : ["/preview_image_convert_blade_tools.webp"],
            site: "@prabhatlabs",
        },
        alternates: {
            canonical: `/blogs/${slug}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default function BlogSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
