/**
 * ──────────────────────────────────────────────────────────────────────────────
 * GET /api/auth/start — HITL Auth: Session Bootstrap
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Runs on the **Edge Runtime**. Orchestrates the first leg of the
 * human-in-the-loop authentication flow against the SRMIST Student Portal:
 *
 *   1. GET  → youLogin.jsp            → extract JSESSIONID + HTML tokens
 *   2. Parse HTML                      → csrfToken, jsChallenge, captchaToken
 *   3. GET  → SCaptchaServlet          → fetch CAPTCHA image (same session)
 *   4. Convert image → Base64 data URI
 *   5. Return JSON with everything the client needs
 *
 * ─── IMPORTANT TOKENS ───────────────────────────────────────────────────────
 * The portal embeds several anti-bot/CSRF tokens in the HTML that must be
 * forwarded verbatim on the login POST:
 *
 *   • csrfToken    — classic CSRF protection token (hidden input)
 *   • jsChallenge  — UUID used to build the jsResponse proof-of-browser
 *   • captchaToken — UUID in the CAPTCHA <img> src query param
 *
 * ─── EXTENDING THIS ─────────────────────────────────────────────────────────
 * • PORTAL_BASE_URL defaults to the SRMIST portal but can be overridden
 *   via .env.local for staging/testing.
 * • If the portal changes its HTML structure, update the regex patterns
 *   in the `parseLoginPage()` helper below.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";

// ─── Config ──────────────────────────────────────────────────────────────────
export const runtime = "edge";

const PORTAL_BASE_URL =
  process.env.PORTAL_BASE_URL ?? "https://sp.srmist.edu.in";

const LOGIN_PAGE_PATH =
  "/srmiststudentportal/students/loginManager/youLogin.jsp";
const CAPTCHA_SERVLET_PATH = "/srmiststudentportal/SCaptchaServlet";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedTokens {
  csrfToken: string | null;
  jsChallenge: string | null;
  captchaToken: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract the JSESSIONID from `Set-Cookie` headers.
 */
function extractJSessionId(headers: Headers): string | null {
  const cookies: string[] =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : (headers.get("set-cookie") ?? "").split(",");

  for (const cookie of cookies) {
    const match = cookie.match(/JSESSIONID=([^;]+)/i);
    if (match) return match[1];
  }
  return null;
}

/**
 * Build a combined Cookie header from all Set-Cookie values.
 * This preserves JSESSIONID *and* any load-balancer cookies (e.g. TS…).
 */
function buildCookieHeader(headers: Headers): string {
  const cookies: string[] =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : (headers.get("set-cookie") ?? "").split(",");

  return cookies
    .map((c) => c.split(";")[0].trim()) // keep only name=value
    .filter(Boolean)
    .join("; ");
}

/**
 * Parse the login page HTML to extract embedded security tokens.
 *
 * Patterns we look for:
 *   <input … name="csrfToken" value="…" />
 *   var jsChallenge = "…";          (or in a hidden input)
 *   <img … src="…SCaptchaServlet?ts=…&token=…" />
 */
function parseLoginPage(html: string): ParsedTokens {
  // ── csrfToken (hidden input) ──
  const csrfMatch = html.match(
    /name\s*=\s*["']csrfToken["'][^>]*value\s*=\s*["']([^"']+)["']/i
  );

  // ── jsChallenge (hidden input or JS variable) ──
  const jsChallengeInputMatch = html.match(
    /name\s*=\s*["']jsChallenge["'][^>]*value\s*=\s*["']([^"']+)["']/i
  );
  const jsChallengeVarMatch = html.match(
    /(?:var|let|const)\s+jsChallenge\s*=\s*["']([^"']+)["']/i
  );

  // ── captchaToken (from the CAPTCHA image src URL) ──
  const captchaImgMatch = html.match(
    /SCaptchaServlet[^"']*token=([a-f0-9-]+)/i
  );

  return {
    csrfToken: csrfMatch?.[1] ?? null,
    jsChallenge: jsChallengeInputMatch?.[1] ?? jsChallengeVarMatch?.[1] ?? null,
    captchaToken: captchaImgMatch?.[1] ?? null,
  };
}

/**
 * Edge-safe Base64 encoding for binary data.
 */
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function inferMimeType(headers: Headers): string {
  const ct = headers.get("content-type");
  if (ct) return ct.split(";")[0].trim();
  return "image/jpeg";
}

/** Shared User-Agent for all outgoing requests. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET() {
  try {
    // ── Step 1: Fetch the login page ──────────────────────────────────
    const loginUrl = `${PORTAL_BASE_URL}${LOGIN_PAGE_PATH}`;

    const loginRes = await fetch(loginUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent": UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const sessionId = extractJSessionId(loginRes.headers);
    const allCookies = buildCookieHeader(loginRes.headers);

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "SESSION_MISSING",
          message:
            "Could not extract JSESSIONID from portal. " +
            "The portal may be down or the URL may have changed.",
        },
        { status: 502 }
      );
    }

    // ── Step 2: Parse the HTML for embedded tokens ────────────────────
    const html = await loginRes.text();
    const tokens = parseLoginPage(html);

    if (!tokens.csrfToken) {
      console.warn("[auth/start] csrfToken not found in HTML");
    }

    // ── Step 3: Build CAPTCHA URL and fetch the image ────────────────
    const ts = Date.now();
    const captchaTokenParam = tokens.captchaToken ?? "";
    const captchaUrl =
      `${PORTAL_BASE_URL}${CAPTCHA_SERVLET_PATH}` +
      `?ts=${ts}&token=${captchaTokenParam}`;

    const captchaRes = await fetch(captchaUrl, {
      method: "GET",
      headers: {
        Cookie: allCookies,
        "User-Agent": UA,
        Accept: "image/*,*/*;q=0.8",
        Referer: loginUrl,
      },
    });

    if (!captchaRes.ok) {
      return NextResponse.json(
        {
          error: "CAPTCHA_FETCH_FAILED",
          message: `CAPTCHA servlet responded with HTTP ${captchaRes.status}.`,
        },
        { status: 502 }
      );
    }

    // ── Step 4: Convert to Base64 data URI ────────────────────────────
    const imageBytes = new Uint8Array(await captchaRes.arrayBuffer());
    const mimeType = inferMimeType(captchaRes.headers);
    const base64 = uint8ArrayToBase64(imageBytes);
    const captchaDataUri = `data:${mimeType};base64,${base64}`;

    // ── Step 5: Return everything the client needs ────────────────────
    return NextResponse.json({
      sessionId,
      cookies: allCookies,
      csrfToken: tokens.csrfToken,
      jsChallenge: tokens.jsChallenge,
      captchaToken: tokens.captchaToken,
      captchaDataUri,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error during auth start";
    console.error("[api/auth/start]", message);

    return NextResponse.json(
      { error: "INTERNAL_ERROR", message },
      { status: 500 }
    );
  }
}
