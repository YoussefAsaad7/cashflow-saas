import prisma from "@/lib/prisma";

export const authRepository = {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async create(data: { email: string; password?: string; name?: string; image?: string }) {
        return prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                createdAt: true,
            },
        });
    },

    async existsByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return !!user;
    },

    async upsertByEmail(data: { email: string; name?: string; image?: string }) {
        // If user exists, return it. If not, create it.
        // We do NOT update existing users with OAuth data to prevent overwriting manual changes,
        // unless you strictly want to sync profile data from Google every login.
        // For now, finding or creating is safer.

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return existingUser;
        }

        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                image: data.image,
            },
        });
    },
};
