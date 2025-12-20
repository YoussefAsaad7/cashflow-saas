import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import { authRepository } from "./auth.repository";

export interface RegisterInput {
    email: string;
    password: string;
    name?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginResult {
    user: {
        id: string;
        name: string | null;
        email: string;
    };
    token: string;
}

export const authService = {
    async register(input: RegisterInput) {
        const { email, password, name } = input;

        // Check if user exists
        const exists = await authRepository.existsByEmail(email);
        if (exists) {
            throw new Error("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        return authRepository.create({
            email,
            password: hashedPassword,
            name,
        });
    },

    async login(input: LoginInput): Promise<LoginResult> {
        const { email, password } = input;

        // Find user
        const user = await authRepository.findByEmail(email);
        if (!user || !user.password) {
            throw new Error("Invalid credentials");
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        // Generate JWT token
        const secret = process.env.NEXTAUTH_SECRET || "super_secret_for_dev_env";
        const token = await encode({
            token: {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.image,
            },
            secret,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    },

    async validateCredentials(email: string, password: string) {
        const user = await authRepository.findByEmail(email);
        if (!user || !user.password) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
        };
    },
};
