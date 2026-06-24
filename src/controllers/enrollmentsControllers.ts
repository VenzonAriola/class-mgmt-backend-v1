import { prisma } from "../db/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { Request, Response } from "express";
import { router } from "better-auth/api";
import { EnrollmentsScalarFieldEnum } from "../../generated/prisma/internal/prismaNamespace";
import { isDataView } from "node:util/types";

//Get Enrollment Details
 const getEnrollmentDetails = async (enrollmentId: number) => {
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
export const postEnrollments = async (req: Request, res: Response) =>{

    try {
        const {classId, studentId } = req.body;

        if(!classId || studentId){
            return res.status(400).json({error:"classId and studentId are required"});
        }

        const classrecord = await prisma.classes.findUnique({
            where: {
                id:classId
            }
        })

        if(!classrecord) return res.status(404).json({error: "Class not found"});

        const student = await prisma.user.findUnique({
            where: {
                id:studentId
            }
        })

        if(!student) return res.status(404).json({error: "Student not found"});

        const existingEnrollment = await prisma.enrollments.findFirst({
            where: {
                classId,
                studentId
            },
            select: {
              id: true,
            }
        })

        if(existingEnrollment){
          return res.status(409).json({error: "Student already enrolled in class"})
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

        res.status(200).json({data:enrollment});
    }
    catch (error){
      console.log(error);
      return res.status(500).json({error: "Failed to create enrollment"})
    }
};

//enrollment by join
export const joinEnrollment = async (req: Request, res: Response) =>{

  try{
    const {inviteCode, studentId} = req.body;

    if(!inviteCode || !studentId){
      return res.status(400).json({error: "Invite code and student Id is required"})
    }

    const classrecord = await prisma.classes.findUnique({
            where: {
                id:inviteCode,
            }
        })

        if(!classrecord) return res.status(404).json({error: "Class not found"});

        const student = await prisma.user.findUnique({
            where: {
                id:studentId
            }
        })

        if(!student) return res.status(404).json({error: "Student not found"});

        const existingEnrollment = await prisma.enrollments.findFirst({
            where: {
                inviteCode,
                studentId
            },
            select: {
              id: true,
            }
        })

        if(existingEnrollment){
          return res.status(409).json({error: "Student already enrolled in class"})
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

        res.status(200).json({data:enrollment});
    }
    catch (error){
      console.log(error);
      return res.status(500).json({error: "Failed to create enrollment"})
  }
}
