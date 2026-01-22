import { PiSpinnerGapThin } from "react-icons/pi";

export default function LoadingPage() {
    return (
        <div className="h-full max-w-7xl mx-auto z-50 absolute top-0 left-0 right-0 flex items-center justify-center">
            <PiSpinnerGapThin className="animate-spin size-6" />
        </div>
    );
}
