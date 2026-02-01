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
import { pdfAddTextWatermark } from "@/lib/tools/document";
import type { PdfAddTextWatermarkInput } from "@/lib/tools/document/type";
import { downloadBuffer } from "@/lib/tools/helper";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const init: PdfAddTextWatermarkInput = {
    buffer: null,
    text: "Blade Tools",
    fontSize: 40,
    color: "#000000",
    opacity: 0.5,
    position: "center",
    rotation: 0,
};

export default function PdfTextWaterMarkPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [fields, setFields] = useState(init);
    const [orgFileName, setOrgFileName] = useState<string | null>(null);
    const [outputBuffer, setOutputBuffer] = useState<Uint8Array | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!fields.buffer) return;

        const timer = setTimeout(() => {
            const ops = async () => {
                setLoading(true);
                try {
                    const outputBuffer = await pdfAddTextWatermark({
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

        return () => clearTimeout(timer);
    }, [fields]);

    async function handleFileChange(filelist: FileList | null) {
        if (!filelist) return;

        setFiles(filelist);
        const file = filelist[0];
        if (!file) return;

        setOrgFileName(file.name.split(".")[0]);

        const buffer = new Uint8Array(await file.arrayBuffer());
        setFields({ ...fields, buffer });
    }

    function handleFieldChange(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | { name: string; value: string },
    ) {
        const { name, value } = "name" in e ? e : e.target;
        if (name === "fontSize" || name === "opacity" || name === "rotation") {
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

            const fileName = `${orgFileName}_text_watermark_blade_tools.pdf`;
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
        setFields(init);
        setOrgFileName(null);
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
                    onFileSelect={handleFileChange}
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
                <div className="w-full border rounded-lg p-4 space-y-4">
                    <div className="w-full grid grid-cols-2 items-center gap-2">
                        <Field htmlFor="text" label="Text">
                            <Input
                                name="text"
                                value={fields.text}
                                onChange={handleFieldChange}
                                placeholder="Text"
                            />
                        </Field>

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
                                    <SelectItem value="top-center">
                                        Top Center
                                    </SelectItem>
                                    <SelectItem value="top-right">
                                        Top Right
                                    </SelectItem>
                                    <SelectItem value="center-left">
                                        Center Left
                                    </SelectItem>
                                    <SelectItem value="center">
                                        Center
                                    </SelectItem>
                                    <SelectItem value="center-right">
                                        Center Right
                                    </SelectItem>
                                    <SelectItem value="bottom-left">
                                        Bottom Left
                                    </SelectItem>
                                    <SelectItem value="bottom-center">
                                        Bottom Center
                                    </SelectItem>
                                    <SelectItem value="bottom-right">
                                        Bottom Right
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="w-full grid grid-cols-2 items-center gap-2">
                        <Field htmlFor="fontSize" label="Font Size">
                            <Input
                                name="fontSize"
                                value={fields.fontSize}
                                onChange={handleFieldChange}
                                placeholder="Font Size"
                                type="number"
                            />
                        </Field>

                        <Field htmlFor="color" label="Color">
                            <Input
                                name="color"
                                value={fields.color}
                                onChange={handleFieldChange}
                                placeholder="Color"
                                type="color"
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
