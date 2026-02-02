"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationControlsProps {
    currentPage: number;
    currentPageLimit: number;
    hasMore: boolean;
    totalItems: number;
}

export function PaginationControls({
    currentPage,
    currentPageLimit,
    hasMore,
    totalItems,
}: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const key = searchParams.get("key") || "";
    const type = searchParams.get("type");
    const markAsRead = searchParams.get("markAsRead");

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set("key", key);
        params.set("page", page.toString());
        params.set("limit", currentPageLimit.toString());
        if (type) params.set("type", type);
        if (markAsRead) params.set("markAsRead", markAsRead);

        return `/feedback?${params.toString()}`;
    };

    return (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} showing {totalItems} feedbacks
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage <= 1}
                    onClick={() => router.push(buildPageUrl(currentPage - 1))}
                >
                    <FaArrowLeft />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={!hasMore}
                    onClick={() => router.push(buildPageUrl(currentPage + 1))}
                >
                    <FaArrowRight />
                </Button>
            </div>
        </div>
    );
}
