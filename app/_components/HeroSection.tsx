import { mainData } from "@/contents/mainData";
import { racingSansOne } from "../fonts";
import CTAButton from "./CTAButton";
import HoverEffectText from "./HowerEffectText";

export default function HeroSection() {
    return (
        <div>
            <div className="my-6 sm:my-10 md:my-16 lg:my-24 flex items-center justify-center">
                <div>
                    {/* top text */}
                    <div className="flex flex-col items-center justify-center sm:gap-1 md:gap-2 lg:gap-4">
                        <h2 className="font-semibold text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl cursor-default">
                            <HoverEffectText text="Your files" />
                            <span className="text-red-500">.</span>{" "}
                            <HoverEffectText text="Your device" />
                            <span className="text-red-500">.</span>{" "}
                            <HoverEffectText text="Period" />
                            <span className="text-red-500">.</span>
                        </h2>
                        <p className="text-center text-xs sm:text-sm md:text-lg lg:text-xl">
                            {mainData.subHeroLine}
                        </p>
                    </div>

                    {/* center text */}
                    <div className="flex flex-col items-center justify-center my-14 md:my-12 lg:my-10 relative">
                        <h1
                            className={`${racingSansOne.className} text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-center cursor-default mask-b-from-0%`}
                        >
                            {mainData.title}
                        </h1>
                    </div>

                    {/* bottom feature grid */}
                    <div className="py-4 relative"> 
                        <div className="grid grid-cols-1 md:grid-cols-3 mask-l-from-90% mask-r-from-90% backdrop-blur-[2px]">
                            {mainData.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`px-3 py-4 ${
                                        index == 0
                                            ? "text-center lg:text-end"
                                            : index == 1
                                              ? "text-center lg:text-center"
                                              : "text-center lg:text-start"
                                    }`}
                                >
                                    <h5 className="text-sm md:text-base lg:text-xl">
                                        {feature.line}
                                    </h5>
                                    <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                                        {feature.subline}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* cta button */}
                    <div className="flex justify-center py-14 overflow-hidden">
                        <CTAButton />
                    </div>

                    {/* more tools alert style card */}
                    <div className="flex justify-center">
                        <div className=" py-4 px-6 border rounded-lg w-fit flex gap-2 items-center">
                            <div className="relative p-1 w-fit">
                                <span className="absolute top-1/2 left-0 -translate-y-1/2 p-1 rounded-full bg-blue-500 animate-ping" />
                                <span className="absolute top-1/2 left-0 -translate-y-1/2 p-1 rounded-full bg-blue-500" />
                            </div>
                            <span className="text-muted-foreground animate-pulse">
                                More tools will be added soon!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
