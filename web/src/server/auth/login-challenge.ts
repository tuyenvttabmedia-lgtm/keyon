import { SignJWT, jwtVerify } from "jose";

const PURPOSE = "login-totp";
const TTL = "5m";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return new TextEncoder().encode(s);
}

/** Short-lived proof that password + Turnstile already passed — skip re-verify on 2FA step. */
export async function mintLoginTotpChallenge(input: {
  userId: string;
  email: string;
}): Promise<string> {
  return new SignJWT({
    purpose: PURPOSE,
    email: input.email.toLowerCase(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(secret());
}

export async function verifyLoginTotpChallenge(
  token: string | undefined,
  email: string,
): Promise<boolean> {
  if (!token?.trim()) return false;
  try {
    const { payload } = await jwtVerify(token.trim(), secret());
    return (
      payload.purpose === PURPOSE &&
      typeof payload.email === "string" &&
      payload.email === email.toLowerCase() &&
      typeof payload.sub === "string"
    );
  } catch {
    return false;
  }
}
