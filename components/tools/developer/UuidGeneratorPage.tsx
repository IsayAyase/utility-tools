"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uuidGenerator } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function UuidGeneratorPage() {
    const [uuid, setUuid] = useState<string>("");

    function handleGenerate() {
        const result = uuidGenerator();

        if (result.success && result.data) {
            setUuid(result.data);
            toast.success("UUID generated!");
        } else {
            toast.error(result.error || "Failed to generate UUID");
        }
    }

    function handleCopy() {
        if (uuid) {
            navigator.clipboard.writeText(uuid);
            toast.success("Copied to clipboard!");
        }
    }

    function handleClear() {
        setUuid("");
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 max-w-md w-full m-auto">
            <Field label="Generated UUID" htmlFor="uuid" className="w-full">
                <Input
                    id="uuid"
                    value={uuid}
                    readOnly
                    placeholder="Click Generate to create a UUID"
                    className="font-mono text-center"
                />
            </Field>

            <div className="w-full grid grid-cols-2 items-center gap-2">
                <Button onClick={handleGenerate} className="w-full">
                    Generate
                </Button>
                <Button
                    onClick={handleCopy}
                    variant="outline"
                    disabled={!uuid}
                    className="w-full"
                >
                    Copy
                </Button>
            </div>

            {uuid && (
                <Button onClick={handleClear} variant="outline" className="w-full">
                    Clear
                </Button>
            )}
        </div>
    );
}
