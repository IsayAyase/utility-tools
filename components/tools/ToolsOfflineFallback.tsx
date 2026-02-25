"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect } from "react";

export default function OfflineToolFallback({
    onRetry,
}: {
    onRetry: () => void;
}) {
    const isOnline = useOnlineStatus();

    useEffect(() => {
        if (isOnline) {
            onRetry();
        }
    }, [isOnline, onRetry]);

    return (
        <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold">You're offline</h2>
            <p className="text-muted-foreground">
                This tool requires internet to load.
            </p>
            <p className="text-sm text-muted-foreground">
                Waiting for connection...
            </p>
        </div>
    );
}
