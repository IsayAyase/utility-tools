"use client";

import { useEffect } from "react";

export default function ServiceWorkRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js");
        }
    }, []);

    return null;
}
