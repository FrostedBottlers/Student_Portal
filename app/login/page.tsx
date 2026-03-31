/**
 * ──────────────────────────────────────────────────────────────────────────────
 * /login — Human-in-the-Loop Login Page  (SRMIST Student Portal)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * A React **Client Component** that:
 *   1. Calls GET /api/auth/start on mount to bootstrap a portal session
 *   2. Renders the CAPTCHA image returned as a Base64 data URI
 *   3. Presents a form: NetID · Password · CAPTCHA answer
 *   4. On submit, POSTs to /api/auth/login with credentials + all tokens
 *
 * ─── FRONTEND DEVELOPER GUIDE ───────────────────────────────────────────────
 *
 * ### Design Tokens & Theming
 * All colours / spacing / radii come from Tailwind's default palette.
 * Both **light** and **dark mode** are supported via `dark:` variants.
 * To customise the palette → `tailwind.config.ts` → `theme.extend`.
 *
 * ### Component Architecture (extract as the app grows)
 * ┌─ components/
 * │  ├─ ui/
 * │  │  ├─ Input.tsx          — styled input with label + error state
 * │  │  ├─ Button.tsx         — primary / secondary / ghost / loading
 * │  │  ├─ Spinner.tsx        — reusable loading spinner (SVG-based)
 * │  │  └─ Alert.tsx          — error / success / info banners
 * │  └─ auth/
 * │     ├─ CaptchaBlock.tsx   — CAPTCHA image + refresh button
 * │     └─ LoginForm.tsx      — the credential form
 * └─ providers/
 *    └─ AuthProvider.tsx      — React Context for session state
 *
 * ### State Management
 * Currently local `useState`. For cross-page auth state consider:
 *   - React Context (`AuthProvider` wrapping the root layout)
 *   - Zustand / Jotai for lightweight global stores
 *   - iron-session for encrypted cookie-based sessions
 *
 * ### Form Handling & Validation (recommended for production)
 *   - `react-hook-form` for performant, ref-based form state
 *   - `zod` for schema validation (shared with API routes)
 *   - Display field-level errors beneath each input
 *
 * ### Accessibility Checklist
 *   ✓  All inputs have associated <label> elements
 *   ✓  The form uses semantic <form> + <button type="submit">
 *   ✓  Focus rings for keyboard navigation
 *   ✓  CAPTCHA image has descriptive alt text
 *   ✓  Error banner has role="alert"
 *   ○  Add aria-describedby for field-level errors
 *   ○  Add skip-to-content link in layout
 *
 * ### Post-Login Flow
 * On successful login, the API returns `{ redirectUrl, portalCookies }`.
 * The redirect URL points to the portal's authenticated dashboard.
 * Future work: store portalCookies in an HttpOnly cookie via middleware
 * so subsequent API routes can proxy authenticated portal requests.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback, useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

/** Shape of the JSON returned by GET /api/auth/start */
interface AuthStartResponse {
  sessionId: string;
  cookies: string;
  csrfToken: string | null;
  jsChallenge: string | null;
  captchaToken: string | null;
  captchaDataUri: string;
}

interface AuthStartError {
  error: string;
  message: string;
}

/** Stored session state from the bootstrap call */
interface SessionState {
  sessionId: string;
  cookies: string;
  csrfToken: string;
  jsChallenge: string;
  captchaToken: string;
  captchaDataUri: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  // ── Session bootstrap state ──────────────────────────────────────────────
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Form field state ─────────────────────────────────────────────────────
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch session + CAPTCHA from the API ─────────────────────────────────
  const bootstrapSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/start");
      const body = await res.json();

      if (!res.ok) {
        const errBody = body as AuthStartError;
        throw new Error(errBody.message || `HTTP ${res.status}`);
      }

      const data = body as AuthStartResponse;
      setSession({
        sessionId: data.sessionId,
        cookies: data.cookies,
        csrfToken: data.csrfToken ?? "",
        jsChallenge: data.jsChallenge ?? "",
        captchaToken: data.captchaToken ?? "",
        captchaDataUri: data.captchaDataUri,
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load login session"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  // ── Form submission handler ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          captcha: captchaInput,
          sessionId: session.sessionId,
          cookies: session.cookies,
          csrfToken: session.csrfToken,
          jsChallenge: session.jsChallenge,
          captchaToken: session.captchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      // ── Success → navigate to the portal dashboard ──
      // TODO: In production, store portalCookies via a server action
      //       or HttpOnly cookie before redirecting.
      window.location.href = data.redirectUrl ?? "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
      // Refresh CAPTCHA — the portal invalidates it after each attempt
      await bootstrapSession();
    } finally {
      setSubmitting(false);
      setCaptchaInput("");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* ── Ambient glow blobs ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* ── Card ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md animate-[fadeSlideUp_0.5s_ease-out_both] rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-10">
        {/* ── Logo / Brand ──────────────────────────────────────────── */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Student Portal
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in with your SRMIST NetID credentials
          </p>
        </div>

        {/* ── Loading state ─────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-400" />
            </div>
            <p className="text-sm text-slate-400">
              Establishing secure session…
            </p>
          </div>
        )}

        {/* ── Error banner ──────────────────────────────────────────── */}
        {error && !loading && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── Form ──────────────────────────────────────────────────── */}
        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NetID */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                NetID{" "}
                <span className="font-normal text-slate-500">
                  (without @srmist.edu.in)
                </span>
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                placeholder="e.g. jd1234"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-transparent transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-indigo-500/30"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-transparent transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-indigo-500/30"
              />
              <div className="mt-1.5 text-right">
                <a
                  href="https://ssp.srmist.edu.in/resetpassword/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* CAPTCHA Block */}
            <div>
              <label
                htmlFor="captcha"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                CAPTCHA Verification
              </label>

              {/* CAPTCHA image + refresh */}
              <div className="mb-2 flex items-center gap-3">
                {session?.captchaDataUri ? (
                  <div className="overflow-hidden rounded-lg border border-white/10 bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.captchaDataUri}
                      alt="CAPTCHA verification image — type the characters you see"
                      className="h-10 w-auto select-none"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-28 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-slate-500">
                    No image
                  </div>
                )}

                {/* Refresh CAPTCHA button */}
                <button
                  type="button"
                  onClick={bootstrapSession}
                  disabled={loading}
                  title="Refresh CAPTCHA"
                  className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                    />
                  </svg>
                </button>
              </div>

              <input
                id="captcha"
                type="text"
                required
                autoComplete="off"
                placeholder="Enter the characters above"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-transparent transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-indigo-500/30"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !session}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}

        {/* ── Footer ────────────────────────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Having trouble?{" "}
          <a
            href="https://ssp.srmist.edu.in/resetpassword/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Contact IT Support
          </a>
        </p>
      </div>
    </div>
  );
}
