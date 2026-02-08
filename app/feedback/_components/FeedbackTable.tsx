"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IFeedback } from "@/lib/db/feedback/types";
import { Check, Trash2 } from "lucide-react";

interface FeedbackTableProps {
    feedbacks: Array<IFeedback>;
    handleDelete: (feedbackId: string) => Promise<void>;
    handleMarkAsRead: (feedbackId: string) => Promise<void>;
    loading: boolean;
    onSelectedFeedback: (feedback: IFeedback) => void;
}

export function FeedbackTable({
    feedbacks,
    handleDelete,
    handleMarkAsRead,
    loading,
    onSelectedFeedback,
}: FeedbackTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                            Name
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                            Email
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                            Type
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                            Message
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                            Date
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                            Status
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((feedback, index) => (
                        <tr
                            key={index}
                            className="border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => onSelectedFeedback(feedback)}
                        >
                            <td className="p-4 font-medium whitespace-nowrap truncate max-w-32">
                                {feedback.name}
                            </td>
                            <td className="p-4 text-muted-foreground whitespace-nowrap truncate max-w-48">
                                {feedback.email}
                            </td>
                            <td className="p-4 whitespace-nowrap capitalize">
                                <Badge variant="secondary">
                                    {feedback.type?.replace("-", " ")}
                                </Badge>
                            </td>
                            <td className="p-4 text-muted-foreground truncate max-w-64">
                                {feedback.message}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                                {feedback.createdAt
                                    ? new Date(
                                          feedback.createdAt,
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                                <Badge
                                    variant={
                                        feedback.markAsRead
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {feedback.markAsRead ? "Read" : "Unread"}
                                </Badge>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="destructive"
                                        size="icon-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(
                                                feedback.id?.toString(),
                                            );
                                        }}
                                        disabled={loading}
                                    >
                                        <Trash2 />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsRead(
                                                feedback.id?.toString(),
                                            );
                                        }}
                                        disabled={
                                            loading || feedback.markAsRead
                                        }
                                    >
                                        <Check />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
