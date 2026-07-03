import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

const validRoles = new Set<RateLimitRole>(["admin", "teacher", "student"]);

const authSessionMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const role = session?.user?.role;
    if (typeof role === "string" && validRoles.has(role as RateLimitRole)) {
      req.user = { role: role as RateLimitRole };
    }
  } catch (error) {
    console.error("Auth session middleware error:", error);
  }

  next();
};

export default authSessionMiddleware;
