import LayoutWrapper from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addFeedback } from "@/lib/db/feedback/functions";
import { feedbackTypes, type FeedbackTypesType } from "@/lib/db/feedback/types";
import { redirect } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

async function submitFeedback(formData: FormData) {
    "use server";
    let status = "error";

    try {
        // Get form values
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const type = formData.get("type") as string;
        const message = formData.get("message") as string;

        console.log("Submitting feedback:", { name, email, type, message });
        
        await addFeedback({
            name,
            email,
            type: type as FeedbackTypesType,
            message,
        });
        
        console.log("Feedback submitted");
        status = "success";
    } catch (error) {
        console.error("Error submitting feedback:", error);
    }
    redirect(`/give-feedback?status=${status}`);
}

export default async function FeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;

    let statusMessage = null;
    if (status === "success") {
        statusMessage = (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-300 border rounded-lg">
                <div className="flex items-center gap-4">
                    <FaCheck className="size-6 shrink-0" />
                    <div>
                        <h3 className="font-semibold">Thank You!</h3>
                        <p className="text-sm">
                            Your feedback has been submitted successfully. We
                            appreciate your input!
                        </p>
                    </div>
                </div>
            </div>
        );
    } else if (status === "error") {
        statusMessage = (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border rounded-lg">
                <div className="flex items-center gap-4">
                    <IoClose className="size-6 shrink-0" />
                    <div>
                        <h3 className="font-semibold">Error</h3>
                        <p className="text-sm">
                            Something went wrong. Please try again later.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <LayoutWrapper>
            <main className="max-w-md mx-auto p-6">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                            Feedback
                        </h1>
                        <p className="text-muted-foreground">
                            We'd love to hear from you. Share your thoughts and
                            help us improve.
                        </p>
                    </div>

                    {statusMessage}

                    <form action={submitFeedback} className="space-y-4">
                        <Field label="Name" htmlFor="name">
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                required
                                minLength={2}
                                maxLength={50}
                            />
                        </Field>

                        <Field label="Email" htmlFor="email">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your.email@example.com"
                                required
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                minLength={5}
                                maxLength={50}
                            />
                        </Field>

                        <Field label="Type" htmlFor="type">
                            <Select name="type" required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select feedback type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {feedbackTypes.map((type) => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                            className="capitalize"
                                        >
                                            {type.replace("-", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Message" htmlFor="message">
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Tell us what's on your mind..."
                                rows={5}
                                required
                                minLength={10}
                                maxLength={1000}
                            />
                        </Field>

                        <Button type="submit" className="w-full mt-6">
                            Submit Feedback
                        </Button>
                    </form>
                </div>
            </main>
        </LayoutWrapper>
    );
}
