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
import {
    bufferToBlob,
    downloadBuffer,
    formatDuration,
} from "@/lib/tools/helper";
import { ToolResult } from "@/lib/tools/types";
import { videoFormatList, videoTrimConvert } from "@/lib/tools/video";
import type {
    VideoFormatType,
    VideoTrimConvertInput,
} from "@/lib/tools/video/type";

import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const init = {
    buffer: null as Uint8Array | null,
    startTime: 0,
    endTime: 0,
    duration: 0,
    format: "mp4" as VideoFormatType,
    bitrate: undefined as number | undefined,
    resolution: undefined as { width: number; height: number } | undefined,
};

// Custom Video Player Slider Component
function VideoPlayerSlider({
    videoUrl,
    startTime,
    endTime,
    duration,
    onStartTimeChange,
    onEndTimeChange,
    loading,
    resolution,
}: {
    videoUrl: string;
    startTime: number;
    endTime: number;
    duration: number;
    onStartTimeChange: (time: number) => void;
    onEndTimeChange: (time: number) => void;
    loading?: boolean;
    resolution?: { width: number; height: number } | undefined;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        if (!videoUrl || !videoRef.current) return;

        setIsPlaying(false);
        const video = videoRef.current;
        video.src = videoUrl;
        video.preload = "metadata";

        const handleVideoEnded = () => {
            setIsPlaying(false);
            setCurrentTime(startTime);
            video.currentTime = startTime;
        };

        const handleVideoTimeUpdate = () => {
            setCurrentTime(video.currentTime);

            // Stop playing when reaching endTime
            if (video.currentTime >= endTime) {
                video.pause();
                setIsPlaying(false);
                video.currentTime = startTime;
                setCurrentTime(startTime);
            }
        };

        video.addEventListener("ended", handleVideoEnded);
        video.addEventListener("timeupdate", handleVideoTimeUpdate);

        return () => {
            video.removeEventListener("ended", handleVideoEnded);
            video.removeEventListener("timeupdate", handleVideoTimeUpdate);
            video.pause();
            video.src = "";
        };
    }, [videoUrl, startTime, endTime]);

    const handlePlay = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            // Start from the current position or from startTime if outside range
            if (video.currentTime < startTime || video.currentTime >= endTime) {
                video.currentTime = startTime;
            }
            video.play();
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        video.pause();
        video.currentTime = startTime;
        setCurrentTime(startTime);
        setIsPlaying(false);
    };

    const handleTimelineClick = (value: number[]) => {
        if (!videoRef.current) return;

        const [newTime] = value;

        // Ensure the clicked time is within the trim range
        if (newTime >= startTime && newTime <= endTime) {
            setCurrentTime(newTime);
            videoRef.current.currentTime = newTime;
        }
    };

    const handleTrimChange = (value: number[]) => {
        const [newStartTime, newEndTime] = value;
        onStartTimeChange(newStartTime);
        onEndTimeChange(newEndTime);
    };

    return (
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                    <span>Video Player</span>{" "}
                    {loading && <LoadingSpinner className="size-3" />}
                </h3>
                <div className="text-sm text-muted-foreground">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                </div>
            </div>

            {/* Video Preview */}
            <div className="relative rounded-lg bg-muted w-full overflow-hidden aspect-video max-h-112 lg:max-h-125 xl:max-h-138">
                <video
                    ref={videoRef}
                    className="mx-auto w-fit h-full object-contain bg-black"
                    style={{
                        aspectRatio: resolution?.width && resolution?.height ? `${resolution.width}/${resolution.height}` : 'auto'
                    }}
                    src={videoUrl}
                />
            </div>

            {/* Timeline Slider */}
            <Field
                htmlFor="video-progress"
                label="Playback Progress"
                rightLabel={formatDuration(currentTime - startTime)}
            >
                <Slider
                    name="video-progress"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={[currentTime]}
                    onValueChange={handleTimelineClick}
                />
            </Field>

            {/* Trim Range Slider */}
            <Field
                htmlFor="trim-range"
                label="Trim Range"
                rightLabel={`${formatDuration(startTime)} - ${formatDuration(endTime)} = ${formatDuration(
                    endTime - startTime,
                )}`}
            >
                <Slider
                    name="trim-range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={[startTime, endTime]}
                    onValueChange={handleTrimChange}
                />
            </Field>

            {/* Play/Stop Controls */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    onClick={handlePlay}
                    variant={isPlaying ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    disabled={loading}
                >
                    {isPlaying ? <Pause /> : <Play />}
                    {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                    type="button"
                    onClick={handleStop}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={loading}
                >
                    <Square />
                    Stop
                </Button>
            </div>
        </div>
    );
}

export default function VideoTrimConvertPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [field, setField] = useState(init);
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
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [previewLoading, setPreviewLoading] = useState<boolean>(false);

    // Generate preview when parameters change
    useEffect(() => {
        if (!field.buffer) {
            return;
        }

        const generatePreview = async () => {
            setPreviewLoading(true);
            try {
                if (!field.buffer) return;

                const videoBlob = bufferToBlob(field.buffer, "video/mp4");
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

        const timeoutId = setTimeout(generatePreview, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [field.buffer]);

    async function handleFileSelect(files: FileList | null) {
        setFiles(files);

        const file = files?.[0];
        if (!file) return;

        const fileNameSplit = file.name.split(".");
        const fileName = fileNameSplit.slice(0, -1).join(".");
        const format = fileNameSplit.pop();

        setOrgFileData({
            name: fileName,
            format: format || "",
            size: file.size,
            type: file.type,
        });

        const buffer = new Uint8Array(await file.arrayBuffer());

        // Get video duration
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.preload = "metadata";

        video.addEventListener("loadedmetadata", () => {
            setField((prev) => ({
                ...prev,
                buffer,
                duration: video.duration,
                endTime: video.duration,
                format: (format?.toLowerCase() || "mp4") as VideoFormatType,
            }));
            setVideoUrl(URL.createObjectURL(file));
        });

        video.addEventListener("error", () => {
            toast.error("Failed to load video file");
        });
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        try {
            const input: VideoTrimConvertInput = {
                buffer: field.buffer!,
                startTime: field.startTime,
                endTime: field.endTime,
                format: field.format,
                bitrate: field.bitrate,
                resolution: field.resolution,
            };

            const result = await videoTrimConvert(input);
            if (!result.data) {
                throw new Error(
                    "Something went wrong! While processing video.",
                );
            }

            setOutputData(result);

            // Auto-download after processing
            const fileName = `${orgFileData?.name}_blade_tools.${field.format}`;
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
        setFiles(null);
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
            {files && files.length > 0 ? (
                <div className="space-y-4">
                    {/* Video Player with Timeline */}
                    {videoUrl && (
                        <div className="space-y-2">
                            <VideoPlayerSlider
                                videoUrl={videoUrl}
                                startTime={field.startTime}
                                endTime={field.endTime}
                                duration={field.duration}
                                onStartTimeChange={(time) =>
                                    setField((prev) => ({
                                        ...prev,
                                        startTime: time,
                                    }))
                                }
                                onEndTimeChange={(time) =>
                                    setField((prev) => ({
                                        ...prev,
                                        endTime: time,
                                    }))
                                }
                                loading={previewLoading}
                                resolution={field.resolution}
                            />
                        </div>
                    )}

                    {/* Original File Info */}
                    <div className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-medium">Original File Info</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                                <strong>Name:</strong> {orgFileData?.name}
                            </p>
                            <p>
                                <strong>Duration:</strong>{" "}
                                {formatDuration(field.duration)}
                            </p>
                            <p>
                                <strong>Format:</strong>{" "}
                                {orgFileData?.format || "unknown"}
                            </p>
                            <p>
                                <strong>Size:</strong>{" "}
                                {orgFileData
                                    ? (
                                          orgFileData.size /
                                          (1024 * 1024)
                                      ).toFixed(2) + " MB"
                                    : "Unknown"}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <FileUpload
                    onFileSelect={handleFileSelect}
                    label=""
                    name="inputfiles"
                    accept="video/*"
                    required
                    helperText=""
                    valueFiles={files}
                    className="h-72 md:h-96 lg:h-120 xl:h-150"
                />
            )}

            <div className="flex flex-col justify-center items-center gap-4 w-full">
                <div className="w-full border rounded-lg p-4 space-y-4">
                    {/* Time input fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            htmlFor="startTime"
                            label="Start Time"
                            rightLabel={`${field.startTime}s`}
                            className="w-full"
                        >
                            <Input
                                name="startTime"
                                type="number"
                                min={0}
                                max={field.duration}
                                step={0.1}
                                value={field.startTime}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0;
                                    const bounded = Math.max(
                                        0,
                                        Math.min(value, field.duration),
                                    );
                                    setField((prev) => ({
                                        ...prev,
                                        startTime: bounded,
                                        endTime: Math.max(
                                            bounded,
                                            prev.endTime,
                                        ),
                                    }));
                                }}
                                placeholder="Start time in seconds"
                            />
                        </Field>
                        <Field
                            htmlFor="endTime"
                            label="End Time"
                            rightLabel={`${field.endTime}s`}
                            className="w-full"
                        >
                            <Input
                                name="endTime"
                                type="number"
                                min={0}
                                max={field.duration}
                                step={0.1}
                                value={field.endTime}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0;
                                    const bounded = Math.max(
                                        0,
                                        Math.min(value, field.duration),
                                    );
                                    setField((prev) => ({
                                        ...prev,
                                        endTime: bounded,
                                        startTime: Math.min(
                                            prev.startTime,
                                            bounded,
                                        ),
                                    }));
                                }}
                                placeholder="End time in seconds"
                            />
                        </Field>
                    </div>

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
                            rightLabel={field.resolution?.width ? `${field.resolution.width}px` : ""}
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
                                            height: prev.resolution?.height || 0,
                                        },
                                    }));
                                }}
                                placeholder="e.g., 1920"
                            />
                        </Field>
                        <Field
                            htmlFor="height"
                            label="Height"
                            rightLabel={field.resolution?.height ? `${field.resolution.height}px` : ""}
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
                            label="Format"
                            rightLabel={
                                orgFileData
                                    ? `${orgFileData.format || "?"} → ${field.format}`
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
                        <span>Process</span>
                        {outputData && (
                            <span className="italic text-xs">
                                (
                                {formatDuration(
                                    field.endTime - field.startTime,
                                )}
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
