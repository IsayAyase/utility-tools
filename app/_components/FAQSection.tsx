"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MdHelpOutline } from "react-icons/md";

const faqs = [
    {
        question: "Is BladeTools free to use?",
        answer: "Yes! BladeTools is completely free to use. We believe that privacy and security should be accessible to everyone. No subscription, no hidden fees, no credit card required.",
    },
    {
        question: "Are my files uploaded to a server?",
        answer: "No. All processing happens locally in your browser using WebAssembly. Your files never leave your device. This is the core of our privacy-first approach.",
    },
    {
        question: "What file formats are supported?",
        answer: "BladeTools supports a wide range of formats including PDF, DOCX, JPG, PNG, WebP, MP3, WAV, MP4, MKV, and WebM. Specific tools have their own format support listed on their respective pages.",
    },
    {
        question: "Is there a file size limit?",
        answer: "Unlike cloud-based tools, BladeTools processes files using your device's RAM. The limit depends on your available memory. Most users can handle files up to 500MB without issues.",
    },
    {
        question: "Do you store or keep my files?",
        answer: "Absolutely not. We cannot see or store your files because they are processed entirely client-side. Once you close the browser tab, all data is wiped from memory.",
    },
    {
        question: "Can I use BladeTools for commercial purposes?",
        answer: "Yes! BladeTools is perfect for business use. Since no data is transmitted, it complies with GDPR, HIPAA, and other privacy regulations, making it ideal for handling sensitive corporate documents.",
    },
];

export default function FAQSection() {
    return (
        <section className="my-12 md:my-25">
            <div className="grid grid-cols-1 lg:grid-cols-2 sm:gap-8 lg:gap-12">
                <div className="flex flex-col justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                        <MdHelpOutline className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-light mb-4">Got Questions?</h2>
                    <p className="text-muted-foreground mb-6">
                        {`We're here to help. Find answers to the most common
                        questions about BladeTools and our privacy-first
                        approach to file processing.`}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-card/50 border">
                            <div className="text-2xl font-semibold text-red-500">
                                100%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Client-Side
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-card/50 border">
                            <div className="text-2xl font-semibold text-red-500">
                                0
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Files Uploaded
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
