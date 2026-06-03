import {prisma} from "../db/prisma";
import type {Prisma} from "../../generated/prisma/client";
import type {Request, Response} from "express";

//Get All Departments
export const getAllDepartments = async (req:Request, res: Response) => {
    try{ 
        const { search, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);
        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions: Prisma.DepartmentWhereInput[] = [];
        const insensitive = 'insensitive' as Prisma.QueryMode;

        // Search by department name
        if (search) {
            filterConditions.push({
                name: { contains: String(search), mode: insensitive }
            });
        }

        const whereCondition: Prisma.DepartmentWhereInput =
            filterConditions.length > 0 ? { AND: filterConditions } : {};
        const countResult = await prisma.department.count({where: whereCondition});
        const totalCount = countResult;
        const totalPages = Math.ceil(totalCount / limitPerPage);    

        const departments = await prisma.department.findMany({
            where: whereCondition,
            include:{
                subjects: true
            },
            skip: offset,
            take: limitPerPage,
        });
        res.status(200).json({
            data: departments,
            total: totalCount
        });
    }catch(error){
        console.error("Error fetching departments:", error);
        res.status(500).json({error: "An error occurred while fetching departments."});
    }
}