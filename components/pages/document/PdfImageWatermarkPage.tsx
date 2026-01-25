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
import type { PdfAddImageWatermarkInput } from "@/lib/tools/document/type";
import { downloadBuffer } from "@/lib/tools/helper";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const init: PdfAddImageWatermarkInput = {
    buffer: null,
    watermarkBuffer: null,
    scale: 0.5,
    opacity: 0.3,
    position: "center",
    rotation: 0,
};

export default function PdfImageWatermarkPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [fields, setFields] = useState(init);
    const [orgFileName, setOrgFileName] = useState<string | null>(null);
    const [outputBuffer, setOutputBuffer] = useState<Uint8Array | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!fields.buffer || !fields.watermarkBuffer) return;

        let cancelled = false; // Add cancellation flag

        const timer = setTimeout(() => {
            const ops = async () => {
                if (cancelled) return;

                setLoading(true);

                try {
                    const documentTools = await tools.document;
                    const outputBuffer =
                        await documentTools.pdfAddImageWatermark({
                            ...fields,
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

        return () => {
            clearTimeout(timer);
            cancelled = true;
        };
    }, [fields]);

    async function handleFileChange(fl: FileList | null) {
        if (!fl) return;

        setFiles(fl);
        const file = fl[0];
        if (!file) return;

        setOrgFileName(file.name.split(".")[0]);

        const buffer = new Uint8Array(await file.arrayBuffer());
        setFields({ ...fields, buffer });
    }

    async function handleImageChange(fl: FileList | null) {
        if (!fl) return;

        setImageFiles(fl);
        const file = fl[0];
        if (!file) return;

        const buffer = new Uint8Array(await file.arrayBuffer());
        setFields({ ...fields, watermarkBuffer: buffer });
    }

    function handleFieldChange(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | { name: string; value: string },
    ) {
        const { name, value } = "name" in e ? e : e.target;
        if (name === "scale" || name === "opacity" || name === "rotation") {
            const val = Number(value) || init[name];
            setFields({
                ...fields,
                [name]: val,
            });
        } else {
            setFields({ ...fields, [name]: value });
        }
    }

    async function handleDownloadBtn() {
        setLoading(true);
        try {
            if (!fields.buffer) {
                throw new Error("No file selected!");
            }

            if (!outputBuffer) {
                throw new Error("Error getting buffer!");
            }

            const fileName = `${orgFileName}_image_watermark_blade_tools.pdf`;
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

    function handleClearBtn() {
        setFiles(null);
        setImageFiles(null);
        setFields(init);
        setOrgFileName(null);
        setOutputBuffer(null);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start lg:gap-6 w-full">
            {files && files.length > 0 ? (
                <div className="order-2 lg:order-1">
                    <PdfPreview
                        loading={loading}
                        buffer={outputBuffer || null}
                    />
                </div>
            ) : (
                <FileUpload
                    onFileSelect={handleFileChange}
                    valueFiles={files}
                    label="Pdf File"
                    name="inputfiles"
                    accept=".pdf"
                    required
                    helperText=""
                    className="h-72 md:h-96 lg:h-120 xl:h-150"
                />
            )}

            <div className="flex flex-col justify-center items-center gap-4 w-full order-1 lg:order-2">
                <FileUpload
                    onFileSelect={handleImageChange}
                    valueFiles={imageFiles}
                    label="Image Watermark"
                    name="inputfiles"
                    accept="image/*"
                    required
                    helperText=""
                />

                <div className="w-full border rounded-lg p-4 space-y-4">
                    <div className="w-full grid grid-cols-2 items-center gap-2">
                        <Field
                            htmlFor="position"
                            label="Position"
                            className="w-full"
                        >
                            <Select
                                name="position"
                                value={fields.position}
                                onValueChange={(value) =>
                                    handleFieldChange({
                                        name: "position",
                                        value,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Position" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="top-left">
                                        Top Left
                                    </SelectItem>
                                    <SelectItem value="top-right">
                                        Top Right
                                    </SelectItem>
                                    <SelectItem value="bottom-left">
                                        Bottom Left
                                    </SelectItem>
                                    <SelectItem value="bottom-right">
                                        Bottom Right
                                    </SelectItem>
                                    <SelectItem value="center">
                                        Center
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field htmlFor="scale" label="Scale">
                            <Input
                                name="scale"
                                value={fields.scale}
                                onChange={handleFieldChange}
                                placeholder="Scale"
                                type="number"
                                step={"0.1"}
                            />
                        </Field>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 items-center gap-2">
                        <Field htmlFor="opacity" label="Opacity">
                            <Input
                                name="opacity"
                                value={fields.opacity}
                                onChange={handleFieldChange}
                                placeholder="Opacity"
                                type="number"
                                step="0.1"
                            />
                        </Field>

                        <Field htmlFor="rotation" label="Rotation">
                            <Input
                                name="rotation"
                                value={fields.rotation}
                                onChange={handleFieldChange}
                                placeholder="Rotation"
                                type="number"
                            />
                        </Field>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button
                        onClick={handleDownloadBtn}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading && <LoadingSpinner className="size-4" />}
                        <span>Download</span>
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={handleClearBtn}
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
