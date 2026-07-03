import { prisma } from "../db/prisma";
//Overview counts for core entities
export const getOverview = async (req, res) => {
    try {
        const [userCount, teachersCount, adminCount, subjectsCount, departmentsCount, classesCount] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    role: "teacher"
                },
            }),
            prisma.user.count({
                where: {
                    role: "admin"
                }
            }),
            prisma.subjects.count(),
            prisma.department.count(),
            prisma.classes.count()
        ]);
        res.status(200).json({
            data: {
                userCount,
                teachersCount,
                adminCount,
                subjectsCount,
                departmentsCount,
                classesCount
            }
        });
    }
    catch (error) {
        console.error("Stats Overview error", error);
        res.status(500).json({ error: "Failed to fetch overview" });
    }
};
//Get Latest Classes and Teachers
export const getLatest = async (req, res) => {
    try {
        const limit = Math.max(1, Number(req.query.limit) || 5);
        const [latestClass, latestTeachers] = await Promise.all([
            prisma.classes.findMany({
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    subject: true,
                    teacher: true
                }
            }),
            prisma.user.findMany({
                where: {
                    role: "teacher",
                },
                take: limit,
                orderBy: {
                    createdAt: "desc",
                }
            })
        ]);
        res.status(200).json({
            data: {
                latestClass, latestTeachers
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch latest stats" });
    }
};
//Complete Chart Route
export const getChartDetails = async (req, res) => {
    try {
        const [usersByRole, subjectsByDepartment, classesBySubject] = await Promise.all([
            prisma.user.groupBy({
                by: ["role"],
                _count: {
                    role: true,
                }
            }),
            prisma.department.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            subjects: true
                        }
                    }
                }
            }),
            prisma.subjects.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            classes: true,
                        }
                    }
                }
            }),
        ]);
        res.status(200).json({
            data: {
                usersByRole: usersByRole.map((item) => ({
                    role: item.role,
                    total: item._count.role,
                })),
                subjectsByDepartment: subjectsByDepartment.map((dept) => ({
                    departmentId: dept.id,
                    departmentName: dept.name,
                    totalSubjects: dept._count.subjects,
                })),
                classesBySubject: classesBySubject.map((subject) => ({
                    subjectId: subject.id,
                    subjectName: subject.name,
                    totalClasses: subject._count.classes,
                })),
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch chart stats",
        });
    }
};
//# sourceMappingURL=statsControllers.js.map