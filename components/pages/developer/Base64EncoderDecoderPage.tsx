"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base64EncoderDecoder } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function Base64EncoderDecoderPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    async function handleProcess() {
        if (!input.trim()) {
            toast.error("Please enter some text");
            return;
        }

        const result = await base64EncoderDecoder({
            data: input,
            mode,
        });

        if (result.success && result.data) {
            setOutput(result.data);
            toast.success(`Successfully ${mode}d!`);
        } else {
            toast.error(result.error || `Failed to ${mode}`);
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard!");
    }

    function handleClear() {
        setInput("");
        setOutput("");
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl w-full m-auto">
            {/* Mode Toggle */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant={mode === "encode" ? "default" : "outline"}
                    onClick={() => setMode("encode")}
                    className="flex-1"
                >
                    Encode
                </Button>
                <Button
                    type="button"
                    variant={mode === "decode" ? "default" : "outline"}
                    onClick={() => setMode("decode")}
                    className="flex-1"
                >
                    Decode
                </Button>
            </div>

            {/* Input */}
            <Field label="Input" htmlFor="input" className="w-full">
                <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Enter text to ${mode}...`}
                    rows={6}
                    className="font-mono"
                />
            </Field>

            {/* Output - Always visible */}
            <Field label="Output" htmlFor="output" className="w-full">
                <Textarea
                    id="output"
                    value={output}
                    readOnly
                    placeholder="Result will appear here..."
                    rows={6}
                    className="font-mono bg-secondary"
                />
            </Field>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" className="flex-1" disabled={!output}>
                    Copy to Clipboard
                </Button>
                <Button onClick={handleClear} variant="outline" className="flex-1">
                    Clear
                </Button>
            </div>

            <Button onClick={handleProcess} className="w-full">
                {mode === "encode" ? "Encode" : "Decode"}
            </Button>
        </div>
    );
}
