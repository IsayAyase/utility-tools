import { Racing_Sans_One, Ubuntu } from "next/font/google";

export const ubuntu = Ubuntu({
    subsets: ["latin"],
    variable: "--font-ubuntu",
    weight: ["300", "400", "500", "700"],
});

export const racingSansOne = Racing_Sans_One({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-racing",
});