"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { loginInput, registerInput } from "@/features/auth/schema/auth.schemas";

import AuthHero from "./components/auth-hero";
import AuthHeader from "./components/auth-header";
import AuthForm from "./components/auth-form";
import AuthFooter from "./components/auth-footer";


export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  async function handleSubmit(values: loginInput | registerInput) {
    setError(null);
    try {
      if (isLogin) {
        await login(values as loginInput);
      } else {
        await register(values as registerInput);
      }
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left side – visual / marketing */}
      <AuthHero />

      {/* Right side – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AuthHeader isLogin={isLogin} />

          <AuthForm
            isLogin={isLogin}
            onSubmit={handleSubmit}
            apiError={error}
          />

          <AuthFooter
            isLogin={isLogin}
            onToggle={() => setIsLogin((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
}
