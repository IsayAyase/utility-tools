"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugGenerator } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function SlugGeneratorPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [lowercase, setLowercase] = useState<boolean>(true);
    const [replacement, setReplacement] = useState<string>("-");

    function handleGenerate() {
        if (!input.trim()) {
            toast.error("Please enter some text");
            return;
        }

        const result = slugGenerator({
            text: input,
            lowercase,
            replacement: replacement || undefined,
        });

        if (result.success && result.data) {
            setOutput(result.data);
            toast.success("Slug generated!");
        } else {
            toast.error(result.error || "Failed to generate slug");
        }
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
        setLowercase(true);
        setReplacement("-");
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 max-w-xl w-full m-auto">
            <Field label="Input Text" htmlFor="input" className="w-full">
                <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to convert to slug..."
                    rows={4}
                />
            </Field>

            <div className="flex gap-4 w-full items-center">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="lowercase"
                        checked={lowercase}
                        onCheckedChange={(checked) => setLowercase(checked === true)}
                    />
                    <label htmlFor="lowercase" className="text-sm cursor-pointer">
                        Convert to lowercase
                    </label>
                </div>
            </div>

            <Field label="Replacement Character" htmlFor="replacement" className="w-full">
                <Input
                    id="replacement"
                    value={replacement}
                    onChange={(e) => setReplacement(e.target.value)}
                    placeholder="-"
                    maxLength={1}
                    className="w-24"
                />
            </Field>

            <Button onClick={handleGenerate} className="w-full">
                Generate Slug
            </Button>

            {output && (
                <Field label="Output" htmlFor="output" className="w-full">
                    <Textarea
                        id="output"
                        value={output}
                        readOnly
                        rows={2}
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
