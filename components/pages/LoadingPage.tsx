import { PiSpinnerGapThin } from "react-icons/pi";

export default function LoadingPage() {
    return (
        <div className="h-dvh max-w-7xl mx-auto fixed top-0 left-0 right-0 flex items-center justify-center">
            <PiSpinnerGapThin className="animate-spin size-6" />
        </div>
    );
}
