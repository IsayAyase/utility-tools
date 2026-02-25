"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecoder } from "@/lib/tools/developer";
import { useState } from "react";
import { toast } from "sonner";

export default function JwtDecoderPage() {
    const [token, setToken] = useState<string>("");
    const [header, setHeader] = useState<Record<string, unknown> | null>(null);
    const [payload, setPayload] = useState<Record<string, unknown> | null>(null);
    const [signature, setSignature] = useState<string>("");
    const [error, setError] = useState<string>("");

    function handleDecode() {
        if (!token.trim()) {
            toast.error("Please enter a JWT token");
            return;
        }

        const result = jwtDecoder({
            token,
            complete: true,
        });

        if (result.success && result.data) {
            setHeader(result.data.header);
            setPayload(result.data.payload);
            setSignature(result.data.signature || "");
            setError("");
            toast.success("Token decoded!");
        } else {
            setHeader(null);
            setPayload(null);
            setSignature("");
            setError(result.error || "Invalid JWT token");
            toast.error(result.error || "Invalid JWT token");
        }
    }

    function handleClear() {
        setToken("");
        setHeader(null);
        setPayload(null);
        setSignature("");
        setError("");
    }

    return (
        <div className="flex flex-col gap-4 max-w-xl w-full m-auto">
            <Field label="JWT Token" htmlFor="token" className="w-full">
                <Textarea
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIs..."
                    rows={4}
                    className="font-mono text-xs"
                />
            </Field>

            {/* Output Section - Always visible */}
            {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                    Error: {error}
                </div>
            )}

            <Field label="Header" htmlFor="header" className="w-full">
                <Textarea
                    id="header"
                    value={header ? JSON.stringify(header, null, 2) : ""}
                    readOnly
                    placeholder="Header will appear here..."
                    rows={4}
                    className="font-mono bg-secondary text-xs"
                />
            </Field>

            <Field label="Payload" htmlFor="payload" className="w-full">
                <Textarea
                    id="payload"
                    value={payload ? JSON.stringify(payload, null, 2) : ""}
                    readOnly
                    placeholder="Payload will appear here..."
                    rows={8}
                    className="font-mono bg-secondary text-xs"
                />
            </Field>

            <Field label="Signature" htmlFor="signature" className="w-full">
                <Textarea
                    id="signature"
                    value={signature}
                    readOnly
                    placeholder="Signature will appear here..."
                    rows={2}
                    className="font-mono bg-secondary text-xs"
                />
            </Field>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button onClick={handleDecode} className="flex-1">
                    Decode Token
                </Button>
                <Button onClick={handleClear} variant="outline" className="flex-1">
                    Clear
                </Button>
            </div>
        </div>
    );
}
