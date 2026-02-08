"use client";

import { bufferToBlob } from "@/lib/tools/helper";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type PdfPreviewProps = {
    buffer: Uint8Array | null;
    loading?: boolean;
};

export default function PdfPreview({
    buffer,
    loading = false,
}: PdfPreviewProps) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!buffer) {
            setUrl(null);
            return;
        }

        const blob = bufferToBlob(buffer, "application/pdf");
        const blobUrl = URL.createObjectURL(blob);
        setUrl(blobUrl);

        return () => {
            URL.revokeObjectURL(blobUrl);
        };
    }, [buffer]);

    if (!url) {
        return (
            <div className="flex items-center justify-center w-full h-180 bg-muted/30 border rounded-lg">
                {loading ? (
                    <LoadingSpinner className="size-5" />
                ) : (
                    <span className="text-muted-foreground text-sm">
                        Nothing to preview.
                    </span>
                )}
            </div>
        );
    }

    // Use PDF.js viewer - works on all platforms including mobile
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}`;

    return (
        <div className="w-full h-180 bg-muted/30 border rounded-lg overflow-hidden">
            <iframe
                src={viewerUrl}
                className="w-full h-full"
                title="PDF Preview"
            />
        </div>
    );
}
