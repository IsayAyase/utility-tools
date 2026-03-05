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
        <div className="flex flex-col gap-4 max-w-xl w-full m-auto">
            <Field label="Cron Expression" htmlFor="expression" className="w-full">
                <Input
                    id="expression"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g., 0 9 * * 1-5 (every weekday at 9 AM)"
                    className="font-mono"
                />
            </Field>

            <div className="text-xs text-muted-foreground">
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

            {/* Output Section - Always visible */}
            {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                    Error: {error}
                </div>
            )}

            <Field label="Description" htmlFor="description" className="w-full">
                <Textarea
                    id="description"
                    value={humanReadable || ""}
                    readOnly
                    placeholder="Description will appear here..."
                    rows={2}
                    className="bg-secondary"
                />
            </Field>

            <div className="w-full">
                <div className="text-sm font-medium mb-2">
                    Next Run Times
                </div>
                <div className="bg-secondary p-3 rounded-md font-mono text-sm h-48 overflow-auto">
                    {nextRuns.length > 0 ? (
                        nextRuns.map((run, i) => (
                            <div key={i} className="py-1">
                                {i + 1}. {formatDate(run)}
                            </div>
                        ))
                    ) : (
                        <span className="text-muted-foreground">Next run times will appear here...</span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button onClick={handleParse} className="flex-1">
                    Parse Expression
                </Button>
                <Button onClick={handleClear} variant="outline" className="flex-1">
                    Clear
                </Button>
            </div>
        </div>
    );
}
