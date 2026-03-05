"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PdfPreview from "@/components/ui/pdf-preview";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPdfInfo, pdfSplit } from "@/lib/tools/document";
import { downloadBuffer } from "@/lib/tools/helper";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Parses MS Word–style page range input into a unique, sorted page array
 */
function parsePageRanges(inputStr: string, totalPages?: number): number[] {
    const input = inputStr || `1-${totalPages}`;
    if (!input.trim()) {
        throw new Error("Page selection is empty");
    }

    const pages = new Set<number>();
    const parts = input.split(",");

    for (const rawPart of parts) {
        const part = rawPart.trim();

        // Range (e.g. 2-5, -3, 8-)
        if (part.includes("-")) {
            const [startRaw, endRaw] = part.split("-").map((s) => s.trim());

            const start = startRaw === "" ? 1 : Number(startRaw);
            const end =
                endRaw === ""
                    ? (totalPages ?? Number.POSITIVE_INFINITY)
                    : Number(endRaw);

            if (
                Number.isNaN(start) ||
                Number.isNaN(end) ||
                start <= 0 ||
                end <= 0
            ) {
                throw new Error(`Invalid range: "${part}"`);
            }

            if (start > end) {
                throw new Error(`Invalid range order: "${part}"`);
            }

            for (let i = start; i <= end; i++) {
                pages.add(i);
            }
        }
        // Single page (e.g. 1)
        else {
            const page = Number(part);

            if (Number.isNaN(page) || page <= 0) {
                throw new Error(`Invalid page number: "${part}"`);
            }

            pages.add(page);
        }
    }

    return Array.from(pages).sort((a, b) => a - b);
}

export default function PdfSplitPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [selectPages, setSelectPages] = useState("");
    const [outputBuffer, setOutputBuffer] = useState<Uint8Array | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!files) return;

        const timer = setTimeout(() => {
            const ops = async () => {
                setLoading(true);
                try {
                    const file = files[0];
                    if (!file) return;

                    const buffer = new Uint8Array(await file.arrayBuffer());

                    const pdfInfo = await getPdfInfo({
                        buffer,
                    });

                    if (!pdfInfo.data) {
                        throw new Error(
                            "Something went wrong! While generating.",
                        );
                    }

                    const pages = parsePageRanges(
                        selectPages,
                        pdfInfo.data.file.pageCount,
                    );

                    const outputBuffer = await pdfSplit({
                        buffer,
                        pages,
                    });

                    if (!outputBuffer.data) {
                        throw new Error(
                            "Something went wrong! While generating.",
                        );
                    }

                    setOutputBuffer(outputBuffer.data);
                } catch (e) {
                    toast.error(
                        e instanceof Error
                            ? e.message
                            : "Something went wrong!",
                    );
                } finally {
                    setLoading(false);
                }
            };

            ops();
        }, 1000);

        return () => clearTimeout(timer);
    }, [files, selectPages]);

    async function handleButtonClick() {
        setLoading(true);
        try {
            const file = files ? files[0] : null;
            if (!file) {
                throw new Error("No file selected!");
            }

            if (!outputBuffer) {
                throw new Error("Error getting buffer!");
            }

            const orgFileName = file.name.split(".")[0];
            const fileName = `${orgFileName}_split_blade_tools.pdf`;
            downloadBuffer(outputBuffer, fileName, "application/pdf");
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
        setSelectPages("");
        setOutputBuffer(null);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 items-start lg:gap-6 w-full">
            {files && files.length > 0 ? (
                <div className="order-2 lg:order-1">
                    <PdfPreview
                        loading={loading}
                        buffer={outputBuffer || null}
                    />
                </div>
            ) : (
                <FileUpload
                    onFileSelect={setFiles}
                    valueFiles={files}
                    label=""
                    name="inputfiles"
                    accept=".pdf"
                    required
                    helperText=""
                    className="h-72 md:h-96 lg:h-120 xl:h-150"
                />
            )}

            <div className="flex flex-col justify-center items-center gap-4 w-full order-1 lg:order-2">
                <div className="flex items-end gap-2 w-full">
                    <Field
                        htmlFor="pages"
                        label="Select pages"
                        className="w-full"
                    >
                        <Input
                            onChange={(e) => setSelectPages(e.target.value)}
                            value={selectPages}
                            type="text"
                            placeholder="1, 2-5, 8"
                        />
                    </Field>
                    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                        <TooltipTrigger
                            onClick={() => setTooltipOpen((p) => !p)}
                            className="border p-2.5 rounded-md"
                        >
                            <Info className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Enter pages like 1, 3-5, 8. <br />
                                Use -3 for pages 1-3 and 8- for pages 8 to last.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button
                        onClick={handleButtonClick}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading && <LoadingSpinner className="size-4" />}
                        <span>Split</span>
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={handleClear}
                        disabled={loading}
                        className="w-full"
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
}
