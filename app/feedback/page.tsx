import LayoutWrapper from "@/components/LayoutWrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import envvars from "@/constants/envvars";
import { getFeedback } from "@/lib/db/feedback/functions";
import type {
    FeedbackTypesType,
    IGetFeedbackInput,
} from "@/lib/db/feedback/types";
import { redirect } from "next/navigation";
import { FeedbackTable } from "./_components/FeedbackTable";
import { FiltersPanel } from "./_components/FiltersPanel";
import { PaginationControls } from "./_components/PaginationControls";

async function FeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{
        key?: string;
        page?: string;
        limit?: string;
        type?: string;
        markAsRead?: string;
    }>;
}) {
    const { key, page, limit, type, markAsRead } = await searchParams;

    // Authenticate using SERVICE_SECRET
    if (key !== envvars.SERVICE_SECRET) {
        redirect("/");
    }

    const currentPage = parseInt(page || "1");
    const currentPageLimit = parseInt(limit || "10");

    const feedbackData: IGetFeedbackInput = {
        page: currentPage,
        limit: currentPageLimit,
        ...(type && { type: type as FeedbackTypesType }),
        ...(markAsRead && { markAsRead: markAsRead === "true" }),
    };

    const feedbacks = await getFeedback(feedbackData);

    return (
        <LayoutWrapper>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl">
                                Feedback Management
                            </CardTitle>
                            <CardDescription>
                                View and manage user feedback submissions
                            </CardDescription>
                        </div>
                        <div className="w-64">
                            <FiltersPanel />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {feedbacks.length > 0 ? (
                        <>
                            <FeedbackTable feedbacks={feedbacks} />
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
                </CardContent>
            </Card>
        </LayoutWrapper>
    );
}

export default FeedbackPage;
