import { prisma } from "../db/prisma";
import { desc } from "../../generated/prisma/client";
import type { Prisma } from "../../generated/prisma/client";
import type { Request, Response } from "express";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions: Prisma.UserWhereInput[] = [];
        const insensitive = 'insensitive' as Prisma.QueryMode;

        // Search by user name or email
        if (search) {
            filterConditions.push({
                OR: [
                    { name: { contains: String(search), mode: insensitive } },
                    { email: { contains: String(search), mode: insensitive } }
                ]
            });
        }

        // Filter by role (exact match)
        if (role) {
            filterConditions.push({
                role: String(role) as any
            });
        }

        const whereCondition: Prisma.UserWhereInput =
            filterConditions.length > 0 ? { AND: filterConditions } : {};

        // Count query using prisma sql count(*) with the same where clause
        const totalCount = await prisma.user.count({ where: whereCondition });
        const totalPages = Math.ceil(totalCount / limitPerPage);

        // Data query with orderBy user.createdAt desc, limit, offset
        const users = await prisma.user.findMany({
            where: whereCondition,
            orderBy: {
                createdAt: 'desc'
            },
            skip: offset,
            take: limitPerPage,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        res.status(200).json({
            data: users,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: totalPages
            }
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "An error occurred while fetching users." });
    }
};
