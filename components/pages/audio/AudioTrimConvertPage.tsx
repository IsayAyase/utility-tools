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
import { audioFormats, audioTrimConvert } from "@/lib/tools/audio";
import type { AudioFormatType, AudioTrimConvertInput } from "@/lib/tools/audio/type";
import {
    bufferToBlob,
    downloadBuffer,
    formatDuration,
} from "@/lib/tools/helper";
import { ToolResult } from "@/lib/tools/types";

import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const init = {
    buffer: null as Uint8Array | null,
    startTime: 0,
    endTime: 0,
    duration: 0,
    format: "wav" as AudioFormatType,
    fadeInDuration: 0,
    fadeOutDuration: 0,
    speed: 1,
    preservePitch: false,
};

// Custom Audio Player Slider Component
function AudioPlayerSlider({
    audioUrl,
    startTime,
    endTime,
    duration,
    onStartTimeChange,
    onEndTimeChange,
    fadeInDuration,
    fadeOutDuration,
    speed,
    preservePitch,
    loading,
}: {
    audioUrl: string;
    startTime: number;
    endTime: number;
    duration: number;
    onStartTimeChange: (time: number) => void;
    onEndTimeChange: (time: number) => void;
    fadeInDuration?: number;
    fadeOutDuration?: number;
    speed?: number;
    preservePitch?: boolean;
    loading?: boolean;
}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    // const animationFrameRef = useRef<number>();

    useEffect(() => {
        if (!audioUrl) return;

        setIsPlaying(false);
        audioRef.current = new Audio(audioUrl);

        const audio = audioRef.current;

        // Apply speed and preserve pitch settings
        if (speed && speed !== 1) {
            audio.playbackRate = speed;
            if (preservePitch) {
                audio.preservesPitch = true;
            }
        }

        const handleAudioEnded = () => {
            setIsPlaying(false);
            setCurrentTime(startTime);
            audio.currentTime = startTime;
        };

        const handleAudioTimeUpdate = () => {
            let adjustedCurrentTime = audio.currentTime;

            // Adjust time display based on speed
            if (speed && speed !== 1) {
                adjustedCurrentTime = audio.currentTime;
            }

            setCurrentTime(adjustedCurrentTime);

            // only between startTime and endTime (adjust for speed)
            const adjustedStartTime = speed ? startTime : startTime;
            const adjustedEndTime = speed ? endTime : endTime;
            const audioTime = adjustedCurrentTime;
            if (audioTime < adjustedStartTime || audioTime >= adjustedEndTime) {
                audio.pause();
                setIsPlaying(false);
                audio.currentTime = adjustedStartTime;
                setCurrentTime(adjustedStartTime);
            }
        };

        audio.addEventListener("ended", handleAudioEnded);
        audio.addEventListener("timeupdate", handleAudioTimeUpdate);

        return () => {
            audio.removeEventListener("ended", handleAudioEnded);
            audio.removeEventListener("timeupdate", handleAudioTimeUpdate);
            audio.pause();
            audio.src = "";
        };
    }, [audioUrl, startTime, endTime, speed, preservePitch]);

    const handlePlay = () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            // Start from the current position or from startTime if outside range
            const adjustedStartTime = startTime / (speed || 1);
            const adjustedEndTime = endTime / (speed || 1);

            if (
                audio.currentTime < adjustedStartTime ||
                audio.currentTime >= adjustedEndTime
            ) {
                audio.currentTime = adjustedStartTime;
            }
            audio.play();
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        const adjustedStartTime = startTime / (speed || 1);
        audio.pause();
        audio.currentTime = adjustedStartTime;
        setCurrentTime(startTime);
        setIsPlaying(false);
    };

    const handleTimelineClick = (value: number[]) => {
        if (!audioRef.current) return;

        const [newTime] = value;
        let adjustedTime = newTime / (speed || 1);

        // handling these here as well (already in 'timeupdate' event listener),
        // so that the seeker doesn't jump around, if click out of range
        const adjustedStartTime = startTime;
        const adjustedEndTime = endTime;

        if (
            adjustedTime >= adjustedStartTime &&
            adjustedTime <= adjustedEndTime
        ) {
            setCurrentTime(newTime);
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
                    <span>Audio Player</span>{" "}
                    {loading && <LoadingSpinner className="size-3" />}
                </h3>
                <div className="text-sm text-muted-foreground">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                    {speed && speed !== 1 && (
                        <span className="ml-1 text-xs">({speed}x)</span>
                    )}
                </div>
            </div>

            {/* Timeline Slider */}
            <Field
                htmlFor="audio-progress"
                label="Timeline Progress"
                rightLabel={formatDuration(currentTime - startTime)}
            >
                <Slider
                    name="audio-progress"
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
                    endTime - startTime
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

export default function AudioTrimConvertPage() {
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
    const [audioUrl, setAudioUrl] = useState<string>("");
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

                const audioBlob = bufferToBlob(field.buffer, "audio/wav");
                setAudioUrl((p) => {
                    if (p) URL.revokeObjectURL(p);
                    return URL.createObjectURL(audioBlob);
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

        // Get audio duration
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener("loadedmetadata", () => {
            setField((prev) => ({
                ...prev,
                buffer,
                duration: audio.duration,
                endTime: audio.duration,
                format: format?.toLowerCase() as AudioFormatType,
            }));
            setAudioUrl(URL.createObjectURL(file));
        });

        audio.addEventListener("error", () => {
            toast.error("Failed to load audio file");
        });
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Only perform full trim if not already done
        // if (outputData?.data) {
        //     // Already processed, just download
        //     const fileName = `${orgFileData?.name}_trimmed_blade_tools.${field.format}`;
        //     downloadBuffer(outputData.data, fileName, `audio/${field.format}`);
        //     toast.success("Successfully downloaded!");
        //     return;
        // }

        setLoading(true);
        try {
            const input: AudioTrimConvertInput = {
                buffer: field.buffer!,
                startTime: field.startTime,
                endTime: field.endTime,
                format: field.format,
                fadeInDuration: field.fadeInDuration,
                fadeOutDuration: field.fadeOutDuration,
                speed: field.speed,
                preservePitch: field.preservePitch,
            };

            const result = await audioTrimConvert(input);
            if (!result.data) {
                throw new Error("Something went wrong! While trimming.");
            }

            setOutputData(result);

            // Auto-download after processing
            const fileName = `${orgFileData?.name}_trimmed_blade_tools.${field.format}`;
            downloadBuffer(result.data, fileName, `audio/${field.format}`);
            toast.success("Successfully trimmed and downloaded!");
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
        setAudioUrl("");
    }

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start lg:gap-6 w-full"
        >
            {files && files.length > 0 ? (
                <div className="space-y-4">
                    {/* Audio Player with Timeline */}
                    {audioUrl && (
                        <div className="space-y-2">
                            <AudioPlayerSlider
                                audioUrl={audioUrl}
                                startTime={field.startTime}
                                endTime={field.endTime}
                                duration={field.duration}
                                fadeInDuration={field.fadeInDuration}
                                fadeOutDuration={field.fadeOutDuration}
                                speed={field.speed}
                                preservePitch={field.preservePitch}
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
                    accept="audio/*"
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

                    {/* Fade Duration Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            htmlFor="fadeInDuration"
                            label="Fade In Duration"
                            rightLabel={`${field.fadeInDuration}s`}
                            className="w-full"
                        >
                            <Input
                                name="fadeInDuration"
                                type="number"
                                min={0}
                                step={0.1}
                                value={field.fadeInDuration}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0;
                                    setField((prev) => ({
                                        ...prev,
                                        fadeInDuration: Math.max(0, value),
                                    }));
                                }}
                                placeholder="0"
                            />
                        </Field>
                        <Field
                            htmlFor="fadeOutDuration"
                            label="Fade Out Duration"
                            rightLabel={`${field.fadeOutDuration}s`}
                            className="w-full"
                        >
                            <Input
                                name="fadeOutDuration"
                                type="number"
                                min={0}
                                step={0.1}
                                value={field.fadeOutDuration}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0;
                                    setField((prev) => ({
                                        ...prev,
                                        fadeOutDuration: Math.max(0, value),
                                    }));
                                }}
                                placeholder="0"
                            />
                        </Field>
                    </div>

                    {/* speed slider */}
                    <div>
                        <Field
                            htmlFor="speed"
                            label="Speed"
                            rightLabel={`${field.speed.toFixed(2)}x`}
                        >
                            <Slider
                                name="speed"
                                min={0.25}
                                max={2}
                                step={0.25}
                                value={[field.speed]}
                                onValueChange={(value) => {
                                    setField((prev) => ({
                                        ...prev,
                                        speed: value[0],
                                    }));
                                }}
                            />
                        </Field>
                        <div className="text-xs text-muted-foreground mt-1.5 flex justify-between">
                            <span>0.25x</span>
                            <span>0.5x</span>
                            <span>0.75x</span>
                            <span>1x</span>
                            <span>1.25x</span>
                            <span>1.5x</span>
                            <span>1.75x</span>
                            <span>2x</span>
                        </div>
                    </div>

                    {/* output format and Preserve Pitch Toggle */}
                    <div className="w-full grid grid-cols-2 gap-4">
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
                                        format: value as AudioFormatType,
                                    }))
                                }
                                value={field.format}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    {audioFormats.map((format) => (
                                        <SelectItem key={format} value={format}>
                                            {format}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field
                            htmlFor="pitch"
                            label="Preserve Pitch"
                            className="w-full"
                        >
                            <Button
                                onClick={() =>
                                    setField((prev) => ({
                                        ...prev,
                                        preservePitch: !prev.preservePitch,
                                    }))
                                }
                                name="pitch"
                                type="button"
                                variant={"outline"}
                                disabled={loading}
                                className="w-full"
                            >
                                <span
                                    className={`${!field.preservePitch ? "bg-red-500" : "bg-green-500"} w-2 h-2 rounded-full`}
                                />
                                <span>
                                    {field.preservePitch ? "Yes" : "No"}
                                </span>
                            </Button>
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
