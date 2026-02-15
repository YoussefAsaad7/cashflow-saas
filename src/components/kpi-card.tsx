import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, LucideIcon, Loader2 } from "lucide-react";

type KpiCardProps = {
    title: string;
    value?: string | number;
    icon?: LucideIcon;
    className?: string;
    color?: string;
    trend?: number; // change percentage
    isLoading?: boolean;
    isError?: boolean;
};

export function KpiCard({ title, value, icon: Icon, className, color, trend, isLoading, isError }: KpiCardProps) {

    const borderStyle = color ? { borderLeftColor: color } : undefined;
    const borderClass = color ? `border-l-4` : `border-l-4 border-l-primary`;

    return (
        <Card className={cn(borderClass, className, "relative overflow-hidden")} style={borderStyle} >
            <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-xs">
                    {Icon && <Icon className="h-3 w-3" />}
                    {title}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Error Overlay */}
                {isError && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="text-xs text-destructive font-medium bg-background/80 px-2 py-1 rounded shadow-sm border border-destructive/20">
                            Error loading data
                        </span>
                    </div>
                )}

                <div className={cn("flex items-center justify-between", isError && "opacity-20")}>
                    <div className="text-2xl font-bold">
                        {isLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                            value
                        )}
                    </div>
                    {(trend != undefined || isLoading) && (
                        <div className={cn("flex items-center text-xs",
                            !isLoading && trend! >= 0 ? "text-success" : "text-destructive")}>
                            {isLoading ? (
                                <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                            ) : (
                                <>
                                    {trend! >= 0 ? (
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    ) : (<ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    )}
                                    {Math.abs(trend!)}%
                                </>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}