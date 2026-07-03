import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
const validRoles = new Set(["admin", "teacher", "student"]);
const authSessionMiddleware = async (req, _res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        const role = session?.user?.role;
        if (typeof role === "string" && validRoles.has(role)) {
            req.user = { role: role };
        }
    }
    catch (error) {
        console.error("Auth session middleware error:", error);
    }
    next();
};
export default authSessionMiddleware;
//# sourceMappingURL=authSession.js.map