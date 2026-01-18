import { ThemeProvider } from "@/components/ThemeProviders";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
    subsets: ["latin"],
    variable: "--font-ubuntu",
    weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
    title: "Garlic Tools",
    description:
        "Garlic Tools is a secure suite of tools for documents, images, audio, and video - built to keep your data safe and private.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${ubuntu.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
