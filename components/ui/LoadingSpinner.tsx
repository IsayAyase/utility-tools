import { cn } from "@/lib/utils";
import { CgSpinner } from "react-icons/cg";

export default function LoadingSpinner({ className }: { className?: string }) {
    return <CgSpinner className={cn("animate-spin size-5", className)} />;
}
