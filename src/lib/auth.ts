import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/prisma";
import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5001/api/auth",
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173", "https://class-mgmt-frontend-v1.vercel.app/"],
    advanced: {
        disableOriginCheck: process.env.NODE_ENV !== "production",
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        autoSignIn: false,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: false,
        expiresIn: 60 * 60 * 24,
        // src/lib/auth.ts
        async sendVerificationEmail({ user, url }) {
            console.log(`[auth] Attempting to send verification email to ${user.email}`);
            try {
                await sendVerificationEmail({ user, url });
                console.log(`[auth] Verification email sent to ${user.email}`);
             } catch (err) {
                console.error(`[auth] FAILED to send verification email to ${user.email}:`, err);
            }
},
    },
    user: {
        additionalFields: {
            role: {
                type: "string", required: true, defaultValue:"student", input:true,
            },imageCldPubId: {
                type: "string", required: false, input:true,
            },
        },
    },
});
