import LayoutWrapper from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { mainData } from "@/contents/mainData";
import Link from "next/link";
import { racingSansOne } from "./fonts";

export default function Home() {
    return (
        <LayoutWrapper>
            <div className="py-24 flex items-center justify-center">
                <div>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h2 className="font-semibold text-5xl">
                            {mainData.heroLine}
                        </h2>
                        <p className="text-xl">{mainData.subHeroLine}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center my-10">
                        <h1 className={`${racingSansOne.className} text-9xl`}>
                            {mainData.title}
                        </h1>
                    </div>

                    <div className="py-4 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background via-background/50 to-transparent z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background via-background/50 to-transparent z-10"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 md:border-y">
                            {mainData.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`px-6 py-4 ${
                                        index == 0
                                            ? "border-y md:border-y-0 text-end"
                                            : index == 1
                                              ? "border-b md:border-b-0 md:border-l text-center"
                                              : "border-b md:border-b-0 md:border-l"
                                    }`}
                                >
                                    <h5 className="text-xl">{feature.line}</h5>
                                    <p className="text-muted-foreground">
                                        {feature.subline}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center py-14">
                        <Link href={mainData.ctaBtn.url}>
                            <Button
                                size={"lg"}
                                variant="default"
                                className={`w-60`}
                            >
                                <span>{mainData.ctaBtn.text}</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
}
