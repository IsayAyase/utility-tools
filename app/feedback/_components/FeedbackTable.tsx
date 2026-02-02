"use client";

import { Button } from "@/components/ui/button";
import { deleteFeedback } from "@/lib/db/feedback/functions";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "./Badge";
import { FeedbackDialog } from "./FeedbackDialog";

interface FeedbackTableProps {
    feedbacks: Array<{
        id: string | any;
        name: string;
        email: string;
        type: string;
        message: string;
        createdAt: Date;
        markAsRead: boolean;
    }>;
}

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
    const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

    const handleDelete = async (feedbackId: string) => {
        try {
            await deleteFeedback(feedbackId);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Name</th>
                            <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Email</th>
                            <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Type</th>
                            <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Message</th>
                            <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Date</th>
                            <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                            <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr 
                                key={index} 
                                className="border-b hover:bg-muted/50 cursor-pointer"
                                onClick={() => setSelectedFeedback(feedback)}
                            >
                                <td className="p-4 font-medium whitespace-nowrap truncate max-w-32">{feedback.name}</td>
                                <td className="p-4 text-muted-foreground whitespace-nowrap truncate max-w-48">{feedback.email}</td>
                                <td className="p-4 whitespace-nowrap capitalize">
                                    <Badge variant="secondary">
                                        {feedback.type?.replace("-", " ")}
                                    </Badge>
                                </td>
                                <td className="p-4 text-muted-foreground truncate max-w-64">{feedback.message}</td>
                                <td className="p-4 whitespace-nowrap">
                                    {feedback.createdAt 
                                        ? new Date(feedback.createdAt).toLocaleDateString()
                                        : "N/A"
                                    }
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <Badge variant={feedback.markAsRead ? "default" : "destructive"}>
                                        {feedback.markAsRead ? "Read" : "Unread"}
                                    </Badge>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(feedback.id?.toString());
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <FeedbackDialog 
                feedbacks={feedbacks} 
                selectedFeedback={selectedFeedback}
                onClose={() => setSelectedFeedback(null)}
            />
        </>
    );
}