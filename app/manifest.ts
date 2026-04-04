import type { MetadataRoute } from "next";
import { mainData } from "@/contents/mainData";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: mainData.title,
        short_name: "Blade Tools",
        description: mainData.description,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/logo-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
        ],
    };
}
