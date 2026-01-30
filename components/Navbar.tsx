import { racingSansOne } from "@/app/fonts";
import { toolsArray } from "@/lib/tools";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import SearchBar from "./SearchBar";
import ToogleMode from "./ToogleMode";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <div className="w-full">
            <nav className="max-w-9xl mx-auto max-h-16 h-full px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <h3
                        className={`text-xl italic font-semibold tracking-wide ${racingSansOne.className}`}
                    >
                        BladeTools
                    </h3>
                </Link>

                <div className="flex items-center gap-2 md:gap-4 h-5">
                    <SearchBar toolsData={toolsArray} />

                    <Link href={"/tools"}>
                        <Button size={"sm"} variant="outline">
                            <span>Tools</span>
                            <Wrench />
                        </Button>
                    </Link>

                    <Link target="_blank" href={"https://x.com/prabhatlabs"}>
                        <Button size={"icon-sm"} variant="outline">
                            <FaXTwitter />
                        </Button>
                    </Link>

                    <Link target="_blank" href={"https://github.com/IsayAyase"}>
                        <Button size={"icon-sm"} variant="outline">
                            <FaGithub />
                        </Button>
                    </Link>

                    <ToogleMode />
                </div>
            </nav>
        </div>
    );
}
