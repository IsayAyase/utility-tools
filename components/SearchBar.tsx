"use client";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import type { Tool } from "@/lib/tools";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SearchBar({ toolsData }: { toolsData: Tool[] }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const route = useRouter();

    function handleSearch(tool: Tool) {
        const url = `/tools/${tool.category}/${tool.slug}`;
        route.push(url);
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k" && inputRef.current) {
                e.preventDefault();
                inputRef.current.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [inputRef]);

    return (
        <div className="relative w-full hidden md:block">
            <Combobox
                items={toolsData}
                filter={(item, q) => {
                    return (item as Tool).name
                        .toLowerCase()
                        .includes(q.toLowerCase());
                }}
            >
                <ComboboxInput
                    ref={inputRef}
                    className={"h-7.5"}
                    placeholder="Search Tools (Ctrl + K)"
                />
                <ComboboxContent className={"border"}>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                        {(item: Tool) => (
                            <ComboboxItem
                                onClick={() => handleSearch(item)}
                                key={item.slug}
                                value={item.name}
                            >
                                {item.name}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}
