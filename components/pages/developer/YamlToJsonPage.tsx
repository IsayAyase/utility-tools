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
        <div className="flex flex-col justify-center items-center gap-4 max-w-xl w-full m-auto">
            <Field label="YAML Input" htmlFor="input" className="w-full">
                <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`name: John Doe&#10;age: 30&#10;email: john@example.com&#10;address:&#10;  street: 123 Main St&#10;  city: New York`}
                    rows={10}
                    className="font-mono"
                />
            </Field>

            <Button onClick={handleConvert} className="w-full">
                Convert to JSON
            </Button>

            {output && (
                <Field label="JSON Output" htmlFor="output" className="w-full">
                    <Textarea
                        id="output"
                        value={output}
                        readOnly
                        rows={10}
                        className="font-mono bg-secondary"
                    />
                </Field>
            )}

            {output && (
                <div className="w-full grid grid-cols-3 items-center gap-2">
                    <Button onClick={handleDownload} variant="outline" className="w-full">
                        Download JSON
                    </Button>
                    <Button onClick={handleCopy} variant="outline" className="w-full">
                        Copy
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="w-full">
                        Clear
                    </Button>
                </div>
            )}
        </div>
    );
}
