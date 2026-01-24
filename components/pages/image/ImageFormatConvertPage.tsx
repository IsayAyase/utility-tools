"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import tools from "@/lib/tools";
import {
    bytesToSize,
    downloadBuffer,
    type ToolResult,
} from "@/lib/tools/helper";
import { imageFormatConvertList } from "@/lib/tools/image";
import { type ImageFormatConvertInput } from "@/lib/tools/image/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const init: ImageFormatConvertInput = {
    buffer: null,
    format: "jpeg",
    quality: 90,
    icoSize: 32,
};

export default function ImageFormatConvertPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [field, setField] = useState<ImageFormatConvertInput>(init);
    const [orgFileName, setOrgFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<ToolResult<Uint8Array> | null>(
        null,
    );

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!outputData?.data) {
                throw new Error("No file selected!");
            }

            const fileName = `${orgFileName}_image_convert_blade_tools.${field.format}`;
            downloadBuffer(outputData.data, fileName, `image/${field.format}`);
            toast.success("Successfully converted!");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Something went wrong!",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!field.buffer) return;

        const timer = setTimeout(() => {
            const ops = async () => {
                setLoading(true);
                try {
                    const imageTools = await tools.image;
                    const outputBuffer = await imageTools.imageFormatConvert({
                        ...field,
                    });
                    if (!outputBuffer.data) {
                        throw new Error(
                            "Something went wrong! While generating.",
                        );
                    }

                    setOutputData(outputBuffer);
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
    }, [field]);

    async function handleFileSelect(files: FileList | null) {
        if (!files) return;

        setFiles(files);
        setOrgFileName(files[0].name.split(".")[0]);

        const buffer = new Uint8Array(await files[0].arrayBuffer());
        setField((prev) => ({
            ...prev,
            buffer,
        }));
    }

    function handleClear() {
        setFiles(null);
        setField(init);
        setOrgFileName(null);
        setOutputData(null);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center gap-4 max-w-md w-full m-auto"
        >
            <FileUpload
                onFileSelect={handleFileSelect}
                label=""
                name="inputfiles"
                accept="image/*"
                required
                helperText=""
                valueFiles={files}
            />

            <div
                className={`w-full grid ${field.format === "ico" ? "grid-cols-2" : "grid-cols-1"} gap-4`}
            >
                <Field htmlFor="format" label="Format" className="w-full">
                    <Select
                        name="format"
                        value={field.format}
                        onValueChange={(value) =>
                            setField((prev) => ({
                                ...prev,
                                format: value as typeof prev.format,
                                quality:
                                    value === "png" || value === "ico"
                                        ? 100
                                        : prev.quality,
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            {imageFormatConvertList.map((format: string) => (
                                <SelectItem key={format} value={format}>
                                    {format}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                {field.format === "ico" && (
                    <Field
                        htmlFor="icoSize"
                        label="Icon size"
                        rightLabel={`${field.icoSize} px`}
                    >
                        <Input
                            name="icoSize"
                            type="number"
                            value={field.icoSize}
                            onChange={(e) =>
                                setField((prev) => ({
                                    ...prev,
                                    icoSize: parseInt(e.target.value, 10),
                                }))
                            }
                            min={1}
                        />
                    </Field>
                )}
            </div>

            {(field.format === "jpeg" || field.format === "webp") && (
                <Field
                    htmlFor="quality"
                    label="Quality"
                    rightLabel={`${field.quality}%`}
                    className="w-full"
                >
                    <Slider
                        value={[field.quality || 10]}
                        onValueChange={(val) =>
                            setField((prev) => ({ ...prev, quality: val[0] }))
                        }
                        min={10}
                        max={100}
                        step={1}
                        className="mb-2"
                    />
                </Field>
            )}

            <div className="w-full grid grid-cols-2 items-center gap-2">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <LoadingSpinner className="size-4" />}
                    <span>Convert</span>
                    {outputData && (
                        <span className="italic text-xs">
                            ({bytesToSize(outputData.metadata?.newSize || 0)})
                        </span>
                    )}
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
