import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const rawConnectionString = process.env.DATABASE_URL ?? "";
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const normalizedConnectionString = rawConnectionString.replace(
  /sslmode=(prefer|require|verify-ca)/gi,
  "sslmode=verify-full",
);

const adapter = new PrismaPg({
  connectionString: normalizedConnectionString,
  connectionTimeoutMillis: 15000,
});
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
    try {
        await prisma.$connect();   
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await prisma.$disconnect(); 
        console.log('Database disconnected successfully');
    } catch (error) {
        console.error('Database disconnection failed:', error);
    }
};

export { prisma, connectDB, disconnectDB };