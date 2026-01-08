import { cn } from "@/lib/cn";


type Avatar = {
    id: number | string;
    name?: string;
    src?: string;
}

type AvatarGroupProps = {
    avatars: Avatar[];
    size?: "sm" | "md";
    max?: number;
    className?: string;
}

const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm"
}

export default function AvatarGroup({ avatars, size = "md", max = 4, className = "" }: AvatarGroupProps) {

    const s = sizes[size];
    const visible = avatars.slice(0, max);
    const remaining = avatars.length - visible.length;

    return (
        <div className={cn("flex -space-x-3", className)}>
            {visible.map((avatar) => (
                <div key={avatar.id}
                    className={cn("flex items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-slate-400 font-medium", s)}
                >
                    {avatar.src ? (
                        <img
                            src={avatar.src}
                            alt={avatar.name ?? ""}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span>
                            {avatar.name?.slice(0, 1).toUpperCase() ?? "U"}
                        </span>
                    )}
                </div>
            ))}

            {remaining > 0 && (
                <div className={cn("flex items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700 text-slate-300 font-medium", s)}>
                    +{remaining}
                </div>
            )}
        </div>
    );
}