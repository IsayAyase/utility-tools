import { ThemeProvider } from "@/components/ThemeProviders";
import { Toaster } from "@/components/ui/sonner";
import { mainData } from "@/contents/mainData";
import type { Metadata } from "next";
import { ubuntu } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: mainData.title,
    description: mainData.description,
    category: "productivity",
    metadataBase: "https://bladetools.prabhatlabs.dev",
    applicationName: mainData.title,
    creator: "Prabhat Labs",
    publisher: "Prabhat Labs",
    keywords: [
        "free pdf tools",
        "online image converter",
        "pdf merger",
        "word to pdf",
        "image resize",
        "pdf split",
        "add watermark",
        "convert images to pdf",
        "online utilities",
        "free productivity tools",
    ],
    openGraph: {
        title: mainData.title,
        description: mainData.description,
        type: "website",
        images: [
            {
                url: "https://bladetools.prabhatlabs.dev/preview.webp",
                width: 978,
                height: 550,
                alt: `${mainData.title}`,
            },
        ],

        siteName: mainData.title,
    },
    twitter: {
        card: "summary_large_image",
        title: mainData.title,
        description: mainData.description,
        images: [
            {
                url: "https://bladetools.prabhatlabs.dev/preview.webp",
                width: 978,
                height: 550,
                alt: `${mainData.title}`,
            },
        ],

        site: "@prabhatlabs",
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${ubuntu.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" />
                </ThemeProvider>
            </body>
        </html>
    );
}
