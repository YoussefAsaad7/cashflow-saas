import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
    showText?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
};

const sizes = {
    sm: {
        wrapper: "gap-2",
        icon: "w-7 h-7 rounded-lg",
        text: "text-lg"
    },
    md: {
        wrapper: "gap-3",
        icon: "w-10 h-10 rounded-xl",
        text: "text-2xl"
    },
    lg: {
        wrapper: "gap-3",
        icon: "w-12 h-12 rounded-2xl",
        text: "text-3xl"
    }
}

export default function BrandLogo({showText = true, size = "md", className = ""}: BrandLogoProps) {
    const s = sizes[size];

    return (
        <div className={cn("flex items-center", s.wrapper, className)}>
            <div className={cn("flex items-center justify-center bg-primary-600 text-white shadow-lg shadow-primary-500/30", s.icon)}>
                <TrendingUp className="w-1/2 h-1/2" />
            </div>
            {showText && (
                <span className={cn("font-bold tracking-tight text-slate-900 dark:text-white", s.text)}>
                    CashFlow
                </span>
            )}
        </div>
    );
}