import { bufferToBlob } from "@/lib/tools/helper";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";

export default function ImagePreview({
    buffer,
    loading = false,
}: {
    buffer?: Uint8Array | null;
    loading?: boolean;
}) {
    const url = buffer
        ? URL.createObjectURL(bufferToBlob(buffer, "image/*"))
        : "";
    return (
        <div className="flex justify-center items-center w-full h-72 md:h-96 lg:h-120 xl:h-150 bg-muted/30 border rounded-lg overflow-hidden">
            {url ? (
                <Image alt="Preview" src={url} className="w-full h-full object-contain" />
            ) : (
                <>
                    {loading ? (
                        <LoadingSpinner className="size-5" />
                    ) : (
                        <span className="text-muted-foreground text-sm">
                            Nothing to preview.
                        </span>
                    )}
                </>
            )}
        </div>
    );
}
