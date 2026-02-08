"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackDialogProps {
    selectedFeedback: any;
    onClose: () => void;
    handleMarkAsRead: (feedbackId: string) => Promise<void>;
    loading: boolean;
}

export function FeedbackDialog({
    selectedFeedback,
    onClose,
    handleMarkAsRead,
    loading
}: FeedbackDialogProps) {

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
