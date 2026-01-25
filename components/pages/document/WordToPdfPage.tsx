"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import tools from "@/lib/tools";
import { downloadBuffer } from "@/lib/tools/helper";
import { useState } from "react";
import { toast } from "sonner";

export default function WordToPdfPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [doCompress, setDoCompress] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            const file = files ? files[0] : null;
            if (!file) {
                throw new Error("No file selected!");
            }

            const buffer = files
                ? new Uint8Array(await file.arrayBuffer())
                : null;
            if (!buffer) {
                throw new Error("Error getting buffer!");
            }

            const documentTools = await tools.document;
            const outputBuffer = await documentTools.wordToPdf({
                buffer,
                compress: doCompress,
            });
            if (!outputBuffer.data) {
                throw new Error("Something went wrong! While converting.");
            }

            const orgFileName = file.name.split(".")[0];
            const fileName = `${orgFileName}_word_to_pdf_blade_tools.pdf`;
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
        setDoCompress(false);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center gap-4 max-w-md w-full m-auto"
        >
            <FileUpload
                onFileSelect={setFiles}
                label=""
                name="inputfiles"
                accept=".doc,.docx"
                required
                helperText=""
                valueFiles={files}
            />

            <Button
                onClick={() => setDoCompress((p) => !p)}
                type="button"
                className="flex gap-2 justify-center items-center w-full"
                variant={"outline"}
                disabled={loading}
            >
                <span
                    className={`${doCompress ? "bg-red-500" : "bg-green-500"} w-2 h-2 rounded-full`}
                />
                Compress
            </Button>

            <div className="w-full grid grid-cols-2 items-center gap-2">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <LoadingSpinner className="size-4" />}
                    <span>Convert</span>
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
