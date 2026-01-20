"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
