import { mainData } from "@/contents/mainData";
import { isCategory, objectOfTools } from "@/lib/tools";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; category: string }>;
}): Promise<Metadata> {
    const mainTitle = mainData.title;
    const { category: givenCategory, slug } = await params;
    if (!givenCategory || !slug || !isCategory(givenCategory)) {
        return {
            title: `${mainTitle} | Tool Not Found`,
        };
    }

    const toolsForGivenCategory = objectOfTools[givenCategory];
    const toolsForGivenCategorySlug = toolsForGivenCategory.tools[slug];
    if (!toolsForGivenCategorySlug) {
        return {
            title: `${mainTitle} | Tool Not Found`,
        };
    }

    const title = `${toolsForGivenCategorySlug.name} Online for Free | ${mainTitle}`;
    const description = toolsForGivenCategorySlug.description;
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

            siteName: mainTitle,
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
            canonical: `https://bladetools.prabhatlabs.dev/tools/${category}/${slug}`,
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
