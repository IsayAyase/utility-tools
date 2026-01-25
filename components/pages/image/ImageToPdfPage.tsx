"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PdfPreview from "@/components/ui/pdf-preview";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import tools from "@/lib/tools";
import { downloadBuffer, type ToolResult } from "@/lib/tools/helper";
import { imageFitList, pageSizeList } from "@/lib/tools/image";
import type { ImageToPdfInput } from "@/lib/tools/image/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const init: ImageToPdfInput = {
    buffers: [],
    compress: false,
    fit: "contain",
    margin: 20,
    pageSize: "A4",
};

export default function ImageToPdfPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [fields, setFields] = useState<ImageToPdfInput>(init);
    const [loading, setLoading] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<ToolResult<Uint8Array> | null>(
        null,
    );

    useEffect(() => {
        if (fields.buffers.length === 0) return;

        const timer = setTimeout(() => {
            const ops = async () => {
                setLoading(true);
                try {
                    const imageTools = await tools.image;
                    const output = await imageTools.imageToPdf({
                        ...fields,
                    });
                    if (!output.data) {
                        throw new Error(
                            "Something went wrong! While generating.",
                        );
                    }

                    setOutputData(output);
                } catch (e) {
                    console.log(e);

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
    }, [
        fields.buffers,
        fields.compress,
        fields.pageSize,
        fields.fit,
        fields.margin,
    ]);

    async function handleFileSelect(fs: FileList | null) {
        setFiles(fs);

        if (!fs || (fs && fs.length === 0)) {
            return;
        }

        const buffers = [];
        for (let i = 0; i < fs.length; i++) {
            const buffer = new Uint8Array(await fs[i].arrayBuffer());
            buffers.push(buffer);
        }
        if (!buffers) {
            throw new Error("Error getting buffer!");
        }

        setFields({
            ...fields,
            buffers,
        });
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!outputData?.data) {
                throw new Error("Something went wrong! While converting.");
            }

            const fileName = `${new Date().getTime()}_images_to_pdf_blade_tools.pdf`;
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
        setFields(init);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 items-start lg:gap-6 w-full"
        >
            {files && files.length > 0 ? (
                <div className="order-2 lg:order-1">
                <PdfPreview loading={loading} buffer={outputData?.data || null} />
                </div>
            ) : (
                <FileUpload
                    onFileSelect={handleFileSelect}
                    label=""
                    name="inputfiles"
                    accept="image/*"
                    required
                    helperText=""
                    valueFiles={files}
                    multiple
                    className="h-72 md:h-96 lg:h-120 xl:h-150"
                />
            )}

            <div className="flex flex-col justify-center items-center gap-4 w-full order-1 lg:order-2">
                <div className={`w-full grid grid-cols-2 gap-4`}>
                    <Field htmlFor="fit" label="Fit" className="w-full">
                        <Select
                            name="fit"
                            value={fields.fit}
                            onValueChange={(value) =>
                                setFields((prev) => ({
                                    ...prev,
                                    fit: value as typeof prev.fit,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select fit" />
                            </SelectTrigger>
                            <SelectContent>
                                {imageFitList.map((fit: string) => (
                                    <SelectItem key={fit} value={fit}>
                                        {fit}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field
                        htmlFor="pageSize"
                        label="Page size"
                        className="w-full"
                    >
                        <Select
                            name="pageSize"
                            value={fields.pageSize}
                            onValueChange={(value) =>
                                setFields((prev) => ({
                                    ...prev,
                                    pageSize: value as typeof prev.pageSize,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select page size" />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeList.map((pageSize: string) => (
                                    <SelectItem key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                <div className={`w-full grid grid-cols-2 gap-4`}>
                    <Field
                        htmlFor="margin"
                        label="Margin"
                        rightLabel={`${fields.margin} px`}
                    >
                        <Input
                            name="margin"
                            type="number"
                            value={fields.margin}
                            onChange={(e) => {
                                const newmargin = parseInt(e.target.value, 10);
                                setFields((prev) => ({
                                    ...prev,
                                    margin: newmargin,
                                }));
                            }}
                            min={1}
                        />
                    </Field>
                    <Field htmlFor="compress" label="Compress">
                        <Button
                            name="compress"
                            onClick={() =>
                                setFields((p) => ({
                                    ...p,
                                    compress: !p.compress,
                                }))
                            }
                            type="button"
                            className="flex gap-2 justify-start items-center w-full"
                            variant={"outline"}
                            disabled={loading}
                        >
                            <span
                                className={`${!fields.compress ? "bg-red-500" : "bg-green-500"} w-2 h-2 rounded-full`}
                            />
                            {fields.compress ? "Yes" : "No"}
                        </Button>
                    </Field>
                </div>

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
            </div>
        </form>
    );
}
