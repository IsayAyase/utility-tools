import type { MetadataRoute } from "next";
import { mainData } from "@/contents/mainData";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: mainData.title,
        short_name: "Blade Tools",
        description: mainData.description,
        start_url: "https://localhost:3000",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "48x48",
                type: "image/x-icon",
            },
        ],
    };
}
