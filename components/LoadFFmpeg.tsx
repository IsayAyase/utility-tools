"use client";

import { useFFmpegStore } from "@/store/ffmpeg";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LoadFFmpeg() {
    const {
        instance,
        loadFFmpeg,
        loadingProgress,
        isLoaded,
        isLoading,
        isProcessing,
        error,
        setLoadingProgress,
        setProcessing,
        processingMessage,
        setProcessingMessage,
    } = useFFmpegStore((state) => state);

    const toastId = useRef<string | number | null>(null);

    // Load FFmpeg
    useEffect(() => {
        if (!isLoaded) loadFFmpeg();
    }, [isLoaded, loadFFmpeg]);

    // progress toast
    useEffect(() => {
        if (!isProcessing) {
            // Clean up when processing stops
            if (toastId.current) {
                toast.dismiss(toastId.current);
                toastId.current = null;
            }
            return;
        }

        const value = Math.min(100, loadingProgress);
        
        toastId.current = toast.loading(
            `${isLoading ? "Loading ffmpeg" : "Processing"} ${value.toFixed(0)}%`,
            {
                id: toastId.current || undefined,
                description: processingMessage,
            },
        );
    }, [loadingProgress, isLoading, isProcessing, processingMessage]);
    
    useEffect(() => {
        if (isLoaded && toastId.current) {
            toast.success("Successfully loaded ffmpeg!", {
                id: toastId.current,
            });
            toastId.current = null;
        }
    }, [isLoaded]);

    useEffect(() => {
        if (error) {
            toast.error(error, { id: toastId.current || undefined });
            toastId.current = null;
        }
    }, [error]);

    // events
    useEffect(() => {
        if (!instance) return;

        function handleLog({ message }: { message: string }) {
            const msg = `[FFmpeg]: ${message}`;
            console.log(msg);
            setProcessingMessage(msg);
        }

        function handleProgress({ progress, time }: { progress: number, time: number }) {
            const mappedProgress = progress * 100;
            setLoadingProgress(mappedProgress);
            setProcessing(!(progress > 0.99 || progress === 0));
        }

        instance.on("log", handleLog);
        instance.on("progress", handleProgress);

        return () => {
            instance.off("log", handleLog);
            instance.off("progress", handleProgress);
        };
    }, [instance, setLoadingProgress, setProcessing, setProcessingMessage]);

    return null;
}
