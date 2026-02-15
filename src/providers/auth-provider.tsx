"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const fetchMe = useAuthStore((state) => state.fetchMe);
    const isHydrating = useAuthStore((state) => state.isHydrating);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    return isHydrating ? <div>Loading...</div> : <>{children}</>;
}
