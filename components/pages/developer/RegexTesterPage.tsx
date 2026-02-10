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
        <div className="flex flex-col justify-center items-center gap-4 max-w-xl w-full m-auto">
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

            <Button onClick={handleTest} className="w-full">
                Test Regex
            </Button>

            {error && (
                <div className="w-full p-3 bg-red-100 text-red-800 rounded-md text-sm">
                    Error: {error}
                </div>
            )}

            {matchCount > 0 && (
                <div className="w-full space-y-2">
                    <div className="text-sm font-medium">
                        Matches ({matchCount}):
                    </div>
                    <div className="bg-secondary p-3 rounded-md font-mono text-sm max-h-32 overflow-auto">
                        {matches.map((match, i) => (
                            <div key={i} className="text-green-600">
                                Match {i + 1}: &quot;{match}&quot;
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {replaced && (
                <Field label="Replaced Result" htmlFor="replaced" className="w-full">
                    <Textarea
                        id="replaced"
                        value={replaced}
                        readOnly
                        rows={3}
                        className="font-mono bg-secondary"
                    />
                </Field>
            )}

            {(matches.length > 0 || error) && (
                <Button onClick={handleClear} variant="outline" className="w-full">
                    Clear
                </Button>
            )}
        </div>
    );
}
