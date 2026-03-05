"use client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getPdfInfo, pdfMetadataUpdater } from "@/lib/tools/document";
import type { PdfMetadataUpdaterInput } from "@/lib/tools/document/type";
import { downloadBuffer } from "@/lib/tools/helper";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PdfMetadataUpdaterPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [fields, setFields] = useState<PdfMetadataUpdaterInput | null>(null);
    const [orgFileName, setOrgFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!files) return;
        const file = files[0];
        if (!file) return;

        const ops = async () => {
            setLoading(true);
            try {
                setOrgFileName(file.name.split(".")[0]);

                const buffer = new Uint8Array(await file.arrayBuffer());
                if (!buffer) {
                    throw new Error("Error getting buffer!");
                }

                const pdfInfo = await getPdfInfo({
                    buffer,
                });
                if (!pdfInfo.data) {
                    throw new Error("Something went wrong! While generating.");
                }

                setFields({
                    buffer,
                    title: pdfInfo.data.metadata.title,
                    author: pdfInfo.data.metadata.author,
                    subject: pdfInfo.data.metadata.subject,
                    keywords: pdfInfo.data.metadata.keywords,
                    creator: pdfInfo.data.metadata.creator,
                    producer: pdfInfo.data.metadata.producer,
                });
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong!",
                );
            } finally {
                setLoading(false);
            }
        };

        ops();
    }, [files]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!fields) {
                throw new Error("No file selected!");
            }

            const outputBuffer = await pdfMetadataUpdater({
                ...fields,
            });
            console.log(outputBuffer);
            
            if (!outputBuffer.data) {
                throw new Error("Something went wrong! While converting.");
            }

            const fileName = `${orgFileName}_blade_tools.pdf`;
            downloadBuffer(outputBuffer.data, fileName, "application/pdf");
            toast.success("Successfully converted!");
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Something went wrong!",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFields((p) => {
            if (
                !p ||
                name === "buffer" ||
                name === "creationDate" ||
                name === "modifiedDate"
            )
                return p;

            return {
                ...p,
                [name]: name === "keywords" ? value.split(",") : value,
            };
        });
    }

    function handleClear() {
        setFiles(null);
        setFields(null);
        setOrgFileName(null);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center gap-6 max-w-md w-full m-auto"
        >
            <FileUpload
                onFileSelect={setFiles}
                label=""
                name="inputfiles"
                accept=".pdf"
                required
                helperText=""
                valueFiles={files}
            />

            {fields && (
                <div className="space-y-4 w-full">
                    <Field label="Title" htmlFor="title">
                        <Input
                            name="title"
                            value={fields.title}
                            onChange={handleFieldChange}
                            placeholder="Title"
                        />
                    </Field>
                    <Field label="Author" htmlFor="author">
                        <Input
                            name="author"
                            value={fields.author}
                            onChange={handleFieldChange}
                            placeholder="Author"
                        />
                    </Field>
                    <Field label="Subject" htmlFor="subject">
                        <Input
                            name="subject"
                            value={fields.subject}
                            onChange={handleFieldChange}
                            placeholder="Subject"
                        />
                    </Field>
                    <Field label="Keywords" htmlFor="keywords">
                        <Input
                            name="keywords"
                            value={fields.keywords?.join(", ") || ""}
                            onChange={handleFieldChange}
                            placeholder="Keywords"
                        />
                    </Field>
                    <Field label="Creator" htmlFor="creator">
                        <Input
                            name="creator"
                            value={fields.creator}
                            onChange={handleFieldChange}
                            placeholder="Creator"
                        />
                    </Field>
                    <Field label="Producer" htmlFor="producer">
                        <Input
                            name="producer"
                            value={fields.producer}
                            onChange={handleFieldChange}
                            placeholder="Producer"
                        />
                    </Field>
                </div>
            )}

            <div className="w-full grid grid-cols-2 items-center gap-2">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <LoadingSpinner className="size-4" />}
                    <span>Update and Download</span>
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
