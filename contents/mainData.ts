const keywords = [
    // Brand Keywords
    "BladeTools",
    "BladeTools online",
    "BladeTools official",

    // Core USP (Unique Selling Proposition) - High Value
    "client-side file processing",
    "private online tools",
    "no-upload file converter",
    "secure document editor",
    "browser-based file tools",
    "offline-capable online tools",
    "privacy-first PDF tools",
    "secure image resizer",
    "local video processing",

    // Document & PDF Keywords
    "online PDF toolkit",
    "merge PDF without upload",
    "secure Word to PDF converter",
    "split PDF pages online",
    "edit PDF metadata privately",
    "add watermark to PDF online",
    "convert DOCX to PDF safely",

    // Image Keywords
    "online image resizer",
    "private image converter",
    "convert JPG to WebP",
    "batch image to PDF",
    "crop images in browser",
    "secure photo editor online",

    // Audio & Video Keywords
    "online audio cutter",
    "merge MP3 files privately",
    "trim video in browser",
    "hardcode subtitles online",
    "convert MP4 to WebM",
    "audio format converter",
    "secure video trimmer",

    // General & Utility Keywords
    "all-in-one file toolkit",
    "free online utilities",
    "web-based file editor",
    "no registration file tools",
    "fast file converter",
    "multimedia processing suite"
];

const features = [
    {
        line: "Your files never leave your device",
        subline: "100% client-side processing. No uploads, no servers, no data collection."
    },
    {
        line: "Documents, images, and media tools",
        subline: "PDFs, images, audio, video - convert, compress, trim and edit in seconds."
    },
    {
        line: "No sign-ups, no limits, no tracking",
        subline: "Professional-grade tools, completely free. Your files, your privacy."
    }
]

const footer = {
    sections: [
        {
            title: "Tool Categories",
            links: [
                {
                    title: "All",
                    url: "/tools",
                    target: "_self"
                },
                {
                    title: "Documents",
                    url: "/tools/documents",
                    target: "_self"
                },
                {
                    title: "Images",
                    url: "/tools/images",
                    target: "_self"
                },
                {
                    title: "Audio",
                    url: "/tools/audio",
                    target: "_self"
                },
                {
                    title: "Video",
                    url: "/tools/video",
                    target: "_self"
                },
            ]
        },
        {
            title: "Social",
            links: [
                {
                    title: "Site",
                    url: "https://prabhatlabs.dev",
                    target: "_blank"
                },
                {
                    title: "GitHub",
                    url: "https://github.com/IsayAyase",
                    target: "_blank"
                },
                {
                    title: "X",
                    url: "https://x.com/prabhatlabs",
                    target: "_blank"
                },
                {
                    title: "Gmail",
                    url: "mailto:workforprabhat1254.com",
                    target: "_blank"
                },
            ]
        },
        {
            title: "Legal",
            links: [
                {
                    title: "Privacy Policy",
                    url: "/privacy-policy",
                    target: "_self"
                },
                {
                    title: "Terms of Service",
                    url: "/terms-of-service",
                    target: "_self"
                },
            ]
        }
    ]
}

export const mainData = {
    title: "Blade Tools",
    heroLine: "Your files. Your device. Period.",
    subHeroLine: "Convert, merge, trim, compress, and edit. All processed locally in your browser.",
    description: "A secure suite of tools for documents, images, audio, and video—built to keep your data safe and private.",
    keywords,
    features,
    ctaBtn: {
        text: "Use Blade Tools",
        url: "/tools"
    },
    footer
}
