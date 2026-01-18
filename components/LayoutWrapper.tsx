import Footer from "./Footer";
import Navbar from "./Navbar";

export default function LayoutWrapper({
    children,
    footerEnabled = true,
}: {
    children: React.ReactNode;
    footerEnabled?: boolean;
}) {
    return (
        <div className="w-full">
            <Navbar />
            <div className="min-h-screen-layout-wrapper max-w-8xl mx-auto px-4 md:px-6 2xl:px-0 my-4">
                {children}
            </div>
            {footerEnabled && <Footer />}
        </div>
    );
}
