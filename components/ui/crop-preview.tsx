"use client";

import { bufferToBlob } from "@/lib/tools/helper";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface CropPreviewProps {
    buffer?: Uint8Array | null;
    left: number;
    top: number;
    right: number;
    bottom: number;
    imageWidth: number;
    imageHeight: number;
    onCropChange: (l: number, t: number, r: number, b: number) => void;
}

type Crop = { left: number; top: number; right: number; bottom: number };

export default function CropPreview({
    buffer,
    left,
    top,
    right,
    bottom,
    imageWidth,
    imageHeight,
    onCropChange,
}: CropPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [url, setUrl] = useState("");
    const [localCrop, setLocalCrop] = useState<Crop>({
        left,
        top,
        right,
        bottom,
    });

    const [drag, setDrag] = useState<string | null>(null);
    // const [start, setStart] = useState({ x: 0, y: 0 });
    const startRef = useRef({ x: 0, y: 0 });

    const [imgBox, setImgBox] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    });

    /* ---------- object URL ---------- */
    useEffect(() => {
        if (!buffer) {
            setUrl("");
            return;
        }
        const u = URL.createObjectURL(bufferToBlob(buffer, "image/*"));
        setUrl(u);
        return () => URL.revokeObjectURL(u);
    }, [buffer]);

    /* ---------- sync from props ---------- */
    useEffect(() => {
        setLocalCrop((c) =>
            c.left === left &&
            c.top === top &&
            c.right === right &&
            c.bottom === bottom
                ? c
                : { left, top, right, bottom },
        );
    }, [left, top, right, bottom]);

    /* ---------- compute rendered image box (object-contain math) ---------- */
    useEffect(() => {
        if (!containerRef.current) return;

        const update = () => {
            const rect = containerRef.current!.getBoundingClientRect();
            const scale = Math.min(
                rect.width / imageWidth,
                rect.height / imageHeight,
            );

            const w = imageWidth * scale;
            const h = imageHeight * scale;

            setImgBox({
                left: (rect.width - w) / 2,
                top: (rect.height - h) / 2,
                width: w,
                height: h,
            });
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [imageWidth, imageHeight]);

    /* ---------- initialize full crop AFTER imgBox exists ---------- */
    useEffect(() => {
        if (
            imgBox.width > 0 &&
            imgBox.height > 0 &&
            left === 0 &&
            top === 0 &&
            right === 0 &&
            bottom === 0
        ) {
            const full = {
                left: 0,
                top: 0,
                right: imageWidth,
                bottom: imageHeight,
            };
            setLocalCrop(full);
            onCropChange(0, 0, imageWidth, imageHeight);
        }
    }, [
        imgBox.width,
        imgBox.height,
        left,
        top,
        right,
        bottom,
        imageWidth,
        imageHeight,
        onCropChange,
    ]);

    /* ---------- mouse ---------- */
    const onDown = (p: string, e: React.MouseEvent) => {
        e.preventDefault();
        setDrag(p);
        // setStart({ x: e.clientX, y: e.clientY });
        startRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMove = useCallback(
        (e: MouseEvent) => {
            if (!drag || !imgBox.width || !imgBox.height) return;

            const dx = e.clientX - startRef.current.x;
            const dy = e.clientY - startRef.current.y;

            
            
            startRef.current = { x: e.clientX, y: e.clientY };

            const sx = imageWidth / imgBox.width;
            const sy = imageHeight / imgBox.height;

            setLocalCrop((crop) => {
                let { left, top, right, bottom } = crop;
                
                if (drag.includes("left")) left += dx * sx;
                if (drag.includes("right")) right += dx * sx;
                if (drag.includes("top")) top += dy * sy;
                if (drag.includes("bottom")) bottom += dy * sy;
                
                console.log(dx, dy);
                
                return {
                    left: Math.max(0, Math.min(left, right - 1)),
                    top: Math.max(0, Math.min(top, bottom - 1)),
                    right: Math.min(imageWidth, Math.max(right, left + 1)),
                    bottom: Math.min(imageHeight, Math.max(bottom, top + 1)),
                };
            });
        },
        [drag, imageWidth, imageHeight, imgBox],
    );

    const onUp = useCallback(() => {
        if (drag) {
            onCropChange(
                Math.round(localCrop.left),
                Math.round(localCrop.top),
                Math.round(localCrop.right),
                Math.round(localCrop.bottom),
            );
        }
        setDrag(null);
    }, [drag, localCrop, onCropChange]);

    useEffect(() => {
        if (!drag) return;
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        return () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        };
    }, [drag, onMove, onUp]);

    if (!url || !imgBox.width) {
        return (
            <div
                ref={containerRef}
                className="relative h-72 md:h-96 lg:h-120 xl:h-150 w-full border rounded bg-muted/30"
            />
        );
    }

    /* ---------- crop → px ---------- */
    const cropPx = {
        left: imgBox.left + (localCrop.left / imageWidth) * imgBox.width,
        top: imgBox.top + (localCrop.top / imageHeight) * imgBox.height,
        width:
            ((localCrop.right - localCrop.left) / imageWidth) * imgBox.width -
            2, // 2px for border left and right
        height:
            ((localCrop.bottom - localCrop.top) / imageHeight) * imgBox.height -
            2, // 2px for border top and bottom
    };

    const cursor: Record<string, string> = {
        topleft: "nwse-resize",
        bottomright: "nwse-resize",
        topright: "nesw-resize",
        bottomleft: "nesw-resize",
    };

    return (
        <div
            ref={containerRef}
            className="relative h-72 md:h-96 lg:h-120 xl:h-150 w-full overflow-hidden border rounded bg-muted/30"
        >
            <Image
                src={url}
                alt="preview"
                fill
                className="object-contain select-none"
                draggable={false}
            />

            {/* masks */}
            <div
                className="absolute bg-black/60"
                style={{
                    left: imgBox.left,
                    top: imgBox.top,
                    width: imgBox.width,
                    height: cropPx.top - imgBox.top,
                }}
            />
            <div
                className="absolute bg-black/60"
                style={{
                    left: imgBox.left,
                    top: cropPx.top + cropPx.height,
                    width: imgBox.width,
                    height:
                        imgBox.top +
                        imgBox.height -
                        (cropPx.top + cropPx.height),
                }}
            />
            <div
                className="absolute bg-black/60"
                style={{
                    left: imgBox.left,
                    top: cropPx.top,
                    width: cropPx.left - imgBox.left,
                    height: cropPx.height,
                }}
            />
            <div
                className="absolute bg-black/60"
                style={{
                    left: cropPx.left + cropPx.width,
                    top: cropPx.top,
                    width:
                        imgBox.left +
                        imgBox.width -
                        (cropPx.left + cropPx.width),
                    height: cropPx.height,
                }}
            />

            {/* crop box */}
            <div className="absolute border border-white" style={cropPx}>
                {[
                    {
                        id: "topleft",
                        x: "left",
                        y: "top",
                        t: "-translate-x-1/2 -translate-y-1/2",
                    },
                    {
                        id: "topright",
                        x: "right",
                        y: "top",
                        t: "translate-x-1/2 -translate-y-1/2",
                    },
                    {
                        id: "bottomleft",
                        x: "left",
                        y: "bottom",
                        t: "-translate-x-1/2 translate-y-1/2",
                    },
                    {
                        id: "bottomright",
                        x: "right",
                        y: "bottom",
                        t: "translate-x-1/2 translate-y-1/2",
                    },
                ].map(({ id, x, y, t }) => (
                    <div
                        key={id}
                        onMouseDown={(e) => onDown(id, e)}
                        className={`absolute h-4 w-4 rounded-full bg-white border border-blue-500 ${t}`}
                        style={{
                            cursor: cursor[id],
                            [x]: 0,
                            [y]: 0,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
