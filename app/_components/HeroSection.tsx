import { mainData } from "@/contents/mainData";
import Link from "next/link";
import { racingSansOne } from "../fonts";
import HoverEffectText from "./HowerEffectText";

export default function HeroSection() {
    return (
        <div>
            {" "}
            {/* Dashed Top Fade Grid */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundImage: `
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px)
      `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 6px,
              transparent 6px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 6px,
              transparent 6px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
                    WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />
            <div className="my-6 sm:my-10 md:my-16 lg:my-24 flex items-center justify-center">
                <div>
                    {/* top text */}
                    <div className="flex flex-col items-center justify-center sm:gap-1 md:gap-2 lg:gap-4">
                        <h2 className="font-semibold text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl cursor-default">
                            <HoverEffectText text="Your files" />
                            <span className="text-red-500">.</span>{" "}
                            <HoverEffectText text="Your device" />
                            <span className="text-red-500">.</span>{" "}
                            <HoverEffectText text="Period" />
                            <span className="text-red-500">.</span>
                        </h2>
                        <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl">
                            {mainData.subHeroLine}
                        </p>
                    </div>

                    {/* center text */}
                    <div className="flex flex-col items-center justify-center my-14 md:my-12 lg:my-10">
                        <h1
                            className={`${racingSansOne.className} text-6xl md:text-7xl lg:text-9xl text-center cursor-default`}
                        >
                            <HoverEffectText text={"BladeTools"} />
                        </h1>
                    </div>

                    {/* bottom feature grid */}
                    <div className="py-4 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background via-background/50 to-transparent z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background via-background/50 to-transparent z-10"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 md:border-y">
                            {mainData.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`px-6 py-4 ${
                                        index == 0
                                            ? "border-y md:border-y-0 text-center lg:text-end"
                                            : index == 1
                                              ? "border-b md:border-b-0 md:border-l text-center lg:text-center"
                                              : "border-b md:border-b-0 md:border-l text-center lg:text-start"
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
                    <div className="flex justify-center py-14">
                        <Link href={mainData.ctaBtn.url}>
                            <button
                                className={`w-50 md:w-55 lg:w-60 py-2 relative hover:scale-[102%] transition-all duration-200 border bg-foreground font-medium text-background rounded-lg`}
                            >
                                <span className="">{mainData.ctaBtn.text}</span>

                                <span className="h-4 w-15 bg-background/20 absolute rotate-125 -left-60 animate-move-l-r" />
                                <span className="h-4 w-15 bg-background/10 absolute rotate-125 -left-60 animate-move-l-r translate-x-6" />
                            </button>
                        </Link>
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
