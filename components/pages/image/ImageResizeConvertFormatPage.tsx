"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import ImagePreview from "@/components/ui/image-preview";
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
import { imageFitList, imageFormatConvertList } from "@/lib/tools/image";
import { type ImageConvertResizeReduceInput } from "@/lib/tools/image/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const init: ImageConvertResizeReduceInput = {
    buffer: null,
    format: "jpeg",
    quality: 90,
    fit: "cover",
    maintainAspectRatio: true,
    background: "#000000",
    width: 0,
    height: 0,
    maxSizeMB: 4.0,
    // maxWidthOrHeight: 0,
};

export default function ImageResizeConvertFormatPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [field, setField] = useState<ImageConvertResizeReduceInput>(init);
    const [orgFileData, setOrgFileData] = useState<{
        name: string;
        format: string;
        size: number;
        type: string;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<ToolResult<Uint8Array> | null>(
        null,
    );
    const [userDimensions, setUserDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!outputData?.data) {
                throw new Error("No file selected!");
            }

            const fileName = `${orgFileData?.name}_image_convert_blade_tools.${field.format}`;
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
                    const outputBuffer =
                        await imageTools.imageConvertResizeReduce({
                            ...field,
                        });
                    if (!outputBuffer.data) {
                        throw new Error(
                            "Something went wrong! While generating.",
                        );
                    }

                    setOutputData(outputBuffer);
                    if (!userDimensions || field.maintainAspectRatio) {
                        setField((p) => ({
                            ...p,
                            width: outputBuffer?.metadata?.width || p.width,
                            height: outputBuffer?.metadata?.height || p.height,
                        }));
                    }
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
        field.buffer,
        field.format,
        field.quality,
        field.fit,
        field.maintainAspectRatio,
        field.background,
        field.width,
        field.height,
        field.maxSizeMB,
        userDimensions,
    ]);

    async function handleFileSelect(files: FileList | null) {
        setFiles(files);

        const file = files?.[0];
        if (!file) return;

        const fileNameSplit = file.name.split(".");
        const fileName = fileNameSplit[0];
        const format = fileNameSplit.pop();

        setOrgFileData({
            name: fileName,
            format: format || "",
            size: file.size,
            type: file.type,
        });

        const buffer = new Uint8Array(await file.arrayBuffer());
        const imageTools = await tools.image;
        const imageLoaded = await imageTools.loadImage(buffer);

        setField((prev) => ({
            ...prev,
            buffer,
            width: imageLoaded.width,
            height: imageLoaded.height,
        }));
    }

    function handleClear() {
        setFiles(null);
        setField(init);
        setOrgFileData(null);
        setOutputData(null);
        setUserDimensions(null);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start lg:gap-6 w-full"
        >
            {files && files.length > 0 ? (
                <ImagePreview loading={loading} buffer={outputData?.data} />
            ) : (
                <FileUpload
                    onFileSelect={handleFileSelect}
                    label=""
                    name="inputfiles"
                    accept="image/*"
                    required
                    helperText=""
                    valueFiles={files}
                    className="h-72 md:h-96 lg:h-120 xl:h-150"
                />
            )}

            <div className="flex flex-col justify-center items-center gap-4 w-full">
                <div className="w-full border rounded-lg p-4 space-y-4">
                    <div className={`w-full grid grid-cols-1 gap-4`}>
                        <Field
                            htmlFor="format"
                            label="Format"
                            rightLabel={
                                orgFileData
                                    ? `${orgFileData.format || "?"} -> ${outputData?.metadata?.format || "?"}`
                                    : ""
                            }
                            className="w-full"
                        >
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
                                    {imageFormatConvertList.map(
                                        (format: string) => (
                                            <SelectItem
                                                key={format}
                                                value={format}
                                            >
                                                {format}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    {/* width, height */}
                    <div className={`w-full grid grid-cols-2 gap-4`}>
                        <Field
                            htmlFor="width"
                            label="Width"
                            rightLabel={`${field.width} px`}
                        >
                            <Input
                                name="width"
                                type="number"
                                value={field.width}
                                onChange={(e) => {
                                    const newWidth = parseInt(
                                        e.target.value,
                                        10,
                                    );
                                    setField((prev) => ({
                                        ...prev,
                                        width: newWidth,
                                    }));
                                    setUserDimensions((prev) =>
                                        prev
                                            ? { ...prev, width: newWidth }
                                            : {
                                                  width: newWidth,
                                                  height: field.height || 0,
                                              },
                                    );
                                }}
                                min={1}
                                max={field.format === "ico" ? 300 : undefined}
                            />
                        </Field>
                        <Field
                            htmlFor="height"
                            label="Height"
                            rightLabel={`${field.height} px`}
                        >
                            <Input
                                name="height"
                                type="number"
                                value={field.height}
                                onChange={(e) => {
                                    const newHeight = parseInt(
                                        e.target.value,
                                        10,
                                    );
                                    setField((prev) => ({
                                        ...prev,
                                        height: newHeight,
                                    }));
                                    setUserDimensions((prev) =>
                                        prev
                                            ? { ...prev, height: newHeight }
                                            : {
                                                  width: field.width || 0,
                                                  height: newHeight,
                                              },
                                    );
                                }}
                                min={1}
                                max={field.format === "ico" ? 300 : undefined}
                            />
                        </Field>
                    </div>

                    {/* fit, accept ratio */}
                    <div className={`w-full grid grid-cols-2 gap-4`}>
                        <Field htmlFor="fit" label="Fit" className="w-full">
                            <Select
                                name="fit"
                                value={field.fit}
                                onValueChange={(value) =>
                                    setField((prev) => ({
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
                        <Field htmlFor="ratio" label="Maintain Aspect Ratio">
                            <Button
                                name="ratio"
                                onClick={() =>
                                    setField((p) => ({
                                        ...p,
                                        maintainAspectRatio:
                                            !p.maintainAspectRatio,
                                    }))
                                }
                                type="button"
                                className="flex gap-2 justify-start items-center w-full"
                                variant={"outline"}
                                disabled={loading}
                            >
                                <span
                                    className={`${!field.maintainAspectRatio ? "bg-red-500" : "bg-green-500"} w-2 h-2 rounded-full`}
                                />
                                <span>
                                    {field.maintainAspectRatio ? "Yes" : "No"}
                                </span>
                            </Button>
                        </Field>
                    </div>

                    {/* background, max size */}
                    {/* <div className="w-full grid grid-cols-2 gap-4">
                    <Field htmlFor="background" label="Background">
                        <Input
                            name="background"
                            value={field.background}
                            onChange={(e) =>
                                setField((prev) => ({
                                    ...prev,
                                    background: e.target.value,
                                }))
                            }
                            placeholder="background"
                            type="color"
                        />
                    </Field>

                    <Field
                        htmlFor="maxSizeMB"
                        label="Max Size"
                        rightLabel={`${field.maxSizeMB} MB`}
                    >
                        <Input
                            name="maxSizeMB"
                            value={field.maxSizeMB}
                            onChange={(e) =>
                                setField((prev) => ({
                                    ...prev,
                                    maxSizeMB: parseFloat(e.target.value) || 0,
                                }))
                            }
                            placeholder="Max Size (in MB)"
                            type="number"
                            step="0.01"
                            min={0.01}
                        />
                    </Field>
                </div> */}

                    {/* quality */}
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
                                    setField((prev) => ({
                                        ...prev,
                                        quality: val[0],
                                    }))
                                }
                                min={10}
                                max={100}
                                step={1}
                                className="mb-2"
                            />
                        </Field>
                    )}
                </div>

                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <LoadingSpinner className="size-4" />}
                        <span>Convert</span>
                        {outputData && (
                            <span className="italic text-xs">
                                (
                                {bytesToSize(outputData.metadata?.newSize || 0)}
                                )
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
            </div>
        </form>
    );
}
