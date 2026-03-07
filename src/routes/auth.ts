import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  decisionSchema,
  loginSchema,
  promoteSchema,
  registerSchema,
} from "../modules/auth/schemas.js";
import {
  getInstructorApplications,
  getUserProfile,
  loginUser,
  promoteUserToAdmin,
  registerUser,
  reviewInstructorApplication,
} from "../modules/auth/auth.service.js";

const router = Router();

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    const user = await registerUser(parsed.data);
    return res.status(201).json(user);
  } catch (err) {
    return res
      .status((err as any).status || 500)
      .json({ message: (err as Error).message });
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    const payload = await loginUser(parsed.data);
    return res.json(payload);
  } catch (err) {
    return res
      .status((err as any).status || 500)
      .json({ message: (err as Error).message });
  }
});

router.post("/promote-admin", async (req, res) => {
  const parsed = promoteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    const result = await promoteUserToAdmin(
      parsed.data.email,
      parsed.data.bootstrapKey,
    );
    res.json(result);
  } catch (err) {
    res
      .status((err as any).status || 500)
      .json({ message: (err as Error).message });
  }
});

router.get(
  "/instructor-applications",
  requireAuth,
  requireRole("ADMIN"),
  async (_req, res) => {
    const rows = await getInstructorApplications();
    res.json(rows);
  },
);

router.patch(
  "/instructor-applications/:userId",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId) || userId <= 0) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const parsed = decisionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    try {
      const result = await reviewInstructorApplication(
        userId,
        parsed.data.status,
        req.auth!.userId,
        parsed.data.note,
      );
      res.json(result);
    } catch (err) {
      res
        .status((err as any).status || 500)
        .json({ message: (err as Error).message });
    }
  },
);

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserProfile(req.auth!.userId);
    res.json(user);
  } catch (err) {
    res
      .status((err as any).status || 500)
      .json({ message: (err as Error).message });
  }
});

export default router;
