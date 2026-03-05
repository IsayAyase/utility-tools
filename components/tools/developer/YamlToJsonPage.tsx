"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { yamlToJson } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function YamlToJsonPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");

    async function handleConvert() {
        if (!input.trim()) {
            toast.error("Please enter YAML data");
            return;
        }

        const result = await yamlToJson({
            data: input,
        });

        if (result.success && result.data) {
            setOutput(JSON.stringify(result.data, null, 2));
            toast.success("Conversion successful!");
        } else {
            toast.error(result.error || "Failed to convert");
        }
    }

    function handleDownload() {
        if (!output) return;

        const blob = new Blob([output], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("JSON downloaded!");
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
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl w-full m-auto">
            <Field label="YAML Input" htmlFor="input" className="w-full">
                <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`name: John Doe\nage: 30\nemail: john@example.com\naddress:\n  street: 123 Main St\n  city: New York`}
                    rows={10}
                    className="font-mono"
                />
            </Field>

            {/* Output - Always visible */}
            <Field label="JSON Output" htmlFor="output" className="w-full">
                <Textarea
                    id="output"
                    value={output}
                    readOnly
                    placeholder="Converted JSON will appear here..."
                    rows={10}
                    className="font-mono bg-secondary"
                />
            </Field>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
                <Button onClick={handleDownload} variant="outline" disabled={!output}>
                    Download JSON
                </Button>
                <Button onClick={handleCopy} variant="outline" disabled={!output}>
                    Copy
                </Button>
                <Button onClick={handleClear} variant="outline">
                    Clear
                </Button>
            </div>

            <Button onClick={handleConvert} className="w-full">
                Convert to JSON
            </Button>
        </div>
    );
}
