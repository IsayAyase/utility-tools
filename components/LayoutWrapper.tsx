import Footer from "./Footer";
import LoadFFmpeg from "./LoadFFmpeg";
import Navbar from "./Navbar";

export default function LayoutWrapper({
    children,
    footerEnabled = true,
}: {
    children: React.ReactNode;
    footerEnabled?: boolean;
}) {
    return (
        <div className="w-full overflow-hidden">
            <div className="min-h-dvh">
                <Navbar />
                <div className="h-full max-w-7xl mx-auto px-4 md:px-6 2xl:px-0 py-4">
                    {children}
                </div>
            </div>
            {footerEnabled && <Footer />}
            
            {/* loading ffmpeg wasm */}
            <LoadFFmpeg />
        </div>
    );
}
