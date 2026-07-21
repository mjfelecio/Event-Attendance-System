import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

/** Hashes a plaintext password as `scrypt:<salt>:<derivedKey>` (hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${HASH_PREFIX}:${salt}:${derived.toString("hex")}`;
}

/** True when the stored value is already a scrypt hash (vs a legacy plaintext row). */
export function isHashedPassword(stored: string): boolean {
  return stored.startsWith(`${HASH_PREFIX}:`);
}

/**
 * Verifies a plaintext password against the stored value.
 * Falls back to direct comparison for legacy plaintext rows so existing
 * accounts keep working; callers should rehash-and-save on success.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (!isHashedPassword(stored)) {
    return stored === password;
  }

  const [, salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) {
    return false;
  }

  const expected = Buffer.from(hashHex, "hex");
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return (
    expected.length === derived.length && timingSafeEqual(expected, derived)
  );
}
