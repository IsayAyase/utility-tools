import { bytesToSize } from "@/lib/tools/helper";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "./label";

export default function FileUpload({
    name,
    label,
    accept = ".pdf",
    required = false,
    helperText,
    valueFiles = null,
    onFileSelect,
    multiple = false,
}: {
    name: string;
    label: string;
    accept?: string;
    required?: boolean;
    helperText?: string;
    valueFiles?: FileList | null;
    onFileSelect?: (files: FileList | null) => void;
    multiple?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileNames, setFileNames] = useState<string[] | null>(null);
    const [size, setSize] = useState(0);

    useEffect(() => {
        if (valueFiles) {
            setFileNames(Array.from(valueFiles).map((file) => file.name));
            const file = valueFiles[0];
            if (file) {
                setSize(file.size);
            }
        } else {
            const ele = inputRef.current;
            if (ele) {
                ele.value = "";
                ele.files = null;
            }
            setFileNames(null);
            onFileSelect?.(null);
            setSize(0);
        }
    }, [valueFiles]);

    return (
        <div className="space-y-2 w-full">
            <Label>{label}</Label>

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files && inputRef.current) {
                        inputRef.current.files = e.dataTransfer.files;
                        onFileSelect?.(files);
                    }
                }}
                className="
                flex cursor-pointer flex-col items-center justify-center
                rounded-md border border-dashed border-muted-foreground/40
                bg-muted/30 px-6 py-10 text-center
                transition hover:bg-muted/50
                "
            >
                <Upload className="mb-2 h-5 w-5 text-muted-foreground" />

                <p className="font-medium text-foreground text-sm">
                    {multiple
                        ? "Click to choose files or drag here"
                        : "Click to choose file or drag here"}
                </p>

                {accept && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {`(${accept})`}
                    </p>
                )}

                {helperText && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {helperText}
                    </p>
                )}

                {fileNames && fileNames?.length > 1 ? (
                    <ul className="mt-2 text-xs text-foreground truncate">
                        {fileNames.slice(0, 2).map((fileName) => (
                            <li key={fileName}>{fileName}</li>
                        ))}

                        {fileNames.length > 2 && (
                            <li className="text-muted-foreground">
                                +{fileNames.length - 2} more
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="mt-2 text-xs text-foreground">
                        <span className="">
                            {fileNames &&
                            fileNames[0] &&
                            fileNames[0].length > 20
                                ? fileNames?.[0].slice(0, 20) + "..."
                                : fileNames?.[0]}
                        </span>
                        <span>{size > 0 && `(${bytesToSize(size)})`}</span>
                    </p>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    required={required}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        onFileSelect?.(files);
                    }}
                />
            </div>
        </div>
    );
}
