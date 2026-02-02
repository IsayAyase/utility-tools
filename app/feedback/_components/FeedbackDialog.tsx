"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { markAsRead } from "@/lib/db/feedback/functions";
import { useState } from "react";
import { Badge } from "./Badge";

interface FeedbackDialogProps {
    feedbacks: Array<{
        id: string | any;
        name: string;
        email: string;
        type: string;
        message: string;
        createdAt: Date;
        markAsRead: boolean;
    }>;
    selectedFeedback: any;
    onClose: () => void;
}

export function FeedbackDialog({
    selectedFeedback,
    onClose,
}: FeedbackDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleMarkAsRead = async (feedbackId: string) => {
        try {
            setLoading(true);
            await markAsRead(feedbackId);
            window.location.reload(); // Simple refresh since we're on server side
        } catch (error) {
            console.error("Error marking as read:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedFeedback) return null;

    return (
        <Dialog
            open={!!selectedFeedback}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Feedback Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Badge
                            variant={
                                selectedFeedback.markAsRead
                                    ? "default"
                                    : "destructive"
                            }
                        >
                            {selectedFeedback.markAsRead ? "Read" : "Unread"}
                        </Badge>
                        <p className="font-medium">{selectedFeedback.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {selectedFeedback.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {selectedFeedback.createdAt
                                ? new Date(
                                      selectedFeedback.createdAt,
                                  ).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    <div className="px-4 py-3 bg-muted rounded-lg">
                        <p className="whitespace-pre-wrap">
                            {selectedFeedback.message}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {!selectedFeedback.markAsRead && (
                        <Button
                            onClick={() =>
                                handleMarkAsRead(
                                    selectedFeedback.id?.toString(),
                                )
                            }
                            disabled={loading}
                        >
                            {loading ? "Marking..." : "Mark as Read"}
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
