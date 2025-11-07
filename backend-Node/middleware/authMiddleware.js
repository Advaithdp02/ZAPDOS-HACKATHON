import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Basic JWT verification middleware
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * 🧩 Role-based Access Middleware
 * Example usage:
 * router.get("/example", authorizeRoles("TPO", "HOD", "Admin"), controllerFunc);
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    protect(req, res, () => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. ${req.user.role} is not authorized for this route.`,
        });
      }
      next();
    });
  };
};
export const studentProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }

    // Allow only students
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Access denied. Students only." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};