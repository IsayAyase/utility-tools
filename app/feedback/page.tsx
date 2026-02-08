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

import FeedbackPage from "./_components/FeedbackPage";

async function Page({
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
        markAsRead: markAsRead === "true",
        ...(type && { type: type as FeedbackTypesType }),
    };

    const feedbacks = await getFeedback(feedbackData);

    return (
        <LayoutWrapper>
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle className="text-xl md:text-3xl">
                            Feedback Management
                        </CardTitle>
                        <CardDescription>
                            View and manage user feedback submissions
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <FeedbackPage
                        feedbacks={JSON.parse(JSON.stringify(feedbacks))}
                    />
                </CardContent>
            </Card>
        </LayoutWrapper>
    );
}

export default Page;
