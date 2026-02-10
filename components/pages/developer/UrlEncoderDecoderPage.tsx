"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { urlEncoderDecoder } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function UrlEncoderDecoderPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    async function handleProcess() {
        if (!input.trim()) {
            toast.error("Please enter some text");
            return;
        }

        const result = await urlEncoderDecoder({
            text: input,
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
        <div className="flex flex-col justify-center items-center gap-4 max-w-xl w-full m-auto">
            <div className="flex gap-2 w-full">
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

            <Button onClick={handleProcess} className="w-full">
                {mode === "encode" ? "Encode" : "Decode"}
            </Button>

            {output && (
                <Field label="Output" htmlFor="output" className="w-full">
                    <Textarea
                        id="output"
                        value={output}
                        readOnly
                        rows={6}
                        className="font-mono bg-secondary"
                    />
                </Field>
            )}

            {output && (
                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button onClick={handleCopy} variant="outline" className="w-full">
                        Copy to Clipboard
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="w-full">
                        Clear
                    </Button>
                </div>
            )}
        </div>
    );
}
