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
    const displayedProgress = useRef(0);
    const rafId = useRef<number | null>(null);

    // Load FFmpeg
    useEffect(() => {
        if (!isLoaded) loadFFmpeg();
    }, [isLoaded, loadFFmpeg]);

    // progress toast
    useEffect(() => {
        if (!isProcessing)
            return () => {
                if (toastId.current) toast.dismiss(toastId.current);
                if (rafId.current) cancelAnimationFrame(rafId.current);
            };

        const animate = () => {
            const target = loadingProgress;
            displayedProgress.current +=
                (target - displayedProgress.current) * 0.15;

            const value = Math.min(100, Math.round(displayedProgress.current));
            toastId.current = toast.loading(
                `${isLoading ? "Loading ffmpeg" : "Processing"} ${value}%`,
                {
                    id: toastId.current || undefined,
                    description: processingMessage,
                },
            );

            // Keep animating until close enough
            if (Math.abs(target - displayedProgress.current) > 0.1) {
                rafId.current = requestAnimationFrame(animate);
            } else {
                if (rafId.current) cancelAnimationFrame(rafId.current);
            }
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [loadingProgress, isLoading]);

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

        function handleProgress({ progress }: { progress: number }) {
            // Map FFmpeg progress (0-1) to our loading progress (1-99)
            const mappedProgress = 1 + progress * 98;
            setLoadingProgress(mappedProgress);
            setProcessing(!(progress > 0.9 || progress === 0));
        }

        instance.on("log", handleLog);
        instance.on("progress", handleProgress);

        return () => {
            instance.off("log", handleLog);
            instance.off("progress", handleProgress);
        };
    }, [instance]);

    return null;
}
