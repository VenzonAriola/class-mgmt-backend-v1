import { prisma } from "../db/prisma";
const normalizeQueryParam = (param) => {
    if (typeof param === "string")
        return param;
    if (Array.isArray(param))
        return param[0];
    return undefined;
};
//Get All Departments
export const getAllDepartments = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);
        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions = [];
        const insensitive = 'insensitive';
        // Search by department name
        if (search) {
            filterConditions.push({
                name: { contains: String(search), mode: insensitive }
            });
        }
        const whereCondition = filterConditions.length > 0 ? { AND: filterConditions } : {};
        const countResult = await prisma.department.count({ where: whereCondition });
        const totalCount = countResult;
        const totalPages = Math.ceil(totalCount / limitPerPage);
        const departments = await prisma.department.findMany({
            where: whereCondition,
            include: {
                subjects: true
            },
            skip: offset,
            take: limitPerPage,
        });
        res.status(200).json({
            data: departments,
            total: totalCount
        });
    }
    catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "An error occurred while fetching departments." });
    }
};
//Get Department by ID
export const getDepartmentDetails = async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        if (!Number.isFinite(departmentId)) {
            return res.status(400).json({ error: "Invalid department ID." });
        }
        const department = await prisma.department.findUnique({
            where: {
                id: departmentId
            }
        });
        if (!department) {
            return res.status(404).json({ error: "Department not found." });
        }
        const [subjects, classes, teachers, students, subjectCount, classCount, studentCount] = await Promise.all([
            prisma.subjects.findMany({
                where: { departmentId },
                orderBy: { createdAt: "desc" },
                take: 100,
            }),
            prisma.classes.findMany({
                where: { subject: { departmentId } },
                include: {
                    subject: true,
                    teacher: true,
                },
                orderBy: { createdAt: "desc" },
                take: 100,
            }),
            prisma.user.findMany({
                where: {
                    role: "teacher",
                    classes: {
                        some: {
                            subject: { departmentId },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true,
                },
                orderBy: { createdAt: "desc" },
                take: 100,
            }),
            prisma.user.findMany({
                where: {
                    role: "student",
                    enrollments: {
                        some: {
                            class: {
                                subject: { departmentId },
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true,
                },
                orderBy: { createdAt: "desc" },
                take: 100,
            }),
            prisma.subjects.count({ where: { departmentId } }),
            prisma.classes.count({ where: { subject: { departmentId } } }),
            prisma.user.count({
                where: {
                    role: "student",
                    enrollments: {
                        some: {
                            class: {
                                subject: { departmentId },
                            },
                        },
                    },
                },
            }),
        ]);
        res.status(200).json({
            data: {
                department,
                totals: {
                    subjects: subjectCount,
                    classes: classCount,
                    enrolledStudents: studentCount,
                },
                subjects,
                classes,
                teachers,
                students,
            },
        });
    }
    catch (error) {
        console.error({ error: "Error fetching department details:" });
        res.status(500).json({ error: "An error occurred while fetching department details" });
    }
};
export const getDepartmentSubjects = async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        if (!Number.isFinite(departmentId)) {
            return res.status(400).json({ error: "Invalid department ID." });
        }
        const page = Number(normalizeQueryParam(req.query.page) ?? "1");
        const limit = Number(normalizeQueryParam(req.query.limit) ?? "10");
        const currentPage = Math.max(1, Number.isFinite(page) ? page : 1);
        const limitPerPage = Math.max(1, Number.isFinite(limit) ? limit : 10);
        const offset = (currentPage - 1) * limitPerPage;
        const totalCount = await prisma.subjects.count({
            where: { departmentId },
        });
        const subjects = await prisma.subjects.findMany({
            where: { departmentId },
            include: { department: true },
            skip: offset,
            take: limitPerPage,
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            data: subjects,
            total: totalCount,
        });
    }
    catch (error) {
        console.error("Error fetching department subjects:", error);
        res.status(500).json({ error: "An error occurred while fetching department subjects." });
    }
};
export const getDepartmentClasses = async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        if (!Number.isFinite(departmentId)) {
            return res.status(400).json({ error: "Invalid department ID." });
        }
        const page = Number(normalizeQueryParam(req.query.page) ?? "1");
        const limit = Number(normalizeQueryParam(req.query.limit) ?? "10");
        const currentPage = Math.max(1, Number.isFinite(page) ? page : 1);
        const limitPerPage = Math.max(1, Number.isFinite(limit) ? limit : 10);
        const offset = (currentPage - 1) * limitPerPage;
        const totalCount = await prisma.classes.count({
            where: { subject: { departmentId } },
        });
        const classes = await prisma.classes.findMany({
            where: { subject: { departmentId } },
            include: {
                subject: true,
                teacher: true,
            },
            skip: offset,
            take: limitPerPage,
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            data: classes,
            total: totalCount,
        });
    }
    catch (error) {
        console.error("Error fetching department classes:", error);
        res.status(500).json({ error: "An error occurred while fetching department classes." });
    }
};
export const getDepartmentUsers = async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        const role = normalizeQueryParam(req.query.role);
        if (!Number.isFinite(departmentId)) {
            return res.status(400).json({ error: "Invalid department ID." });
        }
        const page = Number(normalizeQueryParam(req.query.page) ?? "1");
        const limit = Number(normalizeQueryParam(req.query.limit) ?? "10");
        const currentPage = Math.max(1, Number.isFinite(page) ? page : 1);
        const limitPerPage = Math.max(1, Number.isFinite(limit) ? limit : 10);
        const offset = (currentPage - 1) * limitPerPage;
        const teacherCondition = {
            role: "teacher",
            classes: {
                some: {
                    subject: { departmentId },
                },
            },
        };
        const studentCondition = {
            role: "student",
            enrollments: {
                some: {
                    class: {
                        subject: { departmentId },
                    },
                },
            },
        };
        let whereCondition;
        if (role === "teacher") {
            whereCondition = teacherCondition;
        }
        else if (role === "student") {
            whereCondition = studentCondition;
        }
        else {
            whereCondition = {
                OR: [teacherCondition, studentCondition],
            };
        }
        const totalCount = await prisma.user.count({ where: whereCondition });
        const users = await prisma.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
            },
            skip: offset,
            take: limitPerPage,
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            data: users,
            total: totalCount,
        });
    }
    catch (error) {
        console.error("Error fetching department users:", error);
        res.status(500).json({ error: "An error occurred while fetching department users." });
    }
};
// Create Department
export const createDepartment = async (req, res) => {
    try {
        const { code, name, description } = req.body;
        if (!code || !name) {
            return res.status(400).json({ error: "Code and name are required." });
        }
        const newDepartment = await prisma.department.create({
            data: {
                code,
                name,
                description,
            },
        });
        res.status(201).json({ data: newDepartment });
    }
    catch (error) {
        const prismaError = error;
        if (prismaError.code === "P2002") {
            return res.status(409).json({ error: "A department with this code already exists." });
        }
        console.error("Error creating department:", error);
        res.status(500).json({ error: "An error occurred while creating the department." });
    }
};
//# sourceMappingURL=departmentControllers.js.map