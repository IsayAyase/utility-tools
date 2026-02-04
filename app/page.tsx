import LayoutWrapper from "@/components/LayoutWrapper";
import BlogSection from "./_components/BlogSection";
import HeroSection from "./_components/HeroSection";
import ToolsSection from "./_components/ToolsSection";

export default function Home() {
    return (
        <LayoutWrapper>
            <HeroSection />
            <ToolsSection />
            <BlogSection />
        </LayoutWrapper>
    );
}
