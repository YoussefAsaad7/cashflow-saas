"use client";

export type InputFieldProps = {
    label: string;
    icon?: React.ElementType;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputField({
    label,
    icon: Icon,
    error,
    className,
    ...inputProps
}: InputFieldProps) {
    const variantStyles = {
        default:
            "border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20",
        error:
            "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20",
    };
    return (
        <div className="space-y-1.5">
            <label
                htmlFor={inputProps.id || inputProps.name}
                className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-500"
            >
                {label}
            </label>

            <div className="relative group">
                {Icon && (
                    <Icon
                        className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                    />
                )}
                <input
                    {...inputProps}
                    id={inputProps.id || inputProps.name}
                    className={`
                        w-full rounded-xl border bg-white dark:bg-slate-900
                        ${Icon ? "pl-10 pr-4" : "px-4"} py-3
                        text-sm text-slate-900 dark:text-slate-100
                        placeholder:text-slate-400
                        focus:outline-none focus:ring-2 transition-all
                        ${variantStyles[error ? "error" : "default"]}
                        ${className || ""}
                        `}
                />
            </div>
            {error && (
                <p className="ml-1 text-xs font-medium text-danger-600">
                    {error}
                </p>
            )}
        </div>
    );
}