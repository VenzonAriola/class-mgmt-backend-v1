import { prisma } from "../lib/prisma";
// Get all subjects
export const getAllSubjects = async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);
        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions = [];
        const insensitive = 'insensitive';
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
        const whereCondition = filterConditions.length > 0 ? { AND: filterConditions } : {};
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
};
//# sourceMappingURL=subjectsContoller.js.map