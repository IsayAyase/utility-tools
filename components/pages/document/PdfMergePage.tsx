import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PdfPreview from "@/components/ui/pdf-preview";
import { pdfMerge } from "@/lib/tools/document";
import {
    bufferToBlob,
    downloadBuffer,
    type ToolResult,
} from "@/lib/tools/helper";
import { useEffect, useState } from "react";
import { RiDraggable } from "react-icons/ri";
import { toast } from "sonner";

function reorder<T>(list: T[], from: number, to: number): T[] {
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

export default function PdfMergePage() {
    const [files, setFiles] = useState<FileList | null>(null);
    
    const [buffers, setBuffers] = useState<Uint8Array[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [pdfSrcs, setPdfSrcs] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [outputData, setOutputData] = useState<ToolResult<Uint8Array> | null>(
        null,
    );

    useEffect(() => {
        if (buffers.length === 0) {
            setPdfSrcs([]);
            return;
        }

        // only build once
        if (pdfSrcs.length > 0) return;

        const urls = buffers.map((buf) =>
            URL.createObjectURL(bufferToBlob(buf, "application/pdf")),
        );
        setPdfSrcs(urls);

        return () => {
            urls.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [buffers.length]);

    useEffect(() => {
        const run = async () => {
            if (buffers.length === 0) {
                setOutputData(null);
                return;
            }

            const outputBuffer = await pdfMerge({ buffers });
            if (!outputBuffer.data) {
                throw new Error("Something went wrong! While converting.");
            }

            setOutputData(outputBuffer);
        };

        run();
    }, [buffers]);

    async function handleFilesSelect(fs: FileList | null) {
        setFiles(fs);

        if (!fs || fs.length === 0) {
            setBuffers([]);
            setFileNames([]);
            return;
        }

        const bufs: Uint8Array[] = [];
        const names: string[] = [];
        for (let i = 0; i < fs.length; i++) {
            bufs.push(new Uint8Array(await fs[i].arrayBuffer()));
            names.push(fs[i].name);
        }

        setBuffers(bufs);
        setFileNames(names);
    }

    function onDragStart(index: number) {
        setDragIndex(index);
    }

    function onDrop(targetIndex: number) {
        if (dragIndex === null || dragIndex === targetIndex) {
            setDragIndex(null);
            return;
        }

        setBuffers((prev) => reorder(prev, dragIndex, targetIndex));
        setFileNames((prev) => reorder(prev, dragIndex, targetIndex));
        setPdfSrcs((prev) => reorder(prev, dragIndex, targetIndex));

        setDragIndex(null);
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!outputData || !outputData.data) {
                throw new Error("Something went wrong! While converting.");
            }

            const orgFileName = fileNames[0] || "document";
            const fileName = `${orgFileName}_merged_blade_tools.pdf`;
            downloadBuffer(outputData.data, fileName, "application/pdf");
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
        setBuffers([]);
        setFileNames([]);
        setPdfSrcs([]);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 items-start lg:gap-6 w-full"
        >
            {files && files.length > 0 ? (
                <div className="order-2 lg:order-1">
                    <PdfPreview
                        loading={loading}
                        buffer={outputData?.data || null}
                    />
                </div>
            ) : (
                <FileUpload
                    valueFiles={files}
                    onFileSelect={handleFilesSelect}
                    label=""
                    name="inputfiles"
                    accept=".pdf"
                    required
                    multiple
                    helperText=""
                    className="h-72 md:h-96 lg:h-120 xl:h-150"
                />
            )}

            <div className="flex flex-col justify-center items-center gap-4 w-full order-1 lg:order-2">
                {buffers.length > 0 && (
                    <div className="w-full max-h-100 overflow-auto mb-4 thin-scroll-bar">
                        <div className="grid grid-cols-3 gap-2">
                            {buffers.map((buf, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={() => onDragStart(idx)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => onDrop(idx)}
                                    className={`border rounded p-1 cursor-move ${dragIndex === idx ? "border-blue-500" : ""}`}
                                >
                                    {pdfSrcs[idx] ? (
                                        <embed
                                            src={pdfSrcs[idx]}
                                            type="application/pdf"
                                            className="w-full h-28 thin-scroll-bar"
                                        />
                                    ) : (
                                        <div className="h-28 w-full bg-secondary" />
                                    )}
                                    <div
                                        className="text-xs text-center mt-1 flex items-center gap-0.5"
                                        title={fileNames[idx]}
                                    >
                                        <RiDraggable className="size-3 shrink-0" />
                                        <span className="truncate">
                                            {fileNames[idx] || `Doc_${idx + 1}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
            </div>
        </form>
    );
}
