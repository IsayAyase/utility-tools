import { cn } from "@/lib/utils";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function LayoutWrapper({
    children,
    footerEnabled = true,
    className,
}: {
    children: React.ReactNode;
    footerEnabled?: boolean;
    className?: string
}) {
    return (
        <div className="w-full">
            <div className="min-h-dvh">
                <Navbar />
                <div className={cn("h-full max-w-7xl mx-auto px-4 md:px-6 2xl:px-0 py-4", className)}>
                    {children}
                </div>
            </div>
            {footerEnabled && <Footer />}
        </div>
    );
}
