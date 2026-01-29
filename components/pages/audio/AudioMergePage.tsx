"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
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
import { formatTime } from "@/lib/datetime";
import { audioFormats, audioMerge } from "@/lib/tools/audio";
import type { AudioMergeInput } from "@/lib/tools/audio/type";
import {
    downloadBuffer,
    formatDuration,
    type ToolResult,
} from "@/lib/tools/helper";

import { Pause, Play, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RiDraggable } from "react-icons/ri";
import { toast } from "sonner";

type AudioFileData = {
    id: string;
    file: File;
    buffer: Uint8Array;
    name: string;
    format: string;
    size: number;
    duration: number;
    url: string;
};

function AudioMergePlayer({
    files,
    totalDuration,
    isPlaying,
    currentTime,
    currentFileIndex,
    onPlay,
    onStop,
    onTimelineClick,
}: {
    files: AudioFileData[];
    totalDuration: number;
    isPlaying: boolean;
    currentTime: number;
    currentFileIndex: number;
    onPlay: () => void;
    onStop: () => void;
    onTimelineClick: (value: number[]) => void;
}) {
    return (
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium">Merge Preview Player</h3>
                <div className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                </div>
            </div>

            <Field
                htmlFor="merge-progress"
                label="Timeline Progress"
                rightLabel={formatDuration(totalDuration)}
            >
                <Slider
                    name="merge-progress"
                    min={0}
                    max={totalDuration}
                    step={0.01}
                    value={[currentTime]}
                    onValueChange={onTimelineClick}
                    disabled={files.length === 0}
                />
            </Field>

            <div className="text-sm text-muted-foreground">
                <p>
                    <strong>Playing:</strong>{" "}
                    {files[currentFileIndex]?.name || "None"} (
                    {currentFileIndex + 1} / {files.length})
                </p>
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    onClick={onPlay}
                    variant={isPlaying ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    disabled={files.length === 0}
                >
                    {isPlaying ? <Pause /> : <Play />}
                    {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                    type="button"
                    onClick={onStop}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={files.length === 0}
                >
                    <Square className="size-4 mr-1" />
                    Stop
                </Button>
            </div>
        </div>
    );
}

export default function AudioMergePage() {
    const [files, setFiles] = useState<AudioFileData[]>([]);
    const [outputFormat, setOutputFormat] = useState<string>("mp3");
    const [loading, setLoading] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<ToolResult<Uint8Array> | null>(
        null,
    );

    // Player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentFileIndexRef = useRef(0);

    const [dragIndex, setDragIndex] = useState<number | null>(null);

    useEffect(() => {
        // Clean up current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }

        if (files.length > 0) {
            audioRef.current = new Audio(files[0].url);
            const audio = audioRef.current;

            return () => {
                audio.pause();
                audio.src = "";
            };
        }
    }, [files]);

    useEffect(() => {
        currentFileIndexRef.current = currentFileIndex;
    }, [currentFileIndex]);

    // Setup listeners once
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || files.length === 0) return;

        const handleEnded = () => {
            setCurrentFileIndex((prev) => {
                if (prev < files.length - 1) {
                    return prev + 1;
                }
                // All files played
                setIsPlaying(false);
                setCurrentTime(0);
                setCurrentFileIndex(0);
                return prev;
            });
        };

        const handleTimeUpdate = () => {
            let cumulativeTime = 0;
            for (let i = 0; i < currentFileIndexRef.current; i++) {
                cumulativeTime += files[i].duration;
            }

            cumulativeTime += audio.currentTime;
            setCurrentTime(cumulativeTime);
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [files]);

    // Change audio source when currentFileIndex changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !files[currentFileIndex]) return;

        const wasPlaying = isPlaying;
        audio.src = files[currentFileIndex].url;

        // Set the current time for the new audio source
        const targetTime =
            currentTime -
            files
                .slice(0, currentFileIndex)
                .reduce((sum, file) => sum + file.duration, 0);
        audio.currentTime = Math.max(0, targetTime);

        if (wasPlaying) {
            audio.play();
        }
    }, [currentFileIndex, files]);

    const handlePlay = () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        setIsPlaying((p) => {
            if (p) {
                audio.pause();
                return false;
            }
            audio.play().catch((err) => {
                console.error("Audio play failed:", err);
                setIsPlaying(false);
            });
            return true;
        });
    };

    const handleStop = () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        setCurrentTime(0);
        setCurrentFileIndex(0);
        setIsPlaying(false);
    };

    const handleTimelineClick = (value: number[]) => {
        if (!audioRef.current || files.length === 0) return;

        const [newTime] = value;

        // Find which file contains this time
        let cumulativeTime = 0;
        let targetFileIndex = 0;
        let targetFileTime = 0;

        for (let i = 0; i < files.length; i++) {
            if (newTime <= cumulativeTime + files[i].duration) {
                targetFileIndex = i;
                targetFileTime = newTime - cumulativeTime;
                break;
            }
            cumulativeTime += files[i].duration;
        }

        // Update current file index and time
        setCurrentFileIndex(targetFileIndex);
        setCurrentTime(newTime);

        // Set audio position
        if (audioRef.current) {
            audioRef.current.src = files[targetFileIndex].url;
            audioRef.current.currentTime = targetFileTime;

            // If playing, continue playing
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    };

    function playerReset() {
        // Reset player state
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentFileIndex(0);
    }

    async function handleFileSelect(fileList: FileList | null) {
        if (!fileList || fileList.length === 0) return;

        playerReset();

        const newFiles: AudioFileData[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const fileNameSplit = file.name.split(".");
            const fileName = fileNameSplit.slice(0, -1).join(".");
            const format = fileNameSplit.pop() || "";

            const buffer = new Uint8Array(await file.arrayBuffer());
            const url = URL.createObjectURL(file);

            // Get duration
            const audio = new Audio(url);
            const duration = await new Promise<number>((resolve, reject) => {
                audio.addEventListener("loadedmetadata", () => {
                    resolve(audio.duration);
                });
                audio.addEventListener("error", () => {
                    reject(new Error("Failed to load audio"));
                });
            });

            newFiles.push({
                id: `${Date.now()}-${i}`,
                file,
                buffer,
                name: fileName,
                format,
                size: file.size,
                duration,
                url,
            });
        }

        setFiles((prev) => [...prev, ...newFiles]);
        toast.success(`Added ${newFiles.length} file(s)`);
    }

    function handleRemoveFile(id: string) {
        playerReset();
        setFiles((prev) => {
            const file = prev.find((f) => f.id === id);
            if (file) {
                URL.revokeObjectURL(file.url);
            }
            return prev.filter((f) => f.id !== id);
        });
    }

    function handleDragStart(index: number) {
        setDragIndex(index);
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    function handleDrop(targetIndex: number) {
        if (dragIndex === null || dragIndex === targetIndex) {
            setDragIndex(null);
            return;
        }

        playerReset();
        const newFiles = [...files];
        const [moved] = newFiles.splice(dragIndex, 1);
        newFiles.splice(targetIndex, 0, moved);
        setFiles(newFiles);
        setDragIndex(null);
    }

    function handleDragEnd() {
        setDragIndex(null);
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (files.length < 2) {
            toast.error("Please add at least 2 audio files to merge");
            return;
        }

        setLoading(true);
        try {
            const input: AudioMergeInput = {
                buffers: files.map((f) => f.buffer),
                format: outputFormat,
            };

            const result = await audioMerge(input);
            if (!result.data) {
                throw new Error("Something went wrong while merging!");
            }

            setOutputData(result);

            const fileName = `merged_audio_blade_tools.${outputFormat}`;
            downloadBuffer(result.data, fileName, `audio/${outputFormat}`);
            toast.success("Successfully merged and downloaded!");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Something went wrong!",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClear() {
        files.forEach((file) => URL.revokeObjectURL(file.url));
        playerReset();
        setFiles([]);
        setOutputData(null);
        setOutputFormat("mp3");
    }

    const totalDuration = files.reduce((sum, file) => sum + file.duration, 0);

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start lg:gap-6 w-full"
        >
            {/* Left Side - File List and Player */}
            <div className="space-y-4">
                {files.length > 0 && (
                    <>
                        {/* Audio Player */}
                        <AudioMergePlayer
                            files={files}
                            totalDuration={totalDuration}
                            isPlaying={isPlaying}
                            currentTime={currentTime}
                            currentFileIndex={currentFileIndex}
                            onPlay={handlePlay}
                            onStop={handleStop}
                            onTimelineClick={handleTimelineClick}
                        />

                        {/* File List with Reordering */}
                        <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    Audio Files ({files.length})
                                </h3>
                                <span className="text-sm text-muted-foreground">
                                    Total: {formatDuration(totalDuration)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={file.id}
                                        draggable
                                        onDragStart={() =>
                                            handleDragStart(index)
                                        }
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center gap-2 p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-move ${
                                            dragIndex === index
                                                ? "border-blue-500 bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        {/* Drag Handle */}
                                        <div className="flex items-center justify-center text-muted-foreground">
                                            <RiDraggable className="size-4" />
                                        </div>

                                        {/* Order Number */}
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                            {index + 1}
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">
                                                {file.name}.{file.format}
                                            </div>
                                            <div className="text-sm text-muted-foreground flex gap-3">
                                                <span>
                                                    {formatDuration(
                                                        file.duration,
                                                    )}
                                                </span>
                                                <span>
                                                    {(
                                                        file.size /
                                                        (1024 * 1024)
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </span>
                                                <span className="uppercase">
                                                    {file.format}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleRemoveFile(file.id)
                                            }
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* File Upload Area */}
                <FileUpload
                    onFileSelect={handleFileSelect}
                    label={
                        files.length > 0
                            ? "Add More Audio Files"
                            : "Upload Audio Files"
                    }
                    name="inputfiles"
                    accept="audio/*"
                    multiple
                    helperText="Select multiple audio files to merge"
                    valueFiles={null}
                    className="h-48"
                />
            </div>

            {/* Right Side - Settings */}
            <div className="flex flex-col justify-center items-center gap-4 w-full">
                <div className="w-full border rounded-lg p-4 space-y-4">
                    {/* Output Format */}
                    <Field
                        htmlFor="format"
                        label="Output Format"
                        className="w-full"
                    >
                        <Select
                            onValueChange={(value) => setOutputFormat(value)}
                            value={outputFormat}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                {audioFormats.map((format) => (
                                    <SelectItem
                                        key={format}
                                        value={format}
                                        className="capitalize"
                                    >
                                        {format}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    {/* Merge Info */}
                    {files.length > 0 && (
                        <div className="space-y-2 p-3 bg-muted rounded-lg text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Files to merge:
                                </span>
                                <span className="font-medium">
                                    {files.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total duration:
                                </span>
                                <span className="font-medium">
                                    {formatDuration(totalDuration)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Output format:
                                </span>
                                <span className="font-medium uppercase">
                                    {outputFormat}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="w-full grid grid-cols-2 items-center gap-2">
                    <Button
                        type="submit"
                        disabled={loading || files.length < 2}
                        className="w-full"
                    >
                        {loading && <LoadingSpinner className="size-4" />}
                        <span>Merge</span>
                        {outputData && (
                            <span className="italic text-xs">
                                ({formatDuration(totalDuration)})
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
