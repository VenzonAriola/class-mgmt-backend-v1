import type { Request, Response, NextFunction } from "express";

 const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ error: "Unauthorized", message: "You must be logged in." });
    }

    if (!allowedRoles.includes(role as UserRole)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Role '${role}' cannot perform this action.`,
      });
    }

    next();
  };
};

export default authorize;