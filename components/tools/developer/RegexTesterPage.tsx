"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { regexTester } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function RegexTesterPage() {
    const [pattern, setPattern] = useState<string>("");
    const [flags, setFlags] = useState<string>("g");
    const [testString, setTestString] = useState<string>("");
    const [replaceString, setReplaceString] = useState<string>("");
    const [matches, setMatches] = useState<string[]>([]);
    const [matchCount, setMatchCount] = useState<number>(0);
    const [replaced, setReplaced] = useState<string>("");
    const [error, setError] = useState<string>("");

    function handleTest() {
        if (!pattern.trim()) {
            toast.error("Please enter a regex pattern");
            return;
        }

        const result = regexTester({
            pattern,
            flags,
            testString,
            replaceString: replaceString || undefined,
        });

        if (result.success && result.data) {
            setMatches(result.data.matches.map((m) => m[0]));
            setMatchCount(result.data.matchCount);
            setReplaced(result.data.replaced || "");
            setError("");
            toast.success(`Found ${result.data.matchCount} match${result.data.matchCount !== 1 ? "es" : ""}`);
        } else {
            setMatches([]);
            setMatchCount(0);
            setReplaced("");
            setError(result.error || "Invalid regex pattern");
            toast.error(result.error || "Invalid regex pattern");
        }
    }

    function handleClear() {
        setPattern("");
        setFlags("g");
        setTestString("");
        setReplaceString("");
        setMatches([]);
        setMatchCount(0);
        setReplaced("");
        setError("");
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl w-full m-auto">
            <div className="grid grid-cols-2 gap-4">
                <Field label="Regex Pattern" htmlFor="pattern" className="w-full">
                    <Input
                        id="pattern"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="e.g., \\d+ or [a-zA-Z]+"
                        className="font-mono"
                    />
                </Field>

                <Field label="Flags" htmlFor="flags" className="w-full">
                    <Input
                        id="flags"
                        value={flags}
                        onChange={(e) => setFlags(e.target.value)}
                        placeholder="g, i, m, etc."
                        className="font-mono"
                    />
                </Field>
            </div>

            <Field label="Test String" htmlFor="testString" className="w-full">
                <Textarea
                    id="testString"
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Enter text to test against the regex..."
                    rows={4}
                />
            </Field>

            <Field label="Replace String (Optional)" htmlFor="replaceString" className="w-full">
                <Input
                    id="replaceString"
                    value={replaceString}
                    onChange={(e) => setReplaceString(e.target.value)}
                    placeholder="Replacement text (use $1, $2 for groups)"
                />
            </Field>

            {/* Output Section - Always visible */}
            {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                    Error: {error}
                </div>
            )}

            <div className="w-full">
                <div className="text-sm font-medium mb-2">
                    Matches ({matchCount})
                </div>
                <div className="bg-secondary p-3 rounded-md font-mono text-sm h-32 overflow-auto">
                    {matches.length > 0 ? (
                        matches.map((match, i) => (
                            <div key={i} className="text-green-600 py-0.5">
                                Match {i + 1}: &quot;{match}&quot;
                            </div>
                        ))
                    ) : (
                        <span className="text-muted-foreground">Matches will appear here...</span>
                    )}
                </div>
            </div>

            <Field label="Replaced Result" htmlFor="replaced" className="w-full">
                <Textarea
                    id="replaced"
                    value={replaced}
                    readOnly
                    placeholder="Replaced result will appear here..."
                    rows={3}
                    className="font-mono bg-secondary"
                />
            </Field>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button onClick={handleTest} className="flex-1">
                    Test Regex
                </Button>
                <Button onClick={handleClear} variant="outline" className="flex-1">
                    Clear
                </Button>
            </div>
        </div>
    );
}
