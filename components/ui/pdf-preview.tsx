import { bufferToBlob } from "@/lib/tools/helper";

export default function PdfPreview({ buffer }: { buffer: Uint8Array | null }) {
    const url = buffer
        ? URL.createObjectURL(bufferToBlob(buffer, "application/pdf"))
        : "";
    return !url ? (
        <div className="flex items-center justify-center w-full md:w-2/3 h-100 mx-auto bg-muted/30 border rounded-lg">
            <span className="text-muted-foreground text-sm">
                Nothing to preview.
            </span>
        </div>
    ) : (
        <div className="w-full h-100 lg:h-200 bg-muted/30 border rounded-lg">
            <h4 className="font-semibold text-lg lg:text-xl w-full text-center my-4">
                PDF Preview
            </h4>
            <iframe
                src={url}
                className="w-full h-[calc(100%-24px)] rounded-lg"
            />
        </div>
    );
}
