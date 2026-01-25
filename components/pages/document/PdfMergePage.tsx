import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import tools from "@/lib/tools";
import { downloadBuffer } from "@/lib/tools/helper";
import { useState } from "react";
import { toast } from "sonner";

export default function PdfMergePage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            if (!files) {
                throw new Error("No file selected!");
            }

            const buffers = [];
            for (let i = 0; i < files.length; i++) {
                const buffer = new Uint8Array(await files[i].arrayBuffer());
                buffers.push(buffer);
            }
            if (!buffers) {
                throw new Error("Error getting buffer!");
            }

            const documentTools = await tools.document;
            const outputBuffer = await documentTools.pdfMerge({
                buffers,
            });
            if (!outputBuffer.data) {
                throw new Error("Something went wrong! While converting.");
            }

            const orgFileName = files[0].name.split(".")[0];
            const fileName = `${orgFileName}_merged_blade_tools.pdf`;
            downloadBuffer(outputBuffer.data, fileName, "application/pdf");
            toast.success("Successfully converted!");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Something went wrong!",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClear() {
        setFiles(null);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center gap-4 max-w-md w-full m-auto"
        >
            {/* <Input onChange={(e) => setFiles(e.target.files)} type="file" /> */}
            <FileUpload
                valueFiles={files}
                onFileSelect={setFiles}
                label=""
                name="inputfiles"
                accept=".pdf"
                required
                multiple
                helperText=""
            />

            <div className="w-full grid grid-cols-2 items-center gap-2">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <LoadingSpinner className="size-4" />}
                    <span>Merge</span>
                </Button>
                <Button
                    type="button"
                    variant={"outline"}
                    onClick={handleClear}
                    disabled={loading}
                    className="w-full"
                >
                    Clear
                </Button>
            </div>
        </form>
    );
}
