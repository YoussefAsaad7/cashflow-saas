"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { Checkbox } from "@/components/ui/checkbox";
import Divider from "@/components/ui/divider";
import SocialAuthButton from "@/components/ui/social-auth-button";

import {
    loginSchema,
    registerSchema,
    loginInput,
    registerInput,
} from "@/domain/auth/auth.schemas";

type AuthFormProps = {
    isLogin: boolean;
    onSubmit: (values: loginInput | registerInput) => Promise<void>;
    apiError?: string | null;
};

export default function AuthForm({
    isLogin,
    onSubmit,
    apiError
}: AuthFormProps) {
    const loginForm = useForm<loginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { remember: true },
    });

    const registerForm = useForm<registerInput>({
        resolver: zodResolver(registerSchema),
    });

    const form = isLogin ? loginForm : registerForm;
    const handleSubmit = isLogin ? loginForm.handleSubmit(onSubmit) : registerForm.handleSubmit(onSubmit);
    const emailRegister = isLogin ? loginForm.register("email") : registerForm.register("email");
    const passwordRegister = isLogin ? loginForm.register("password") : registerForm.register("password");

    return (
        <form onSubmit={handleSubmit}
            className="space-y-5"
        >
            {!isLogin && (
                <InputField
                    label="Full Name"
                    icon={User}
                    placeholder="John Doe"
                    {...registerForm.register("name")}
                    error={registerForm.formState.errors.name?.message}
                />
            )}
            <InputField
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="john.deo@example.com"
                {...emailRegister}
                error={form.formState.errors.email?.message}
            />
            <InputField
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                {...passwordRegister}
                error={form.formState.errors.password?.message}
            />
            {isLogin && (
                <div className="flex items-center justify-between text-sm">
                    <div>
                        <Checkbox
                            id="remember"
                            {...loginForm.register("remember")}
                        />
                        <label htmlFor="remember" className="ml-2">
                            Remember me
                        </label>
                    </div>
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="ml-2"
                    >
                        Forgot password?
                    </Button>
                </div>
            )}
            {apiError && (
                <p className="text-sm text-danger-600 text-center">{apiError}</p>
            )}
            <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <>
                        {isLogin ? "Sign In" : "Create Account"}
                    </>
                )}
            </Button>

            <Divider label="Or continue with" />
            <div className="grid grid-cols-2 gap-3">
                <SocialAuthButton provider="google" />
                <SocialAuthButton provider="github" />
            </div>
        </form>
    );
}