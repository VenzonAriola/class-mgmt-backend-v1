import { prisma } from "../db/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { Request, Response } from "express";

// Helper to normalize query parameters from string | string[] | undefined to string | undefined
const normalizeQueryParam = (param: string | string[] | undefined): string | undefined => {
    if (typeof param === 'string') return param;
    if (Array.isArray(param)) return param[0];
    return undefined;
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const search = normalizeQueryParam(req.query.search as any);
        const role = normalizeQueryParam(req.query.role as any);
        const page = normalizeQueryParam(req.query.page as any) || '1';
        const limit = normalizeQueryParam(req.query.limit as any) || '10';
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

//Get user details with role specific info
export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const userId = normalizeQueryParam(req.params.id as any);
        if (!userId) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        const userRecord = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!userRecord) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json({ data: userRecord });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "An error occurred while fetching user details." });
    }
};

//List departments associated with a user (for teachers and students)
export const getUserDepartments = async (req: Request, res: Response) => {
    try {

        const userId = normalizeQueryParam(req.params.id as any);
        if (!userId) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        const userRecord = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                role: true,
            },
        });
        if (!userRecord) {
            return res.status(404).json({ error: "User not found." });
        }
        if (userRecord.role === 'admin') {
            return res.status(403).json({ error: "Admins do not have associated departments." });
        }
        // Departments are linked to Subjects -> Classes -> (teacherId OR enrollments.studentId)
        const departments = await prisma.department.findMany({
            where: {
                OR: [
                    // user is a teacher for any class in any subject of the department
                    {
                        subjects: {
                            some: {
                                classes: {
                                    some: {
                                        teacherId: userId,
                                    }
                                }
                            }
                        }
                    },
                    // user is a student enrolled in any class in any subject of the department
                    {
                        subjects: {
                            some: {
                                classes: {
                                    some: {
                                        enrollments: {
                                            some: {
                                                studentId: userId
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                description: true,
            }
        });
        res.status(200).json({ data: departments });


    } catch (error) {
        console.error("Error fetching user departments:", error);
        res.status(500).json({ error: "An error occurred while fetching user departments." });
    }
};

//List subjects associated with a user (for teachers and students)
export const getUserSubjects = async (req: Request, res: Response) => {
    try {
        const userId = normalizeQueryParam(req.params.id as any);
        if (!userId) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        const userRecord = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                role: true,
                id: true
            },
        });

        if (!userRecord) {
            return res.status(404).json({ error: "User not found." });
        }
        if (userRecord.role === 'admin') {
            return res.status(403).json({ error: "Admins do not have associated subjects." });
        }
        // Subjects are linked to Classes -> (teacherId OR enrollments.studentId)
        const subjects = await prisma.subjects.findMany({
            where: {
                OR: [
                    // user is a teacher for any class in the subject
                    {
                        classes: {
                            some: {
                                teacherId: userId,
                            }
                        }
                    },
                    // user is a student enrolled in any class in the subject
                    {
                        classes: {
                            some: {
                                enrollments: {
                                    some: {
                                        studentId: userId
                                    }
                                }
                            }   
                        }
                    }
                ]
            },
           
            select: {
                id: true,
                name: true,
                code: true,
                description: true,
                departmentId: true,
                department:true,
                
            }
        });
        res.status(200).json({ data: subjects });

    } catch (error) {
        console.error("Error fetching user subjects:", error);
        res.status(500).json({ error: "An error occurred while fetching user subjects." }); 
    }
};