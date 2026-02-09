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
        applicationName: mainData.title,
        creator: "Prabhat Labs",
        publisher: "Prabhat Labs",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            title,
            description,
            type: "website",
            images: [
                {
                    url: "https://bladetools.prabhatlabs.dev/preview.webp",
                    width: 978,
                    height: 550,
                    alt: `${title} | ${mainData.title}`,
                },
            ],

            siteName: mainData.title,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [
                {
                    url: "https://bladetools.prabhatlabs.dev/preview.webp",
                    width: 978,
                    height: 550,
                    alt: `${title} | ${mainData.title}`,
                },
            ],

            site: "@prabhatlabs",
        },
        alternates: {
            canonical: `https://bladetools.prabhatlabs.dev/tools/${category}`,
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
