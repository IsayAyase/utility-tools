"use client";

import LayoutWrapper from "@/components/LayoutWrapper";

export default function PrivacyPolicyPage() {
    return (
        <LayoutWrapper>
            <main className="max-w-3xl mx-auto p-6 prose space-y-4">
                <div className="mb-6">
                    <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="md:text-lg">
                        This Privacy Policy describes how Blade Tools (the
                        “Service”) collects, uses, and protects information when
                        you use our web app. We are committed to protecting your
                        privacy and your data.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">
                        What data we collect
                    </h2>
                    <p className="text-sm md:text-base">
                        We do not collect or transmit your files to a remote
                        server. All processing happens client-side in your
                        browser, and your files never leave your device.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">
                        How we use data
                    </h2>
                    <p className="text-sm md:text-base">
                        Since we do not upload your data, we do not use it for
                        analytics, advertising, or any other purposes. Your
                        files are used only to perform the requested operations
                        in your browser.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">
                        Data retention
                    </h2>
                    <p className="text-sm md:text-base">
                        Because processing is client-side, no data is stored on
                        our servers after completion of your tasks unless you
                        explicitly download results.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">Security</h2>
                    <p className="text-sm md:text-base">
                        We rely on the security of your device and your browser.
                        There is no server-side storage of your files in this
                        workflow.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">
                        Your rights
                    </h2>
                    <p className="text-sm md:text-base">
                        You can delete data from your session at any time by
                        clearing the workspace or closing the tab. If you have
                        concerns about a particular operation, contact us.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">Contact</h2>
                    <p className="text-sm md:text-base">
                        If you have questions about this policy, please contact
                        support through the Blade Tools site.
                    </p>
                </div>
            </main>
        </LayoutWrapper>
    );
}
