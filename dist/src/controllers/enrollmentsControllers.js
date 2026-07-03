import { prisma } from "../db/prisma";
//Get Enrollment Details
const getEnrollmentDetails = async (enrollmentId) => {
    const enrollment = await prisma.enrollments.findUnique({
        where: { id: enrollmentId },
        include: {
            class: {
                include: {
                    subject: {
                        include: {
                            department: true,
                        },
                    },
                    teacher: true,
                },
            },
        },
    });
    if (!enrollment) {
        return null;
    }
    return {
        ...enrollment,
        class: enrollment.class,
        subject: enrollment.class?.subject,
        department: enrollment.class?.subject?.department,
        teacher: enrollment.class?.teacher,
    };
};
//Create Enrollments
export const postEnrollments = async (req, res) => {
    try {
        const classId = Number(req.body.classId);
        const studentId = String(req.body.studentId ?? "").trim();
        if (!Number.isFinite(classId) || !studentId) {
            return res.status(400).json({ error: "classId and studentId are required" });
        }
        const classrecord = await prisma.classes.findUnique({
            where: {
                id: classId
            }
        });
        if (!classrecord)
            return res.status(404).json({ error: "Class not found" });
        const student = await prisma.user.findUnique({
            where: {
                id: studentId
            }
        });
        if (!student)
            return res.status(404).json({ error: "Student not found" });
        const existingEnrollment = await prisma.enrollments.findFirst({
            where: {
                classId,
                studentId
            },
            select: {
                id: true,
            }
        });
        if (existingEnrollment) {
            return res.status(409).json({ error: "Student already enrolled in class" });
        }
        const createdEnrollment = await prisma.enrollments.create({
            data: {
                classId,
                studentId,
            },
            select: {
                id: true,
            }
        });
        const enrollment = await getEnrollmentDetails(createdEnrollment.id);
        res.status(200).json({ data: enrollment });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to create enrollment" });
    }
};
//enrollment by join
export const joinEnrollment = async (req, res) => {
    try {
        const inviteCode = String(req.body.inviteCode ?? "").trim();
        const studentId = String(req.body.studentId ?? "").trim();
        if (!inviteCode || !studentId) {
            return res.status(400).json({ error: "Invite code and student Id is required" });
        }
        const classrecord = await prisma.classes.findUnique({
            where: {
                inviteCode,
            }
        });
        if (!classrecord)
            return res.status(404).json({ error: "Class not found" });
        const student = await prisma.user.findUnique({
            where: {
                id: studentId
            }
        });
        if (!student)
            return res.status(404).json({ error: "Student not found" });
        const existingEnrollment = await prisma.enrollments.findFirst({
            where: {
                classId: classrecord.id,
                studentId
            },
            select: {
                id: true,
            }
        });
        if (existingEnrollment) {
            return res.status(409).json({ error: "Student already enrolled in class" });
        }
        const createdEnrollment = await prisma.enrollments.create({
            data: {
                classId: classrecord.id,
                studentId,
            },
            select: {
                id: true,
            }
        });
        const enrollment = await getEnrollmentDetails(createdEnrollment.id);
        res.status(200).json({ data: enrollment });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to create enrollment" });
    }
};
//# sourceMappingURL=enrollmentsControllers.js.map