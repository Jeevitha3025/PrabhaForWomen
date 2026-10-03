import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

// Verifies Firebase ID tokens without a service account, using Google's public keys.
// https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

export type FirebaseUser = { uid: string; email?: string; emailVerified: boolean; name?: string };

export function firebaseProjectId(): string {
  const id = process.env.FIREBASE_PROJECT_ID;
  if (!id) throw new Error("FIREBASE_PROJECT_ID is not configured");
  return id;
}

export async function verifyIdToken(token: string): Promise<FirebaseUser> {
  const projectId = firebaseProjectId();
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });
  const p = payload as JWTPayload & { email?: string; email_verified?: boolean; name?: string };
  if (!p.sub) throw new Error("Token has no subject");
  return { uid: p.sub, email: p.email, emailVerified: Boolean(p.email_verified), name: p.name };
}

export async function requireFirebaseUser(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing sign-in token" });
  try {
    res.locals.firebaseUser = await verifyIdToken(token);
    return next();
  } catch (err) {
    req.log?.warn({ err }, "Invalid Firebase token");
    return res.status(401).json({ error: "Invalid or expired sign-in token" });
  }
}
