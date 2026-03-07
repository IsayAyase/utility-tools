"use client";

import { useEffect } from "react";

export default function ServiceWorkRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator && process.env.NODE_ENV !== "development") {
            navigator.serviceWorker.register("/sw.js");
        }
    }, []);

    return null;
}
