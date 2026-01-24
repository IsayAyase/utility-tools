"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/lib/utils";

function Label({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

function Field({
    label,
    rightLabel,
    htmlFor,
    children,
    className,
}: {
    label: string;
    rightLabel?: string;
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn(className, "space-y-2")}>
            <Label
                htmlFor={htmlFor}
                className="flex items-center justify-between gap-2"
            >
                <span>{label}</span>
                {rightLabel && <span className="text-xs italic font-light text-muted-foreground">{rightLabel}</span>}
            </Label>
            {children}
        </div>
    );
}

export { Field, Label };
