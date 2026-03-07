import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./routes/index.js";

export const app = express();
app.set("trust proxy", 1);

const envOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);
const devOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];
const allowedOrigins = Array.from(new Set([...envOrigins, ...devOrigins]));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (!allowedOrigins.length || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "25mb" }));

app.use("/api", apiRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if ((err as any)?.type === "entity.too.large") {
    return res.status(413).json({ message: "Uploaded file is too large. Max payload is 25MB." });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});
