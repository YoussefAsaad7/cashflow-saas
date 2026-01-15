import bcrypt from "bcryptjs";
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

    async login(input: LoginInput) {
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

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            // Returning picture if available to match previous logic logic potential
            // But previous simplified return explicitly.
            // Previous return was: { id, name, email }.
            // Let's stick to that for now, or better: return the Prisma user object (subset)
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

    async handleOAuthLogin(data: { email: string; name?: string; image?: string }) {
        return authRepository.upsertByEmail(data);
    },
};
