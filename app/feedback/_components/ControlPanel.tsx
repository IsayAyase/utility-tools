"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { feedbackTypes } from "@/lib/db/feedback/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function ControlPanel({
    onDeleteAll,
    onMarkAllAsRead,
    loading,
}: {
    onDeleteAll: () => Promise<void>;
    onMarkAllAsRead: () => Promise<void>;
    loading: boolean;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const key = searchParams.get("key") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const type = searchParams.get("type");
    const markAsRead = searchParams.get("markAsRead");

    const updateFilters = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams);
        params.set("key", key);
        params.set("page", "1"); // Reset to page 1 when filters change

        if (newParams.type) {
            params.set("type", newParams.type);
        } else {
            params.delete("type");
        }

        if (newParams.markAsRead !== undefined) {
            params.set("markAsRead", newParams.markAsRead);
        } else {
            params.delete("markAsRead");
        }

        router.push(`/feedback?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center md:justify-end gap-4">
            <Select
                value={type || "all"}
                onValueChange={(value) =>
                    updateFilters({
                        type: value === "all" ? undefined : value,
                        markAsRead: markAsRead || undefined,
                    })
                }
            >
                <SelectTrigger className="capitalize" size={"sm"}>
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {feedbackTypes.map((feedbackType) => (
                        <SelectItem
                            key={feedbackType}
                            value={feedbackType}
                            className="capitalize"
                        >
                            {feedbackType.replace("-", " ")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                onClick={() =>
                    updateFilters({
                        type: type || undefined,
                        markAsRead: markAsRead !== "true" ? "true" : undefined,
                    })
                }
                type="button"
                className="flex gap-2 justify-center items-center"
                variant={"outline"}
                size={"sm"}
            >
                <span
                    className={`${markAsRead !== "true" ? "bg-red-500" : "bg-green-500"} w-2 h-2 rounded-full`}
                />
                Show Marked
            </Button>
            <Button
                onClick={() => window.location.reload()}
                disabled={loading}
                size={"sm"}
                variant={"outline"}
            >
                Reload
            </Button>
            <Button
                onClick={onDeleteAll}
                disabled={loading}
                size={"sm"}
                variant={"destructive"}
            >
                {"Delete All"}
            </Button>
            <Button
                onClick={onMarkAllAsRead}
                disabled={loading}
                size={"sm"}
            >
                {"Mark All as Read"}
            </Button>
        </div>
    );
}
