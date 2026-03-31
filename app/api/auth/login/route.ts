/**
 * ──────────────────────────────────────────────────────────────────────────────
 * POST /api/auth/login — HITL Auth: Login Submission
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Receives the human-entered credentials + CAPTCHA answer from the client
 * and forwards them as an `application/x-www-form-urlencoded` POST to the
 * SRMIST portal's SLoginServlet.
 *
 * ─── REQUEST BODY (JSON) ────────────────────────────────────────────────────
 * {
 *   username:     string  — NetID (e.g. "jd1234")
 *   password:     string  — email password
 *   captcha:      string  — CAPTCHA answer typed by the user
 *   sessionId:    string  — JSESSIONID from /api/auth/start
 *   cookies:      string  — full cookie string from /api/auth/start
 *   csrfToken:    string  — CSRF token extracted from the login page
 *   jsChallenge:  string  — JS challenge UUID
 *   captchaToken: string  — token param from the CAPTCHA image URL
 * }
 *
 * ─── RESPONSE (JSON) ────────────────────────────────────────────────────────
 * Success: { success: true,  redirectUrl: string, portalCookies: string }
 * Failure: { success: false, error: string }
 *
 * ─── JS RESPONSE CONSTRUCTION ───────────────────────────────────────────────
 * The portal expects a `jsResponse` hidden field — a Base64 encoding of
 * challenge + browser fingerprint data. We construct a plausible value
 * server-side since the actual browser is our Next.js client, not the
 * portal's own page.
 *
 * ─── EXTENDING THIS ─────────────────────────────────────────────────────────
 * • After a successful login, you may want to set an HttpOnly cookie on
 *   the Next.js response containing the portal session, so middleware can
 *   protect routes application-wide.
 * • The portal may return a redirect (302) on success — we handle that
 *   with `redirect: "manual"`.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";

export const runtime = "edge";

const PORTAL_BASE_URL =
  process.env.PORTAL_BASE_URL ?? "https://sp.srmist.edu.in";

const LOGIN_SERVLET_PATH = "/srmiststudentportal/SLoginServlet";
const LOGIN_PAGE_PATH =
  "/srmiststudentportal/students/loginManager/youLogin.jsp";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoginRequestBody {
  username: string;
  password: string;
  captcha: string;
  sessionId: string;
  cookies: string;
  csrfToken: string;
  jsChallenge: string;
  captchaToken: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Construct the `jsResponse` field the portal expects.
 *
 * From inspecting the portal's login.js, jsResponse is Base64 of:
 *   jsChallenge + navigator.userAgent + screen.width + screen.height
 *   + screen.colorDepth + navigator.language + ...
 *
 * We build a plausible value mimicking a standard Chrome on Windows.
 */
function buildJsResponse(jsChallenge: string): string {
  // Construct the raw string the portal's JS would produce
  const screenWidth = "1920";
  const screenHeight = "1080";
  const colorDepth = "24";
  const language = "en-US";

  const raw = `${jsChallenge}${UA}${screenWidth}${screenHeight}${colorDepth}${language}`;
  return btoa(raw);
}

/**
 * Build a simple browser fingerprint string.
 * The portal's login.js generates one from canvas, WebGL, etc.
 * We send a plausible static fingerprint.
 */
function buildFingerprint(): string {
  return btoa(
    `canvas:true|webgl:true|platform:Win32|cores:8|memory:8|touch:false`
  );
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequestBody;

    const {
      username,
      password,
      captcha,
      cookies,
      csrfToken,
      jsChallenge,
    } = body;

    // Validate required fields
    if (!username || !password || !captcha) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (username, password, captcha)." },
        { status: 400 }
      );
    }

    // ── Build the form body ──────────────────────────────────────────
    const formParams = new URLSearchParams();
    formParams.set("username", username);
    formParams.set("password", password);
    formParams.set("captcha", captcha);
    formParams.set("txtPageAction", "0");
    formParams.set("csrfToken", csrfToken ?? "");
    formParams.set("jsChallenge", jsChallenge ?? "");
    formParams.set("jsResponse", buildJsResponse(jsChallenge ?? ""));
    formParams.set("fingerprint", buildFingerprint());
    formParams.set("netId", ""); // honeypot — must be empty

    // ── POST to the portal's login servlet ───────────────────────────
    const loginUrl = `${PORTAL_BASE_URL}${LOGIN_SERVLET_PATH}`;

    const portalRes = await fetch(loginUrl, {
      method: "POST",
      redirect: "manual", // Capture redirect instead of following
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
        "User-Agent": UA,
        Referer: `${PORTAL_BASE_URL}${LOGIN_PAGE_PATH}`,
        Origin: PORTAL_BASE_URL,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      body: formParams.toString(),
    });

    // ── Interpret the response ───────────────────────────────────────
    const status = portalRes.status;
    const location = portalRes.headers.get("location");

    // Collect any new cookies the portal set (updated session, etc.)
    const portalSetCookies: string[] =
      typeof portalRes.headers.getSetCookie === "function"
        ? portalRes.headers.getSetCookie()
        : (portalRes.headers.get("set-cookie") ?? "").split(",");

    const updatedCookies = portalSetCookies
      .map((c) => c.split(";")[0].trim())
      .filter(Boolean)
      .join("; ");

    // A successful login typically produces a 302 redirect to the
    // student home page. A failed login redirects back to the login
    // page or returns a 200 with an error message in the HTML.
    if (status === 302 && location && !location.includes("youLogin")) {
      return NextResponse.json({
        success: true,
        redirectUrl: location.startsWith("http")
          ? location
          : `${PORTAL_BASE_URL}${location}`,
        portalCookies: updatedCookies || cookies,
      });
    }

    // If we got a 200 or a redirect back to the login page → failure
    // Try to extract the error message from the response body
    let errorMessage = "Invalid credentials or CAPTCHA. Please try again.";
    try {
      const responseHtml = await portalRes.text();
      // Look for common error patterns in the portal's response
      const alertMatch = responseHtml.match(
        /(?:alert\s*\(\s*["']([^"']+)["']\s*\))|(?:class\s*=\s*["']error["'][^>]*>([^<]+)<)/i
      );
      if (alertMatch) {
        errorMessage = (alertMatch[1] || alertMatch[2]).trim();
      }
      // Also check for the modal error message used by the portal
      const modalMatch = responseHtml.match(
        /id\s*=\s*["']errorMsg["'][^>]*>([^<]+)</i
      );
      if (modalMatch) {
        errorMessage = modalMatch[1].trim();
      }
    } catch {
      // Ignore body read errors
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error during login";
    console.error("[api/auth/login]", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
