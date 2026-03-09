import LayoutWrapper from "@/components/LayoutWrapper";
import Background from "./_components/Background";
import BlogSection from "./_components/BlogSection";
import CategorySection from "./_components/CategorySection";
import FAQSection from "./_components/FAQSection";
import HeroSection from "./_components/HeroSection";

export default function Home() {
    return (
        <LayoutWrapper>
            <Background />
            <HeroSection />
            <CategorySection />
            <FAQSection />
            <BlogSection />
        </LayoutWrapper>
    );
}
