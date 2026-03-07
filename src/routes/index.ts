import { Router } from "express";
import authRoutes from "./auth.js";
import courseRoutes from "./courses.js";
import quizRoutes from "./quizzes.js";
import storageRoutes from "./storage.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ ok: true }));
apiRouter.use("/auth", authRoutes);
apiRouter.use("/courses", courseRoutes);
apiRouter.use("/quizzes", quizRoutes);
apiRouter.use("/storage", storageRoutes);
