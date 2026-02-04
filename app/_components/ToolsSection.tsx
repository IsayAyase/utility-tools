import { toolsArray } from "../../lib/tools";
import MarqueeTools from "./MarqueeTools";

export default function ToolsSection() {
    return (
        <div className="my-6 md:my-12">
            <h3 className="text-2xl font-light">Tools</h3>
            <MarqueeTools tools={toolsArray} />
        </div>
    );
}
