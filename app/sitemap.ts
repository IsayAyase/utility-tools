import { objectOfTools } from "@/lib/tools";
import { MetadataRoute } from "next";

const BASE_URL = "https://bladetools.prabhatlabs.dev";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date("2026-02-01")

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified,
        },
        {
            url: `${BASE_URL}/tools`,
            lastModified,
        },
    ];

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = Object.keys(objectOfTools).map(
        (category) => ({
            url: `${BASE_URL}/tools/${category}`,
            lastModified,
        })
    );

    // Tool pages
    const toolPages: MetadataRoute.Sitemap = Object.entries(objectOfTools).flatMap(
        ([category, data]) =>
            Object.keys(data.tools).map((slug) => ({
                url: `${BASE_URL}/tools/${category}/${slug}`,
                lastModified,
            }))
    );

    return [...staticPages, ...categoryPages, ...toolPages];
}
