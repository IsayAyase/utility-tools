"use client";

import { Button } from "@/components/ui/button";
import CropPreview from "@/components/ui/crop-preview";
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
import { bytesToSize, downloadBuffer } from "@/lib/tools/helper";
import {
    flipDirectionList,
    imageTransform,
    loadImage,
} from "@/lib/tools/image";
import {
    type ImageDirectionType,
    type ImageFormatType,
    type ImageTransformInput,
} from "@/lib/tools/image/type";
import { ToolResult } from "@/lib/tools/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const init: ImageTransformInput = {
    buffer: null,
    crop: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    rotate: {
        angle: 0,
        background: "#000000",
        expand: true,
    },
    flip: {
        direction: "none",
    },
};

export default function ImageTransformPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [field, setField] = useState<ImageTransformInput>(init);
    const [orgFileData, setOrgFileData] = useState<{
        name: string;
        format: string;
        size: number;
        type: string;
        width: number;
        height: number;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<ToolResult<Uint8Array> | null>(
        null,
    );
    const [previewMode, setPreviewMode] = useState<"Interactive" | "Normal">(
        "Interactive",
    );

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!outputData?.data) {
                throw new Error("No file selected!");
            }

            const fileName = `${orgFileData?.name}_image_transform_blade_tools.png`;
            downloadBuffer(outputData.data, fileName, "image/png");
            toast.success("Successfully transformed!");
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
                    const outputBuffer = await imageTransform(field);
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
    }, [field.buffer, field.crop, field.rotate, field.flip]);

    async function handleFileSelect(files: FileList | null) {
        setFiles(files);

        const file = files?.[0];
        if (!file) return;

        const fileNameSplit = file.name.split(".");
        const fileName = fileNameSplit[0];
        const format = fileNameSplit.pop();

        const buffer = new Uint8Array(await file.arrayBuffer());
        const imageLoaded = await loadImage(buffer);

        setOrgFileData({
            name: fileName,
            format: format || "",
            size: file.size,
            type: file.type,
            width: imageLoaded.width,
            height: imageLoaded.height,
        });

        setField((prev) => ({
            ...prev,
            buffer,
            format: format as ImageFormatType,
            crop: {
                left: 0,
                top: 0,
                right: imageLoaded.width,
                bottom: imageLoaded.height,
            },
        }));
    }

    function handleClear() {
        setFiles(null);
        setField(init);
        setOrgFileData(null);
        setOutputData(null);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start lg:gap-6 w-full"
        >
            {files && files.length > 0 ? (
                <>
                    {previewMode === "Interactive" ? (
                        <CropPreview
                            key={`crop-preview-${previewMode}`}
                            buffer={field.buffer}
                            left={field.crop?.left || 0}
                            top={field.crop?.top || 0}
                            right={field.crop?.right || orgFileData?.width || 0}
                            bottom={field.crop?.bottom || orgFileData?.height || 0}
                            onCropChange={(left, top, right, bottom) =>
                                setField((prev) => ({
                                    ...prev,
                                    crop: { left, top, right, bottom },
                                }))
                            }
                            imageWidth={orgFileData?.width || 0}
                            imageHeight={orgFileData?.height || 0}
                        />
                    ) : (
                        <ImagePreview
                            loading={loading}
                            buffer={outputData?.data}
                        />
                    )}
                </>
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
                {/* Crop Settings */}
                <div className="w-full border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-sm font-medium">Crop Settings</h3>
                        <Button
                            onClick={() =>
                                setPreviewMode((p) =>
                                    p === "Interactive"
                                        ? "Normal"
                                        : "Interactive",
                                )
                            }
                            size='sm'
                            type="button"
                        >
                            {previewMode === "Interactive"
                                ? "Normal"
                                : "Interactive"}
                        </Button>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <Field
                            htmlFor="cropLeft"
                            label="Left"
                            rightLabel={`${field.crop?.left || 0} px`}
                        >
                            <Input
                                name="cropLeft"
                                type="number"
                                value={field.crop?.left || 0}
                                onChange={(e) =>
                                    setField((prev) => ({
                                        ...prev,
                                        crop: {
                                            ...prev.crop!,
                                            left:
                                                parseInt(e.target.value, 10) ||
                                                0,
                                        },
                                    }))
                                }
                                min={0}
                            />
                        </Field>
                        <Field
                            htmlFor="cropTop"
                            label="Top"
                            rightLabel={`${field.crop?.top || 0} px`}
                        >
                            <Input
                                name="cropTop"
                                type="number"
                                value={field.crop?.top || 0}
                                onChange={(e) =>
                                    setField((prev) => ({
                                        ...prev,
                                        crop: {
                                            ...prev.crop!,
                                            top:
                                                parseInt(e.target.value, 10) ||
                                                0,
                                        },
                                    }))
                                }
                                min={0}
                            />
                        </Field>
                        <Field
                            htmlFor="cropRight"
                            label="Right"
                            rightLabel={`${field.crop?.right || 0} px`}
                        >
                            <Input
                                name="cropRight"
                                type="number"
                                value={field.crop?.right || 0}
                                onChange={(e) =>
                                    setField((prev) => ({
                                        ...prev,
                                        crop: {
                                            ...prev.crop!,
                                            right:
                                                parseInt(e.target.value, 10) ||
                                                0,
                                        },
                                    }))
                                }
                                min={1}
                            />
                        </Field>
                        <Field
                            htmlFor="cropBottom"
                            label="Bottom"
                            rightLabel={`${field.crop?.bottom || 0} px`}
                        >
                            <Input
                                name="cropBottom"
                                type="number"
                                value={field.crop?.bottom || 0}
                                onChange={(e) =>
                                    setField((prev) => ({
                                        ...prev,
                                        crop: {
                                            ...prev.crop!,
                                            bottom:
                                                parseInt(e.target.value, 10) ||
                                                0,
                                        },
                                    }))
                                }
                                min={1}
                            />
                        </Field>
                    </div>
                </div>

                {/* Rotate Settings */}
                <div className="w-full border rounded-lg p-4 space-y-4">
                    <h3 className="text-sm font-medium">Rotate Settings</h3>
                    <Field
                        htmlFor="angle"
                        label="Angle"
                        rightLabel={`${field.rotate?.angle || 0}°`}
                        className="w-full"
                    >
                        <Slider
                            value={[field.rotate?.angle || 0]}
                            onValueChange={(val) =>
                                setField((prev) => ({
                                    ...prev,
                                    rotate: {
                                        ...prev.rotate!,
                                        angle: val[0],
                                    },
                                }))
                            }
                            min={-360}
                            max={360}
                            step={1}
                            className="mb-2"
                        />
                    </Field>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <Field htmlFor="background" label="Background">
                            <Input
                                name="background"
                                value={field.rotate?.background || "#000000"}
                                onChange={(e) =>
                                    setField((prev) => ({
                                        ...prev,
                                        rotate: {
                                            ...prev.rotate!,
                                            background: e.target.value,
                                        },
                                    }))
                                }
                                placeholder="Background color"
                                type="color"
                            />
                        </Field>
                        <Field htmlFor="expand" label="Expand Canvas">
                            <Button
                                name="expand"
                                onClick={() =>
                                    setField((p) => ({
                                        ...p,
                                        rotate: {
                                            ...p.rotate!,
                                            expand: !p.rotate?.expand,
                                        },
                                    }))
                                }
                                type="button"
                                className="flex gap-2 justify-start items-center w-full"
                                variant={"outline"}
                                disabled={loading}
                            >
                                <span
                                    className={`${!field.rotate?.expand ? "bg-red-500" : "bg-green-500"} w-2 h-2 rounded-full`}
                                />
                                <span>
                                    {field.rotate?.expand ? "Yes" : "No"}
                                </span>
                            </Button>
                        </Field>
                    </div>
                </div>

                {/* Flip Settings */}
                <div className="w-full border rounded-lg p-4 space-y-4">
                    <h3 className="text-sm font-medium">Flip Settings</h3>
                    <Field
                        htmlFor="direction"
                        label="Direction"
                        className="w-full"
                    >
                        <Select
                            name="direction"
                            value={field.flip?.direction || "horizontal"}
                            onValueChange={(value) =>
                                setField((prev) => ({
                                    ...prev,
                                    flip: {
                                        direction: value as ImageDirectionType,
                                    },
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                                {flipDirectionList.map((direction: string) => (
                                    <SelectItem
                                        key={direction}
                                        value={direction}
                                    >
                                        {direction}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <LoadingSpinner className="size-4" />}
                        <span>Transform</span>
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
