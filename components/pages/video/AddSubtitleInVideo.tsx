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
import { bufferToBlob, downloadBuffer } from "@/lib/tools/helper";
import { ToolResult } from "@/lib/tools/types";
import { addSubtitleToVideo, videoFormatList } from "@/lib/tools/video";
import type { VideoFormatType } from "@/lib/tools/video/type";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const init = {
    videoBuffer: null as Uint8Array | null,
    subtitleBuffer: null as Uint8Array | null,
    format: "mp4" as VideoFormatType,
    bitrate: undefined as number | undefined,
    resolution: undefined as { width: number; height: number } | undefined,
};

export default function AddSubtitleInVideo() {
    const [files, setFiles] = useState<{
        video: FileList | null;
        subtitle: FileList | null;
    }>({ video: null, subtitle: null });
    const [field, setField] = useState(init);
    const [orgFileData, setOrgFileData] = useState<{
        videoName: string;
        videoFormat: string;
        videoSize: number;
        subtitleName: string;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<ToolResult<Uint8Array> | null>(
        null,
    );
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [previewLoading, setPreviewLoading] = useState<boolean>(false);

    // Generate preview when video buffer changes
    useEffect(() => {
        if (!field.videoBuffer) {
            return;
        }

        const generatePreview = async () => {
            setPreviewLoading(true);
            try {
                const videoBlob = bufferToBlob(field.videoBuffer!, "video/mp4");
                setVideoUrl((p) => {
                    if (p) URL.revokeObjectURL(p);
                    return URL.createObjectURL(videoBlob);
                });
            } catch (error) {
                console.error("Preview generation failed:", error);
            } finally {
                setPreviewLoading(false);
            }
        };

        const timeoutId = setTimeout(generatePreview, 300);
        return () => clearTimeout(timeoutId);
    }, [field.videoBuffer]);

    async function handleVideoFileSelect(videoFiles: FileList | null) {
        setFiles((prev) => ({ ...prev, video: videoFiles }));

        const file = videoFiles?.[0];
        if (!file) return;

        const fileNameSplit = file.name.split(".");
        const fileName = fileNameSplit.slice(0, -1).join(".");
        const format = fileNameSplit.pop();

        setOrgFileData((prev) => ({
            videoName: fileName,
            videoFormat: format || "",
            videoSize: file.size,
            subtitleName: prev?.subtitleName || "",
        }));

        const buffer = new Uint8Array(await file.arrayBuffer());

        setField((prev) => ({
            ...prev,
            videoBuffer: buffer,
            format: (format?.toLowerCase() || "mp4") as VideoFormatType,
        }));

        setVideoUrl(URL.createObjectURL(file));
    }

    async function handleSubtitleFileSelect(subtitleFiles: FileList | null) {
        setFiles((prev) => ({ ...prev, subtitle: subtitleFiles }));

        const file = subtitleFiles?.[0];
        if (!file) return;

        const fileNameSplit = file.name.split(".");
        const fileName = fileNameSplit.slice(0, -1).join("");

        setOrgFileData((prev) => ({
            videoName: prev?.videoName || "",
            videoFormat: prev?.videoFormat || "",
            videoSize: prev?.videoSize || 0,
            subtitleName: fileName,
        }));

        const buffer = new Uint8Array(await file.arrayBuffer());

        setField((prev) => ({
            ...prev,
            subtitleBuffer: buffer,
        }));
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!field.videoBuffer || !field.subtitleBuffer) {
            toast.error("Please select both video and subtitle files");
            return;
        }

        setLoading(true);
        try {
            // Determine subtitle file extension from original file
            const subtitleFileName = files.subtitle?.[0]?.name || "";
            const subtitleExtension = subtitleFileName.endsWith(".vtt")
                ? "vtt"
                : "srt";

            const input = {
                buffer: field.videoBuffer,
                format: field.format,
                bitrate: field.bitrate,
                resolution: field.resolution,
                subtitleExtension,
                subtitleBuffer: field.subtitleBuffer,
            };

            const result = await addSubtitleToVideo(input);
            if (!result.data) {
                throw new Error(
                    "Something went wrong! While burning subtitle to video.",
                );
            }

            setOutputData(result);

            // Auto-download after processing
            const fileName = `${orgFileData?.videoName}_with_subtitle_blade_tools.${field.format}`;
            downloadBuffer(result.data, fileName, `video/${field.format}`);
            toast.success("Successfully processed and downloaded!");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Something went wrong!",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClear() {
        setFiles({ video: null, subtitle: null });
        setField(init);
        setOrgFileData(null);
        setOutputData(null);
        setVideoUrl("");
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start lg:gap-6 w-full"
        >
            {files?.video && files.video.length > 0 ? (
                <div className="space-y-4">
                    {/* Video Preview */}
                    {videoUrl && (
                        <div className="space-y-2">
                            <div className="border rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <span>Video Preview</span>
                                        {previewLoading && (
                                            <LoadingSpinner className="size-3" />
                                        )}
                                    </h3>
                                </div>

                                <div className="relative rounded-lg bg-muted w-full overflow-hidden aspect-video max-h-112 lg:max-h-125 xl:max-h-138">
                                    <video
                                        className="mx-auto w-fit h-full object-contain bg-black"
                                        src={videoUrl}
                                        controls
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* File Info */}
                    <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium">File Info</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                                <strong>Video Name:</strong>{" "}
                                {orgFileData?.videoName}
                            </p>
                            <p>
                                <strong>Format:</strong>{" "}
                                {orgFileData?.videoFormat || "unknown"}
                            </p>
                            <p>
                                <strong>Size:</strong>{" "}
                                {orgFileData?.videoSize
                                    ? (
                                          orgFileData.videoSize /
                                          (1024 * 1024)
                                      ).toFixed(2) + " MB"
                                    : "Unknown"}
                            </p>
                            <p>
                                <strong>Subtitle Name:</strong>{" "}
                                {orgFileData?.subtitleName ||
                                    "No subtitle selected"}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <FileUpload
                    onFileSelect={handleVideoFileSelect}
                    label=""
                    name="videoFiles"
                    accept="video/*"
                    required
                    helperText="Select video file (MP4, WebM, etc.)"
                    valueFiles={files?.video}
                    className="h-72 md:h-96 lg:h-120 xl:h-150"
                />
            )}

            <div className="flex flex-col justify-center items-center gap-4 w-full">
                {/* Subtitle File Upload - Full width at top */}
                <div className="w-full border rounded-lg p-4 space-y-4">
                    <Field
                        htmlFor="subtitleFiles"
                        label="Subtitle File"
                        className="w-full"
                    >
                        <FileUpload
                            onFileSelect={handleSubtitleFileSelect}
                            label=""
                            name="subtitleFiles"
                            accept=".srt,.vtt"
                            required={
                                !files.subtitle || files.subtitle.length === 0
                            }
                            helperText="Select subtitle file (SRT or VTT format)"
                            valueFiles={files?.subtitle}
                            className="h-32 md:h-40"
                        />
                    </Field>

                    {/* Bitrate Field */}
                    <Field
                        htmlFor="bitrate"
                        label="Bitrate"
                        rightLabel={field.bitrate ? `${field.bitrate}kbps` : ""}
                        className="w-full"
                    >
                        <Input
                            name="bitrate"
                            type="number"
                            min={0}
                            step={100}
                            value={field.bitrate || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setField((prev) => ({
                                    ...prev,
                                    bitrate: value
                                        ? parseInt(value)
                                        : undefined,
                                }));
                            }}
                            placeholder="e.g., 1000"
                        />
                    </Field>

                    {/* Resolution Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            htmlFor="width"
                            label="Width"
                            rightLabel={
                                field.resolution?.width
                                    ? `${field.resolution.width}px`
                                    : ""
                            }
                            className="w-full"
                        >
                            <Input
                                name="width"
                                type="number"
                                min={0}
                                step={1}
                                value={field.resolution?.width || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setField((prev) => ({
                                        ...prev,
                                        resolution: {
                                            width: value ? parseInt(value) : 0,
                                            height:
                                                prev.resolution?.height || 0,
                                        },
                                    }));
                                }}
                                placeholder="e.g., 1920"
                            />
                        </Field>
                        <Field
                            htmlFor="height"
                            label="Height"
                            rightLabel={
                                field.resolution?.height
                                    ? `${field.resolution.height}px`
                                    : ""
                            }
                            className="w-full"
                        >
                            <Input
                                name="height"
                                type="number"
                                min={0}
                                step={1}
                                value={field.resolution?.height || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setField((prev) => ({
                                        ...prev,
                                        resolution: {
                                            width: prev.resolution?.width || 0,
                                            height: value ? parseInt(value) : 0,
                                        },
                                    }));
                                }}
                                placeholder="e.g., 1080"
                            />
                        </Field>
                    </div>

                    {/* Output Format */}
                    <div className="w-full">
                        <Field
                            htmlFor="format"
                            label="Output Format"
                            rightLabel={
                                orgFileData
                                    ? `${orgFileData.videoFormat || "?"} → ${field.format}`
                                    : ""
                            }
                            className="w-full"
                        >
                            <Select
                                onValueChange={(value) =>
                                    setField((prev) => ({
                                        ...prev,
                                        format: value as VideoFormatType,
                                    }))
                                }
                                value={field.format}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    {videoFormatList.map((format) => (
                                        <SelectItem key={format} value={format}>
                                            {format}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <LoadingSpinner className="size-4" />}
                        <span>Burn Subtitle</span>
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
