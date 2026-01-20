import { mainData } from "@/contents/mainData";
import { isCategory, objectOfTools } from "@/lib/tools";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; category: string }>;
}): Promise<Metadata> {
    const { category: givenCategory, slug } = await params;
    if (!givenCategory || !slug || !isCategory(givenCategory)) {
        return {
            title: `${mainData.title} | Tool Not Found`,
        };
    }
    
    const toolsForGivenCategory =
        objectOfTools[givenCategory];
    const toolsForGivenCategorySlug =
        toolsForGivenCategory.tools[slug];
    if (!toolsForGivenCategorySlug) {
        return {
            title: `${mainData.title} | Tool Not Found`,
        };
    }

    const title = toolsForGivenCategorySlug.name;
    const description = toolsForGivenCategorySlug.description;
    // const imageUrl = toolsForGivenCategorySlug.imageUrl;
    const keywords = toolsForGivenCategorySlug.keywords;
    const category = toolsForGivenCategorySlug.category;

    return {
        title: `${title} | ${mainData.title}`,
        description,
        keywords,
        category,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            title: `${title} | ${mainData.title}`,
            description,
            type: "website",
            // images: imageUrl
            //     ? [
            //           {
            //               url: imageUrl,
            //               width: 1200,
            //               height: 630,
            //               alt: title,
            //           },
            //       ]
            //     : undefined,
            siteName: mainData.title,
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | ${mainData.title}`,
            description,
            // images: imageUrl ? [imageUrl] : undefined,
            site: "@prabhatlabs",
        },
        alternates: {
            canonical: `/tools/${category}/${slug}`,
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
