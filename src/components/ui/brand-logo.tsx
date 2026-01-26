import { DollarSign } from "lucide-react";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
    showText?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
};

const sizes = {
    sm: {
        wrapper: "gap-2",
        iconWrapper: "size-8",
        iconSize: "size-4",
        text: "text-sm"
    },
    md: {
        wrapper: "gap-3",
        iconWrapper: "size-12",
        iconSize: "size-6",
        text: "text-lg"
    },
    lg: {
        wrapper: "gap-3",
        iconWrapper: "size-16",
        iconSize: "size-8",
        text: "text-xl"
    }
}

export default function BrandLogo({showText = true, size = "md", className = ""}: BrandLogoProps) {
    const s = sizes[size];

    return (
        <div className={cn("flex items-center", s.wrapper, className)}>
            <div className={cn("flex items-center justify-center aspect-square rounded-lg text-primary-foreground bg-primary", s.iconWrapper)}>
                <DollarSign className={s.iconSize} />
            </div>
            {showText && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CashFlow</span>
                  <span className="truncate text-xs text-muted-foreground">Analytics</span>
                </div>
            )}
        </div>
    );
}