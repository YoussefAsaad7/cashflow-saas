import { signIn, signOut } from "next-auth/react";
import { loginInput, registerInput } from "./auth.schemas";

import { User, AuthResponse } from "./auth.types";

const BASE_URL = "/api/v1"; // Relative path is better for Next.js

type ApiError = {
    error: string;
};

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
}

export async function login(values: loginInput): Promise<AuthResponse> {
    const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
    });

    if (res?.error) {
        throw new Error(res.error);
    }

    // After successful login, fetch the user details (session)
    // We call getMe to get the enriched user object that our store expects.
    // Alternatively, we could rely on useSession() in the provider, but this keeps the store logic consistent.
    const userRes = await getMe();
    return {
        user: userRes.user,
    };
}

export async function register(values: registerInput): Promise<AuthResponse> {
    // 1. Create the user in the database
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

    await handleResponse(res);

    // 2. Sign in the user immediately
    return login({ email: values.email, password: values.password });
}

export async function getMe(): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return handleResponse<{ user: User }>(res);
}

export async function logout(): Promise<void> {
    await signOut({ redirect: false });
}