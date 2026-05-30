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