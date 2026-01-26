"use client";

import {Button} from "@/components/ui/button";

type AuthFooterProps = {
    isLogin: boolean;
    onToggle: () => void;
};

export default function AuthFooter({ isLogin, onToggle }: AuthFooterProps) {
    return (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
                type="button"
                onClick={onToggle}
                variant="link"
            >
                {isLogin ? "Sign up" : "Sign in"}
            </Button>
        </p>
    );
}
