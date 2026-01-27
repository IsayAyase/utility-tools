"use client";

import LayoutWrapper from "@/components/LayoutWrapper";

export default function TermsOfServicePage() {
    return (
        <LayoutWrapper>
            <main className="max-w-3xl mx-auto p-6 prose space-y-4">
                <div className="mb-6">
                    <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl">
                        Terms of Service
                    </h1>
                    <p className="md:text-lg">
                        Welcome to Blade Tools. By using this service, you agree to
                        these terms and conditions. If you do not agree, please
                        discontinue use.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">
                        Use of service
                    </h2>
                    <p className="text-sm md:text-base">
                        The service is provided as a client-side tool running
                        entirely in your browser. There is no transfer of your files
                        to our servers.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">
                        Intellectual property
                    </h2>
                    <p className="text-sm md:text-base">
                        The content provided by Blade Tools is for personal or
                        internal business use. You may not reproduce or redistribute
                        code or assets beyond what is allowed by license
                        governing tools.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">Disclaimers</h2>
                    <p className="text-sm md:text-base">
                        The service is provided on an "as is" basis. We do not
                        warrant that service will be error-free or
                        uninterrupted.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">Limitation of liability</h2>
                    <p className="text-sm md:text-base">
                        In no event shall Blade Tools be liable for any indirect,
                        incidental, special, or consequential damages arising out of
                        use of service.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">Governing law</h2>
                    <p className="text-sm md:text-base">
                        These terms are governed by and construed in accordance with
                        laws of the jurisdiction where Blade Tools operates.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">Changes to terms</h2>
                    <p className="text-sm md:text-base">
                        We may update these terms from time to time. Continued use
                        of the service after changes constitutes acceptance of new
                        terms.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl">Contact</h2>
                    <p className="text-sm md:text-base">
                        For questions about these Terms, contact support via
                        Blade Tools site.
                    </p>
                </div>
            </main>
        </LayoutWrapper>
    );
}
