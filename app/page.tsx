import LayoutWrapper from "@/components/LayoutWrapper";
import BlogSection from "./_components/BlogSection";
import CategorySection from "./_components/CategorySection";
import HeroSection from "./_components/HeroSection";

export default function Home() {
    return (
        <LayoutWrapper>
            <HeroSection />
            {/* <ToolsSection /> */}
            <CategorySection />
            <BlogSection />
        </LayoutWrapper>
    );
}
