import type { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwksUrl = process.env.SUPABASE_JWKS_URL;
if (!jwksUrl) throw new Error("Missing SUPABASE_JWKS_URL in server/.env");

const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ error: "Missing Bearer token" });

    const { payload } = await jwtVerify(token, JWKS, {
      // Supabase access tokens are usually signed with RS256
      // Audience/issuer checks can be added later if needed
    });

    (req as any).user = payload; // contains sub (user id), email, etc.
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}