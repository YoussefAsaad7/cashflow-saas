import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authService } from "@/modules/auth/auth.service";

export const authOptions: NextAuthOptions = {
    // NOTE: PrismaAdapter is NOT used with JWT strategy
    // Adapters are only for database sessions
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await authService.validateCredentials(
                    credentials.email,
                    credentials.password
                );

                if (!user) {
                    throw new Error("Invalid credentials");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Initial sign in
            if (account && user) {
                // For Google Provider (or other OAuth providers)
                if (account.provider === "google") {
                    const dbUser = await authService.handleOAuthLogin({
                        email: user.email!,
                        name: user.name || undefined,
                        image: user.image || undefined,
                    });
                    token.id = dbUser.id;
                }
                // For Credentials Provider, 'user' is already the DB user object returned by 'authorize'
                else {
                    token.id = user.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login", // Redirect errors back to login for now, or let NextAuth handle it default if we remove this line. Let's keep /login to avoid 404s.
    },
    secret: process.env.NEXTAUTH_SECRET,
};
