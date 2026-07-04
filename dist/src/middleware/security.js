import aj from "../config/arcjet";
import { slidingWindow } from "@arcjet/node";
const securityMiddleware = async (req, res, next) => {
    // Implement security checks here (e.g., authentication, authorization)
    // For example, you can check for a valid API key in the headers
    if (process.env.NODE_ENV === "test")
        return next(); // Skip security checks in test environment
    try {
        const role = req.user?.role ?? "guest";
        // You can implement role-based access control here
        let limit;
        let message;
        switch (role) {
            case "admin":
                limit = 60;
                message = 'Admin request limit exceeded(60 per minute). Slow down. ';
                break;
            case "teacher":
            case "student":
                limit = 40;
                message = 'User request limit exceeded(40 per minute). Please wait.';
                break;
            default:
                limit = 20;
                message = 'Guest request limit exceeded(20 per minute). Please wait or sign up.';
        }
        const client = aj.withRule(slidingWindow({
            mode: "LIVE",
            interval: '1m',
            max: limit,
        }));
        const arcjetRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: { remoteAddress: req.socket.remoteAddress ?? req.ip ?? '0.0.0.0' },
        };
        const decission = await client.protect(arcjetRequest);
        if (decission.isDenied() && decission.reason.isBot()) {
            return res.status(403).json({ error: "Forbidden", message: "Bot request is not allowed." });
        }
        if (decission.isDenied() && decission.reason.isShield()) {
            return res.status(403).json({ error: "Forbidden", message: "Request blocked by security policy." });
        }
        if (decission.isDenied() && decission.reason.isRateLimit()) {
            return res.status(429).json({ error: "Too Many Requests", message: message });
        }
        next();
    }
    catch (error) {
        console.error("Arcjet middleware error:", error);
        return res.status(500).json({ error: "Internal Error", message: "Something went wrong with security middleware" });
    }
};
export default securityMiddleware;
//# sourceMappingURL=security.js.map