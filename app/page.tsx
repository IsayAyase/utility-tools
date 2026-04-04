import LayoutWrapper from "@/components/LayoutWrapper";
import Background from "./_components/Background";
import BlogSection from "./_components/BlogSection";
import CategorySection from "./_components/CategorySection";
import FAQSection from "./_components/FAQSection";
import HeroSection from "./_components/HeroSection";
import { racingSansOne } from "./fonts";
import { DiMootoolsBadge } from "react-icons/di";

export default function Home() {
    return (
        <LayoutWrapper>
            <Background />
            <HeroSection />
            <CategorySection />
            <FAQSection />
            <BlogSection />

            <div className="flex items-center justify-center p-8">
                <div
                    className={`${racingSansOne.className} overflow-hidden relative border border-border p-2 size-15 bg-black flex flex-col items-center justify-center`}
                >
                    <span className="w-15 h-6 bg-red-500"></span>
                    <DiMootoolsBadge className="absolute mt-20 size-45" />
                </div>
            </div>
        </LayoutWrapper>
    );
}
