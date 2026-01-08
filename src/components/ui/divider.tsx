import { cn } from "@/lib/cn";

type DividerProps = {
    label?: string;
    className?: string;
};

export default function Divider({ label, className }: DividerProps) {
    return (
        <div className={cn("relative flex items-center", className)}>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            {label && (
                <span className="mx-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                </span>
            )}
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
        </div>
    );
}