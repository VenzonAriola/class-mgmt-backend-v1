import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/prisma";
export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigin: [process.env.FRONTEND_URL],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailandPassword: {
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