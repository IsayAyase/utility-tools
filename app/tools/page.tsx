import LayoutWrapper from "@/components/LayoutWrapper";
import ToolsPage from "@/components/pages/ToolsPage";

export default function page() {
    return (
        <LayoutWrapper>
            <ToolsPage selectedCategory={"all"} />
        </LayoutWrapper>
    );
}
