import prisma from "@/lib/prisma";

export const authRepository = {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async create(data: { email: string; password: string; name?: string }) {
        return prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                name: true,
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
};
