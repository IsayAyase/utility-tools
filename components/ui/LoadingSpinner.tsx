import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "relative flex items-center justify-center size-5",
                className,
            )}
        >
            <style>{`
                @keyframes expand {
                    0%, 100% { transform: translate(var(--tx-near), var(--ty-near)); }
                    50%      { transform: translate(var(--tx-far),  var(--ty-far));  }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .sw-spinner {
                    animation: spin 1.4s linear infinite;
                }
                .sw-dot {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 22%; height: 22%;
                    border-radius: 50%;
                    background: currentColor;
                    margin-top: -11%; margin-left: -11%;
                    animation: expand 1.4s ease-in-out infinite;
                }
            `}</style>
            <div className="sw-spinner w-full h-full relative">
                {[
                    { near: ["-100%", "-100%"], far: ["-150%", "-150%"] },
                    { near: ["100%", "-100%"], far: ["150%", "-150%"] },
                    { near: ["100%", "100%"], far: ["150%", "150%"] },
                    { near: ["-100%", "100%"], far: ["-150%", "150%"] },
                ].map(({ near, far }, i) => (
                    <span
                        key={i}
                        className="sw-dot"
                        style={
                            {
                                "--tx-near": near[0],
                                "--ty-near": near[1],
                                "--tx-far": far[0],
                                "--ty-far": far[1],
                            } as React.CSSProperties
                        }
                    />
                ))}
            </div>
        </div>
    );
}
