import jwt from "jsonwebtoken";

export function signState(userId: number) {
  return jwt.sign(
    { userId, type: "google-link" },
    process.env.JWT_SECRET || "",
    { expiresIn: "10m" },
  );
}

export function parseState(state: string) {
  const decoded = jwt.verify(state, process.env.JWT_SECRET || "") as {
    userId: number;
    type: string;
  };
  if (decoded.type !== "google-link") throw new Error("invalid state");
  return decoded.userId;
}
