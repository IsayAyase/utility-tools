import LoadingSpinner from "../ui/LoadingSpinner";

export default function LoadingPage() {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <LoadingSpinner className="size-5" />
        </div>
    );
}
