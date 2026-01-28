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
import { audioTrim } from "@/lib/tools/audio";
import type { AudioTrimInput } from "@/lib/tools/audio/type";
import {
    downloadBuffer,
    formatDuration,
    type ToolResult,
} from "@/lib/tools/helper";

import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const init = {
    buffer: null as Uint8Array | null,
    startTime: 0,
    endTime: 0,
    duration: 0,
    format: "wav" as string,
};

// Custom Audio Player Slider Component
function AudioPlayerSlider({
    audioUrl,
    startTime,
    endTime,
    duration,
    onStartTimeChange,
    onEndTimeChange,
}: {
    audioUrl: string;
    startTime: number;
    endTime: number;
    duration: number;
    onStartTimeChange: (time: number) => void;
    onEndTimeChange: (time: number) => void;
}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    // const animationFrameRef = useRef<number>();

    useEffect(() => {
        if (audioUrl) {
            audioRef.current = new Audio(audioUrl);

            const audio = audioRef.current;

            audio.addEventListener("ended", () => {
                setIsPlaying(false);
                setCurrentTime(startTime);
                audio.currentTime = startTime;
            });

            audio.addEventListener("timeupdate", () => {
                setCurrentTime(audio.currentTime);

                // Stop at end time
                if (audio.currentTime >= endTime) {
                    audio.pause();
                    setIsPlaying(false);
                    audio.currentTime = startTime;
                    setCurrentTime(startTime);
                }
            });

            return () => {
                audio.pause();
                audio.src = "";
            };
        }
    }, [audioUrl, startTime, endTime]);

    const handlePlay = () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            // Start from the current position or from startTime if outside range
            if (audio.currentTime < startTime || audio.currentTime >= endTime) {
                audio.currentTime = startTime;
            }
            audio.play();
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = startTime;
        setCurrentTime(startTime);
        setIsPlaying(false);
    };

    const handleTimelineClick = (value: number[]) => {
        if (!audioRef.current) return;

        const [newTime] = value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium">Audio Player</h3>
                <div className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>

            {/* Timeline Slider */}
            <Field
                htmlFor="audio-progress"
                label="Timeline Progress"
                rightLabel={formatDuration(endTime - startTime)}
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
                rightLabel={`${formatTime(startTime)} - ${formatTime(endTime)}`}
            >
                <Slider
                    name="trim-range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={[startTime, endTime]}
                    onValueChange={(value) => {
                        const [newStart, newEnd] = value;
                        onStartTimeChange(newStart);
                        onEndTimeChange(newEnd);

                        // Update audio position if scrubbing
                        if (audioRef.current) {
                            audioRef.current.pause();
                            setIsPlaying(false);
                            audioRef.current.currentTime = newStart;
                            setCurrentTime(newStart);
                        }
                    }}
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
                >
                    <Square />
                    Stop
                </Button>
            </div>
        </div>
    );
}

export default function AudioTrimPage() {
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

    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

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
                format: format?.toLowerCase() || "wav",
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
            const input: AudioTrimInput = {
                buffer: field.buffer!,
                startTime: field.startTime,
                endTime: field.endTime,
                format: field.format,
            };

            const result = await audioTrim(input);
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
                        <AudioPlayerSlider
                            audioUrl={audioUrl}
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
                                setField((prev) => ({ ...prev, endTime: time }))
                            }
                        />
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
                    <div className="w-full grid grid-cols-1 gap-4">
                        <Field
                            htmlFor="format"
                            label="Output Format"
                            rightLabel={
                                orgFileData
                                    ? `${orgFileData.format || "?"} -> ${field.format}`
                                    : ""
                            }
                            className="w-full"
                        >
                            <Select
                                onValueChange={(value) =>
                                    setField((prev) => ({
                                        ...prev,
                                        format: value,
                                    }))
                                }
                                value={field.format}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mp3">MP3</SelectItem>
                                    <SelectItem value="wav">WAV</SelectItem>
                                    <SelectItem value="ogg">OGG</SelectItem>
                                    <SelectItem value="flac">FLAC</SelectItem>
                                    <SelectItem value="m4a">M4A</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    {/* Time Input Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Start Time (s)
                            </label>
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
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                End Time (s)
                            </label>
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
                        </div>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <LoadingSpinner className="size-4" />}
                        <span>Trim</span>
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
