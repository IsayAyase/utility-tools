import { ThemeProvider } from "@/components/ThemeProviders";
import { mainData } from "@/contents/mainData";
import type { Metadata } from "next";
import { ubuntu } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: mainData.title,
    description: mainData.description,
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
                </ThemeProvider>
            </body>
        </html>
    );
}
