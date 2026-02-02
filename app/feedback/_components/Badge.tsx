export function Badge({ variant = "default", children, className = "" }: { 
    variant?: "default" | "secondary" | "destructive", 
    children: React.ReactNode, 
    className?: string 
}) {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    const variantClasses = {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground"
    };
    
    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}