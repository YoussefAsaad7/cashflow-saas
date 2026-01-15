export interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
}

export interface AuthResponse {
    user: User;
    token?: string; // Made optional as NextAuth handles the session token
}
