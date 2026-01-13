import { loginInput, registerInput } from "./auth.schemas";

const BASE_URL = "http://localhost:3000/api/v1";

type ApiError = {
    error: string;
};

export interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
}

export interface AuthResponse {
    user: User;
    token: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }
    return data;
}

export async function login(values: loginInput): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

    return handleResponse<AuthResponse>(res);
}

export async function register(values: registerInput): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

    return handleResponse<AuthResponse>(res);
}

export async function getMe(): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return handleResponse<{ user: User }>(res);
}

export async function logout(): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Logout failed");
    }
}