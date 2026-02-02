"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { feedbackTypes } from "@/lib/db/feedback/types";
import { useRouter, useSearchParams } from "next/navigation";

export function FiltersPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const key = searchParams.get("key") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const type = searchParams.get("type");
    const markAsRead = searchParams.get("markAsRead");

    const updateFilters = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams);
        params.set('key', key);
        params.set('page', '1'); // Reset to page 1 when filters change
        
        if (newParams.type) {
            params.set('type', newParams.type);
        } else {
            params.delete('type');
        }
        
        if (newParams.markAsRead !== undefined) {
            params.set('markAsRead', newParams.markAsRead);
        } else {
            params.delete('markAsRead');
        }
        
        router.push(`/feedback?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-4">
            {/* Type Filter */}
            <div className="flex-1">
                <Select 
                    value={type || "all"} 
                    onValueChange={(value) => updateFilters({ 
                        type: value === "all" ? undefined : value, 
                        markAsRead: markAsRead || undefined 
                    })}
                >
                    <SelectTrigger className="w-full">
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
            </div>

            {/* Marked Status Filter */}
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="marked-filter"
                        checked={markAsRead === "true"}
                        onCheckedChange={(checked) => updateFilters({ 
                            type: type || undefined, 
                            markAsRead: checked ? "true" : undefined 
                        })}
                    />
                    <Label htmlFor="marked-filter" className="text-sm font-normal whitespace-nowrap">
                        Show Marked
                    </Label>
                </div>
            </div>
        </div>
    );
}