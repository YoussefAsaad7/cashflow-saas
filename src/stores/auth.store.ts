import { create } from "zustand";

import type { User, AuthResponse } from "@/domain/auth/auth.api";
import { login, register, getMe, logout } from "@/domain/auth/auth.api";
import type { loginInput, registerInput } from "@/domain/auth/auth.schemas";

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isHydrating: boolean;


    login: (values: loginInput) => Promise<void>;
    register: (values: registerInput) => Promise<void>;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isHydrating: true,

    async login(values) {
        set({
            isLoading: true,
        })
        const res: AuthResponse = await login(values);
        set({
            user: res.user,
            isAuthenticated: true,
            isLoading: false,
        })
    },
    async register(values) {
        set({
            isLoading: true,
        })
        const res: AuthResponse = await register(values);

        set({
            user: res.user,
            isAuthenticated: true,
            isLoading: false,
        });
    },
    async fetchMe() {
        try {
            const res = await getMe();
            set({
                user: res.user,
                isAuthenticated: true,
            });
        }
        catch {
            set({
                user: null,
                isAuthenticated: false,
            });
        } finally {
            set({
                isHydrating: false,
            });
        }
    },
    async logout() {
        set({
            isLoading: true,
        })
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
})); 