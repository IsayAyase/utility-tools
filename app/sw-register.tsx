"use client";

import { useEffect } from "react";

export default function ServiceWorkRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator && process.env.NEXT_PUBLIC_MODE !== "development") {
            navigator.serviceWorker.register("/sw.js");
        }
    }, []);

    return null;
}
