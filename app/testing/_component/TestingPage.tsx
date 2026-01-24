"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadBuffer } from "@/lib/tools/helper";
import { imageFormatConvert } from "@/lib/tools/image";
import { useState } from "react";

const TestingPage = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const buffer = files
            ? new Uint8Array(await files[0].arrayBuffer())
            : null;
        if (!buffer) {
            throw new Error("No buffer");
        }
        const result = await imageFormatConvert({
            buffer,
            format: "ico",
            icoSize: 70,
            quality: 20,
        });

        if (!result.data) {
            throw new Error("No data");
        }
        downloadBuffer(result.data, "test.ico", "image/ico");
    }
    // console.log(tools);

    return (
        <div>
            <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 max-w-sm mx-auto"
            >
                <Input
                    onChange={(e) => setFiles(e.target.files)}
                    type="file"
                    multiple
                />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default TestingPage;
