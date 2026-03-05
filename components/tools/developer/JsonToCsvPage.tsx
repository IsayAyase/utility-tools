"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { jsonToCsv } from "@/lib/tools/developer";
import {
    ArrowRight,
    Columns,
    Copy,
    Download,
    LayoutList,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface JsonOptionsProps {
    delimiter: string;
    setDelimiter: (value: string) => void;
}

function JsonOptions({ delimiter, setDelimiter }: JsonOptionsProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    Delimiter:
                </span>
                <Select value={delimiter} onValueChange={setDelimiter}>
                    <SelectTrigger className="h-8 w-fit">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=",">Comma (,)</SelectItem>
                        <SelectItem value=";">Semicolon (;)</SelectItem>
                        <SelectItem value="\t">Tab</SelectItem>
                        <SelectItem value="|">Pipe (|)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

function InputActions({
    onClear,
    onConvert,
}: {
    onClear: () => void;
    onConvert: () => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={onClear}
                variant="outline"
                className="flex lg:hidden"
                size={"icon-sm"}
            >
                <Trash2 />
            </Button>
            <Button
                onClick={onConvert}
                className="flex lg:hidden"
                size={"icon-sm"}
            >
                <ArrowRight />
            </Button>
            <Button
                onClick={onClear}
                variant="outline"
                className="hidden lg:flex"
                size={"sm"}
            >
                <Trash2 />
                Clear
            </Button>
            <Button onClick={onConvert} className="hidden lg:flex" size={"sm"}>
                <ArrowRight />
                Convert
            </Button>
        </div>
    );
}

function OutputActions({
    output,
    onCopy,
    onDownload,
}: {
    output: string;
    onCopy: () => void;
    onDownload: () => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={onCopy}
                variant="outline"
                size="icon-sm"
                disabled={!output}
                className="flex lg:hidden"
            >
                <Copy />
            </Button>
            <Button
                onClick={onDownload}
                variant="outline"
                size="icon-sm"
                disabled={!output}
                className="flex lg:hidden"
            >
                <Download />
            </Button>
            <Button
                onClick={onCopy}
                variant="outline"
                size="sm"
                disabled={!output}
                className="hidden lg:flex"
            >
                <Copy />
                Copy
            </Button>
            <Button
                onClick={onDownload}
                variant="outline"
                size="sm"
                disabled={!output}
                className="hidden lg:flex"
            >
                <Download />
                Download
            </Button>
        </div>
    );
}

export default function JsonToCsvPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [delimiter, setDelimiter] = useState<string>(",");
    const [activeTab, setActiveTab] = useState<"input" | "output">("input");
    const [viewMode, setViewMode] = useState<"tab" | "split">("split");

    function handleConvert() {
        if (!input.trim()) {
            toast.error("Please enter JSON data");
            return;
        }

        try {
            const jsonData = JSON.parse(input);

            if (!Array.isArray(jsonData)) {
                toast.error("JSON must be an array of objects");
                return;
            }

            const result = jsonToCsv({
                data: jsonData,
                delimiter,
            });

            if (result.success && result.data) {
                setOutput(result.data);
                toast.success("Conversion successful!");
                if (viewMode === "tab") {
                    setActiveTab("output");
                }
            } else {
                toast.error(result.error || "Failed to convert");
            }
        } catch {
            toast.error("Invalid JSON format");
        }
    }

    function handleDownload() {
        if (!output) return;

        const blob = new Blob([output], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("CSV downloaded!");
    }

    function handleCopy() {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success("Copied to clipboard!");
        }
    }

    function handleClear() {
        setInput("");
        setOutput("");
        setDelimiter(",");
        setActiveTab("input");
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full relative">
            {/* Main Editor Area */}
            <div className="border rounded-lg overflow-hidden bg-card flex flex-col">
                {/* Header */}
                <div className="bg-muted border-b flex items-center justify-between px-4 py-2">
                    {viewMode === "tab" ? (
                        // Tab Mode: Show tabs
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setActiveTab("input")}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === "input"
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                JSON Input
                            </button>
                            <button
                                onClick={() => setActiveTab("output")}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === "output"
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                CSV Output
                            </button>
                        </div>
                    ) : (
                        // Split Mode: Show title and JSON options
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">JSON to CSV</span>
                            <JsonOptions
                                delimiter={delimiter}
                                setDelimiter={setDelimiter}
                            />
                        </div>
                    )}

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-background rounded-lg p-1 border">
                        <button
                            onClick={() => setViewMode("tab")}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === "tab"
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Tab View"
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("split")}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === "split"
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                            title="Split View"
                        >
                            <Columns className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === "tab" ? (
                    // Tab View
                    <div className="relative">
                        {activeTab === "input" ? (
                            <>
                                {/* Input Tab Options */}
                                <div className="border-b px-4 py-2 bg-muted/30 flex items-center justify-between gap-4">
                                    <JsonOptions
                                        delimiter={delimiter}
                                        setDelimiter={setDelimiter}
                                    />
                                    <InputActions
                                        onClear={handleClear}
                                        onConvert={handleConvert}
                                    />
                                </div>
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder='[&#10;  {&#10;    "name": "John",&#10;    "age": 30&#10;  }&#10;]'
                                    className="font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    style={{
                                        height: "700px",
                                        minHeight: "700px",
                                        maxHeight: "700px",
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                {/* Output Tab Actions */}
                                <div className="border-b px-4 py-2 bg-muted/30 flex justify-end">
                                    <OutputActions
                                        output={output}
                                        onCopy={handleCopy}
                                        onDownload={handleDownload}
                                    />
                                </div>
                                <Textarea
                                    value={output}
                                    readOnly
                                    placeholder="Converted CSV will appear here..."
                                    className="font-mono text-sm resize-none border-0 rounded-none bg-secondary/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    style={{
                                        height: "700px",
                                        minHeight: "700px",
                                        maxHeight: "700px",
                                    }}
                                />
                            </>
                        )}
                    </div>
                ) : (
                    // Split View
                    <div className="flex" style={{ height: "700px" }}>
                        <div className="flex-1 flex flex-col">
                            <div className="border-b px-4 py-2 bg-muted/30 flex items-center justify-between gap-4">
                                <span className="text-sm font-medium">
                                    JSON Input
                                </span>
                                <InputActions
                                    onClear={handleClear}
                                    onConvert={handleConvert}
                                />
                            </div>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='[&#10;  {&#10;    "name": "John",&#10;    "age": 30&#10;  }&#10;]'
                                className="font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                            />
                        </div>
                        <div className="w-px bg-border" />
                        <div className="flex-1 flex flex-col">
                            <div className="border-b px-4 py-2 bg-muted/30 flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    CSV Output
                                </span>
                                <OutputActions
                                    output={output}
                                    onCopy={handleCopy}
                                    onDownload={handleDownload}
                                />
                            </div>
                            <Textarea
                                value={output}
                                readOnly
                                placeholder="Converted CSV will appear here..."
                                className="font-mono text-sm resize-none border-0 rounded-none bg-secondary/30 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
