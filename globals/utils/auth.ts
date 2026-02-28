import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

const userRoleEnum = z.enum(["ORGANIZER", "ADMIN"]);
const userStatusEnum = z.enum(["PENDING", "ACTIVE", "REJECTED"]);
const eventStatusEnum = z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]);

type UserRole = z.infer<typeof userRoleEnum>;
type UserStatus = z.infer<typeof userStatusEnum>;
type EventStatus = z.infer<typeof eventStatusEnum>;

export const AUTH_COOKIE = "event-attendance-auth";

const authSessionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: userRoleEnum,
  status: userStatusEnum,
  rejectionReason: z.string().nullable().optional(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function serializeSession(session: AuthSession) {
  return encodeURIComponent(JSON.stringify(session));
}

export class AuthError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 401, code?: string) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
}

export async function setAuthSession(session: AuthSession) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, serializeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: AUTH_COOKIE, path: "/" });
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(raw);
    const parsed = authSessionSchema.safeParse(JSON.parse(decoded));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getAuthSession();
  if (!session) {
    throw new AuthError("Unauthorized", 401, "UNAUTHORIZED");
  }
  return session;
}

export function assertActiveUser(user: AuthSession) {
  if (user.status !== "ACTIVE") {
    throw new AuthError("Account not active", 403, "INACTIVE_USER");
  }
}

export function requireRole(user: AuthSession, allowed: UserRole | UserRole[]) {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError("Forbidden", 403, "FORBIDDEN");
  }
}

export function assertEventOwnership(
  event: { createdById: string | null },
  user: AuthSession
) {
  if (user.role === "ADMIN") {
    return;
  }

  if (!event.createdById || event.createdById !== user.id) {
    throw new AuthError("Forbidden", 403, "FORBIDDEN");
  }
}

export function assertEventVisibility(
  event: { createdById: string | null; status: EventStatus },
  user: AuthSession
) {
  if (user.role === "ADMIN") {
    return;
  }

  const isOwner = !!event.createdById && event.createdById === user.id;
  const isSharedApproved = event.status === "APPROVED";

  if (!isOwner && !isSharedApproved) {
    throw new AuthError("Forbidden", 403, "FORBIDDEN");
  }
}

export function assertEventStatus(
  event: { status: EventStatus },
  allowed: EventStatus | EventStatus[]
) {
  const statuses = Array.isArray(allowed) ? allowed : [allowed];
  if (!statuses.includes(event.status)) {
    throw new AuthError("Invalid event status", 409, "INVALID_STATUS");
  }
}
