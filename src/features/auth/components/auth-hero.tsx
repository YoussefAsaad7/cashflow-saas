import AvatarGroup from "../ui/avatar-group";
import BrandLogo from "../ui/brand-logo";


export default function AuthHero() {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12 text-white">
            <div className="absolute inset-0 bg-linear-to-br from-primary-600/20 to-violet-600/20 z-0"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <BrandLogo size="md" />
            </div>

            <div className="relative z-10 max-w-lg">
                <h2 className="font-bold text-4xl tracking-tight mb-6">
                    Master your finances with professional precision.
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                    Track every hour worked, monitor every expense, and visualize your financial growth in one unified workspace. Join thousands of professionals optimizing their workday.
                </p>
            </div>

            <div className="mt-12 flex gap-4">
                <AvatarGroup avatars={[{ id: 1, name: "John Doe", src: "" }, { id: 2, name: "Jane Doe", src: "" }, { id: 3, name: "John Doe", src: "" }, { id: 4, name: "Jane Doe", src: "" }, { id: 5, name: "John Doe", src: "" }, { id: 6, name: "eane Doe", src: "" }, { id: 7, name: "John Doe", src: "" }]} />
                <div className="flex flex-col justify-center">
                    <span className="font-bold text-sm">Trusted by freelancers</span>
                    <span className="text-xs text-slate-400">and contractors worldwide</span>
                </div>
            </div>

            <div className="relative z-10 text-xs text-slate-500">
                © 2025 CashFlow SaaS Inc. All rights reserved.
            </div>
        </div>
    );
}
