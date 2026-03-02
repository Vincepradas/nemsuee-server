import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../db.js", () => ({
  prisma: prismaMock,
}));

import { app } from "../app.js";

describe("API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("POST /api/auth/register validates payload", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "A",
      email: "invalid",
      password: "123",
      role: "STUDENT",
    });

    expect(res.status).toBe(400);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("POST /api/auth/login returns 401 for unknown user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "nouser@test.com",
      password: "password",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
