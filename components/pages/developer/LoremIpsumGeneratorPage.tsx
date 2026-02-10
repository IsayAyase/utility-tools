"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { loremIpsumGenerator } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function LoremIpsumGeneratorPage() {
    const [output, setOutput] = useState<string>("");
    const [count, setCount] = useState<number>(5);
    const [units, setUnits] = useState<"words" | "sentences" | "paragraphs">(
        "paragraphs",
    );
    const [startWithLorem, setStartWithLorem] = useState<boolean>(true);

    function handleGenerate() {
        const result = loremIpsumGenerator({
            count,
            units,
            startWithLorem,
        });

        if (result.success && result.data) {
            setOutput(result.data);
            toast.success("Lorem Ipsum generated!");
        } else {
            toast.error(result.error || "Failed to generate Lorem Ipsum");
        }
    }

    function handleCopy() {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success("Copied to clipboard!");
        }
    }

    function handleClear() {
        setOutput("");
        setCount(5);
        setUnits("paragraphs");
        setStartWithLorem(true);
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl w-full m-auto">
            <Field
                label={`Number of ${units}`}
                htmlFor="count"
                className="w-full"
            >
                <div className="flex items-center gap-4">
                    <Slider
                        id="count"
                        value={[count]}
                        onValueChange={(value) => setCount(value[0])}
                        min={1}
                        max={
                            units === "words"
                                ? 100
                                : units === "sentences"
                                  ? 20
                                  : 10
                        }
                        step={1}
                        className="flex-1"
                    />
                    <span className="w-12 text-center font-mono">{count}</span>
                </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Units" htmlFor="units" className="w-full">
                    <Select
                        value={units}
                        onValueChange={(value) => {
                            setUnits(
                                value as "words" | "sentences" | "paragraphs",
                            );
                            setCount(
                                value === "words"
                                    ? 20
                                    : value === "sentences"
                                      ? 5
                                      : 3,
                            );
                        }}
                    >
                        <SelectTrigger id="units">
                            <SelectValue placeholder="Select units" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="words">Words</SelectItem>
                            <SelectItem value="sentences">Sentences</SelectItem>
                            <SelectItem value="paragraphs">
                                Paragraphs
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                {units === "paragraphs" && (
                    <div className="flex items-end mb-3 gap-2">
                        <Checkbox
                            id="startWithLorem"
                            checked={startWithLorem}
                            onCheckedChange={(checked) =>
                                setStartWithLorem(checked === true)
                            }
                        />
                        <label
                            htmlFor="startWithLorem"
                            className="text-sm cursor-pointer"
                        >
                            Start with &quot;Lorem ipsum...&quot;
                        </label>
                    </div>
                )}
            </div>

            {/* Output - Always visible */}
            <Field label="Generated Text" htmlFor="output" className="w-full">
                <Textarea
                    id="output"
                    value={output}
                    readOnly
                    placeholder="Generated Lorem Ipsum will appear here..."
                    rows={10}
                    className="bg-secondary"
                />
            </Field>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1"
                    disabled={!output}
                >
                    Copy to Clipboard
                </Button>
                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1"
                >
                    Clear
                </Button>
            </div>

            <Button onClick={handleGenerate} className="w-full">
                Generate
            </Button>
        </div>
    );
}
