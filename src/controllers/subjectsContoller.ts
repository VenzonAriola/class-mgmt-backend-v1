import { prisma } from "../db/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { Request, Response } from "express";

// Get all subjects
export const getAllSubjects = async (req: Request, res: Response) => {
    try {
        const {search, department, page = 1, limit = 10} = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions: Prisma.SubjectsWhereInput[] = [];
        const insensitive = 'insensitive' as Prisma.QueryMode;

        // Search by subject name or code
        if (search) {
            filterConditions.push({
                OR: [
                    { name: { contains: String(search), mode: insensitive } },
                    { code: { contains: String(search), mode: insensitive } }
                ]
            });
        }

        // Filter by department name or code
        if (department) {
            filterConditions.push({
                department: {
                    OR: [
                        { name: { contains: String(department), mode: insensitive } },
                        { code: { contains: String(department), mode: insensitive } }
                    ]
                }
            });
        }

        const whereCondition: Prisma.SubjectsWhereInput =
            filterConditions.length > 0 ? { AND: filterConditions } : {};

        const countResult = await prisma.subjects.count({ where: whereCondition });
        const totalCount = countResult;
        const totalPages = Math.ceil(totalCount / limitPerPage);

        const subjects = await prisma.subjects.findMany({
            where: whereCondition,
            include: {
                department: true,
            },
            skip: offset,
            take: limitPerPage,
        });
        res.status(200).json({ subjects, pagination: { totalCount, totalPages, currentPage, limitPerPage } });
    }
    catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ error: "An error occurred while fetching subjects." });
    }
}

//Get Subject Details
export const getSubjectDetails = async (req: Request, res: Response) => {
    try {
        const subjectId = Number(req.params.id);

        if(!Number.isFinite(subjectId)){
            return res.status(400).json({ error: "Invalid subject ID." });
        }
        const subjectDetails = await prisma.subjects.findUnique({
            where: { id: subjectId },
            include: {
                department: true,
                classes: {
                    include: {
                        teacher: true,
                    },
                },
            },
        });
        if (!subjectDetails) {
            return res.status(404).json({ error: "Subject not found." });
        }
        res.status(200).json({ data: subjectDetails });
    } catch (error) {
        console.error("Error fetching subject details:", error);
        res.status(500).json({ error: "An error occurred while fetching subject details." });
    }
}

//Post Create a Subject
export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, code, description, departmentId } = req.body;
        if (!name || !code || !departmentId) {
            return res.status(400).json({ error: "Name, code, and departmentId are required." });
        }
        const newSubject = await prisma.subjects.create({
            data: {
                name,
                code,
                description,
                departmentId
            }
        });

        if(!newSubject){
            return res.status(500).json({ error: "Failed to create subject." });
        }
        res.status(201).json({ data: newSubject });
    } catch (error) {
        const prismaError = error as { code?: string };

        if (prismaError.code === "P2002") {
            return res.status(409).json({ error: "A subject with this code already exists." });
        }

        console.error("Error creating subject:", error);
        res.status(500).json({ error: "An error occurred while creating the subject." });
    }
}
