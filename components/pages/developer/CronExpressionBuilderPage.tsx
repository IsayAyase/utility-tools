"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cronExpressionBuilder } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function CronExpressionBuilderPage() {
    const [expression, setExpression] = useState<string>("");
    const [interval, setInterval] = useState<number>(5);
    const [humanReadable, setHumanReadable] = useState<string>("");
    const [nextRuns, setNextRuns] = useState<string[]>([]);
    const [error, setError] = useState<string>("");

    function handleParse() {
        if (!expression.trim()) {
            toast.error("Please enter a cron expression");
            return;
        }

        const result = cronExpressionBuilder({
            expression,
            interval,
        });

        if (result.success && result.data) {
            setHumanReadable(result.data.humanReadable);
            setNextRuns(result.data.nextRuns);
            setError("");
            toast.success("Cron expression parsed!");
        } else {
            setHumanReadable("");
            setNextRuns([]);
            setError(result.error || "Invalid cron expression");
            toast.error(result.error || "Invalid cron expression");
        }
    }

    function handleClear() {
        setExpression("");
        setInterval(5);
        setHumanReadable("");
        setNextRuns([]);
        setError("");
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 max-w-xl w-full m-auto">
            <Field label="Cron Expression" htmlFor="expression" className="w-full">
                <Input
                    id="expression"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g., 0 9 * * 1-5 (every weekday at 9 AM)"
                    className="font-mono"
                />
            </Field>

            <div className="w-full text-xs text-muted-foreground">
                Format: minute hour day-of-month month day-of-week
            </div>

            <Field label="Number of Next Runs" htmlFor="interval" className="w-full">
                <Input
                    id="interval"
                    type="number"
                    min={1}
                    max={20}
                    value={interval}
                    onChange={(e) => setInterval(parseInt(e.target.value) || 5)}
                />
            </Field>

            <Button onClick={handleParse} className="w-full">
                Parse Expression
            </Button>

            {error && (
                <div className="w-full p-3 bg-red-100 text-red-800 rounded-md text-sm">
                    Error: {error}
                </div>
            )}

            {humanReadable && (
                <Field label="Description" htmlFor="description" className="w-full">
                    <Textarea
                        id="description"
                        value={humanReadable}
                        readOnly
                        rows={2}
                        className="bg-secondary"
                    />
                </Field>
            )}

            {nextRuns.length > 0 && (
                <div className="w-full space-y-2">
                    <div className="text-sm font-medium">
                        Next {nextRuns.length} Run{nextRuns.length !== 1 ? "s" : ""}:
                    </div>
                    <div className="bg-secondary p-3 rounded-md font-mono text-sm max-h-48 overflow-auto">
                        {nextRuns.map((run, i) => (
                            <div key={i} className="py-1">
                                {i + 1}. {formatDate(run)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(humanReadable || error) && (
                <Button onClick={handleClear} variant="outline" className="w-full">
                    Clear
                </Button>
            )}
        </div>
    );
}
