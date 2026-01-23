const features = [
    {
        line: "Your files never leave your device",
        subline: "100% client-side processing. No uploads, no servers, no data collection."
    },
    {
        line: "Documents, images, and media tools",
        subline: "Convert, merge, compress, and edit—all processed locally in your browser"
    },
    {
        line: "No sign-ups, no limits, no tracking",
        subline: "Professional-grade tools, completely free. Your files, your privacy."
    }
]

const footer = {
    sections: [
        {
            title: "Links",
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
    subHeroLine: "Convert, merge, compress, and edit. All processed locally in your browser.",
    description: "A secure suite of tools for documents, images, audio, and video—built to keep your data safe and private.",
    features,
    ctaBtn: {
        text: "Use Blade Tools",
        url: "/tools"
    },
    footer
}
