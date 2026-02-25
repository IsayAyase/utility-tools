import LayoutWrapper from "@/components/LayoutWrapper";
import ToolsPage from "@/components/tools/ToolsPage";

export default function page() {
    return (
        <LayoutWrapper>
            <ToolsPage selectedCategory={"all"} />
        </LayoutWrapper>
    );
}
