export default function HoverEffectText({ text }: { text: string }) {
    const chars = text.split("");
    return (
        <>
            {chars.map((char, index) => (
                <span
                    key={index}
                    className="hover:text-red-500 transition-colors duration-200"
                >
                    {char}
                </span>
            ))}
        </>
    );
}
