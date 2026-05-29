import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/prisma";
export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5001/api/auth",
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
    advanced: {
        disableOriginCheck: process.env.NODE_ENV !== "production",
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string", required: true, defaultValue: "student", input: true,
            }, imageCldPubId: {
                type: "string", required: false, input: true,
            },
        },
    },
});
//# sourceMappingURL=auth.js.map