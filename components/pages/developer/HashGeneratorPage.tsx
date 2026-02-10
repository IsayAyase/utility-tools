"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { hashGeneratorSha256 } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function HashGeneratorPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [algorithm, setAlgorithm] = useState<"SHA-256" | "SHA-384" | "SHA-512">("SHA-256");
    const [encoding, setEncoding] = useState<"hex" | "base64">("hex");

    async function handleGenerate() {
        if (!input.trim()) {
            toast.error("Please enter some text");
            return;
        }

        const result = await hashGeneratorSha256({
            data: input,
            algorithm,
            encoding,
        });

        if (result.success && result.data) {
            setOutput(result.data);
            toast.success("Hash generated!");
        } else {
            toast.error(result.error || "Failed to generate hash");
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
        setAlgorithm("SHA-256");
        setEncoding("hex");
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl w-full m-auto">
            <Field label="Input Text" htmlFor="input" className="w-full">
                <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to hash..."
                    rows={6}
                    className="font-mono"
                />
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Algorithm" htmlFor="algorithm" className="w-full">
                    <Select value={algorithm} onValueChange={(value) => setAlgorithm(value as "SHA-256" | "SHA-384" | "SHA-512")}>
                        <SelectTrigger id="algorithm">
                            <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SHA-256">SHA-256</SelectItem>
                            <SelectItem value="SHA-384">SHA-384</SelectItem>
                            <SelectItem value="SHA-512">SHA-512</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Encoding" htmlFor="encoding" className="w-full">
                    <Select value={encoding} onValueChange={(value) => setEncoding(value as "hex" | "base64")}>
                        <SelectTrigger id="encoding">
                            <SelectValue placeholder="Select encoding" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hex">Hexadecimal</SelectItem>
                            <SelectItem value="base64">Base64</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            {/* Output - Always visible */}
            <Field label="Hash Output" htmlFor="output" className="w-full">
                <Textarea
                    id="output"
                    value={output}
                    readOnly
                    placeholder="Hash will appear here..."
                    rows={3}
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

            <Button onClick={handleGenerate} className="w-full">
                Generate Hash
            </Button>
        </div>
    );
}
