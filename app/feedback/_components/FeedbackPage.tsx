"use client";

import { deleteFeedback, markAsRead } from "@/lib/db/feedback/functions";
import type { IFeedback } from "@/lib/db/feedback/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ControlPanel from "./ControlPanel";
import { FeedbackDialog } from "./FeedbackDialog";
import { FeedbackTable } from "./FeedbackTable";
import { PaginationControls } from "./PaginationControls";

export default function FeedbackPage({
    feedbacks,
}: {
    feedbacks: Array<IFeedback>;
}) {
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const currentPageLimit = parseInt(searchParams.get("limit") || "10");

    const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [renderFeedbacks, setRenderFeedbacks] = useState(feedbacks);

    const handleDelete = async (feedbackId: string) => {
        try {
            setLoading(true);
            await deleteFeedback(feedbackId);
            setRenderFeedbacks(
                feedbackId === "all"
                    ? []
                    : renderFeedbacks.filter(
                          (feedback: any) => feedback.id !== feedbackId,
                      ),
            );
            toast.success("Feedback deleted");
        } catch (error) {
            console.error("Error deleting feedback:", error);
            toast.error("Error deleting feedback");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (feedbackId: string) => {
        try {
            setLoading(true);
            await markAsRead(feedbackId);
            setRenderFeedbacks(
                renderFeedbacks.map((feedback: any) => {
                    if (feedback.id === feedbackId || feedbackId === "all") {
                        return { ...feedback, markAsRead: true };
                    }
                    return feedback;
                }),
            );
            toast.success("Marked as read");
        } catch (error) {
            console.error("Error marking as read:", error);
            toast.error("Error marking as read");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ControlPanel
                onDeleteAll={() => handleDelete("all")}
                onMarkAllAsRead={() => handleMarkAsRead("all")}
                loading={loading}
            />

            {renderFeedbacks.length > 0 ? (
                <>
                    <FeedbackTable
                        feedbacks={renderFeedbacks}
                        handleDelete={handleDelete}
                        handleMarkAsRead={handleMarkAsRead}
                        loading={loading}
                        onSelectedFeedback={setSelectedFeedback}
                    />
                    <PaginationControls
                        currentPage={currentPage}
                        currentPageLimit={currentPageLimit}
                        hasMore={feedbacks.length === currentPageLimit}
                        totalItems={feedbacks.length}
                    />
                </>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    No feedback found.
                </div>
            )}

            <FeedbackDialog
                selectedFeedback={selectedFeedback}
                onClose={() => setSelectedFeedback(null)}
                handleMarkAsRead={handleMarkAsRead}
                loading={loading}
            />
        </div>
    );
}
