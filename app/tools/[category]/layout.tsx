import { mainData } from "@/contents/mainData";
import { objectOfTools } from "@/lib/tools";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category: givenCategory } = await params;
    const toolsForGivenCategory =
        objectOfTools[givenCategory as keyof typeof objectOfTools];
    if (!givenCategory || !toolsForGivenCategory) {
        return {
            title: `"${mainData.title} | Tool Not Found`,
        };
    }

    const toolsForGivenCategorySlug = toolsForGivenCategory.metadata;
    if (!toolsForGivenCategorySlug) {
        return {
            title: `"${mainData.title} | Tool Not Found`,
        };
    }

    const title = toolsForGivenCategorySlug.title;
    const description = toolsForGivenCategorySlug.description;
    // const imageUrl = toolsForGivenCategorySlug.imageUrl;
    const keywords = toolsForGivenCategorySlug.keywords;
    const category = toolsForGivenCategorySlug.category;

    return {
        title,
        description,
        keywords,
        category,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            title,
            description,
            type: "website",
            images: ["/preview_image_convert_blade_tools.webp"],
            siteName: mainData.title,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/preview_image_convert_blade_tools.webp"],
            site: "@prabhatlabs",
        },
        alternates: {
            canonical: `/tools/${category}`,
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

export default function ToolCategorySlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
