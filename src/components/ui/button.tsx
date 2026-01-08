import { cn } from "@/lib/cn";

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'link';
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    `
    inline-flex items-center justify-center gap-2
    rounded-xl font-bold text-sm transition-all
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30
    disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]
    `;
  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-10 px-4 text-sm rounded-lg",
    lg: "h-12 px-6 text-base rounded-xl",
    icon: "h-10 w-10 p-0 rounded-lg",
  };

  const variants: Record<ButtonVariant, string> = {
    default:
      `bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900
       dark:hover:bg-slate-200`,

    primary:
      `bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20`,

    secondary:
      `border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors`,

    link:
      'bg-transparent px-0 py-0 text-primary-600 hover:underline dark:text-primary-400',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children && <span className="whitespace-nowrap">{children}</span>}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )
      }
    </button>
  );
}
