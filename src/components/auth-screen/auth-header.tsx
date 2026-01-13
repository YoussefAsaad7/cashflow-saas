import BrandLogo from "@/components/ui/brand-logo";

type AuthHeaderProps = {
    isLogin: boolean;
};

export default function AuthHeader({ isLogin }: AuthHeaderProps) {
    return (
        <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
                <BrandLogo size="md" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isLogin ? "Welcome back!" : "Create an account"}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {isLogin ? "Enter your details to access your workspace." :
                    "Start your 30-day free trial. No credit card required."
                }
            </p>
        </div>
    );
}