import { prisma } from "../db/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { Request, Response } from "express";


export const postClasses = async (req: Request, res: Response) => {
    try {
        const { name, subjectId, teacherId, description, bannerCldPubId, bannerUrl, capacity, status, } = req.body;  

        const newClass = await prisma.classes.create({
            data: {
                name,
                description,
                bannerCldPubId,
                bannerUrl,
                capacity,
                status,
                subject: {
                    connect: { id: subjectId }
                },
                teacher: {
                    connect: { id: teacherId }
                },
                inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate a random invite code
                schedule:[]
            }
        });

        if(!newClass) {
            return res.status(400).json({ error: "Failed to create class." });
        }

        res.status(201).json(newClass);
    }
    catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ error: "An error occurred while creating the class." });
    }
}

//Get All Classes
export const getAllClasses = async (req:Request, res: Response) => {
    try{ 
        const { search, subject, teacher, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions: Prisma.ClassesWhereInput[] = [];
        const insensitive = 'insensitive' as Prisma.QueryMode;

        // Search by class name
        if (search) {
            filterConditions.push({
                name: { contains: String(search), mode: insensitive }
            });
        }

        // Filter by subject name
        if (subject) {
            filterConditions.push({
                subject: {
                    name: { contains: String(subject), mode: insensitive }
                }
            });
        }

        // Filter by teacher name
        if (teacher) {
            filterConditions.push({
                teacher: {
                    name: { contains: String(teacher), mode: insensitive }
                }
            });
        }

        const whereCondition: Prisma.ClassesWhereInput =
            filterConditions.length > 0 ? { AND: filterConditions } : {};

        const countResult = await prisma.classes.count({where: whereCondition});
        const totalCount = countResult;
        const totalPages = Math.ceil(totalCount / limitPerPage);   

        const classes = await prisma.classes.findMany({
            where: whereCondition,
            include: {
                subject: true,
                teacher: true,
            },
            skip: offset,
            take: limitPerPage,
        });

        res.status(200).json({classes, pagination:{totalCount, totalPages, currentPage, limitPerPage}});

    } catch (error){
        console.log("Error fetching classes:", error)
        res.status(500).json({error: "An error occurred while fetching classes."})
    }
}