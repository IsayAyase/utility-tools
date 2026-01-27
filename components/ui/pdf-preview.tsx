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

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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

  return (
    <div className="w-full h-180 bg-muted/30 border rounded-lg overflow-hidden">
      {!url ? (
        <div className="flex items-center justify-center w-full h-full">
          {loading ? (
            <LoadingSpinner className="size-5" />
          ) : (
            <span className="text-muted-foreground text-sm">
              Nothing to preview.
            </span>
          )}
        </div>
      ) : isMobile ? (
        <div className="flex items-center justify-center w-full h-full px-4">
          <p className="text-sm text-muted-foreground text-center">
            PDF preview isn't supported on mobile browsers.
            <br />
            Use the download button to view the file.
          </p>
        </div>
      ) : (
        <embed
          src={url}
          type="application/pdf"
          className="w-full h-full thin-scroll-bar"
        />
      )}
    </div>
  );
}
