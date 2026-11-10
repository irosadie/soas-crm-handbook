import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const demoUsername = process.env.DOCS_DEMO_USERNAME || "demo";
const demoPassword = process.env.DOCS_DEMO_PASSWORD || "demo123";

function matches(value: string, expected: string) {
  const received = Buffer.from(value);
  const configured = Buffer.from(expected);
  return received.length === configured.length && timingSafeEqual(received, configured);
}

function parseBasic(header: string): [string, string] | null {
  const [scheme, encoded] = header.split(/\s+/, 2);
  if (scheme?.toLowerCase() !== "basic" || !encoded) return null;
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const sep = decoded.indexOf(":");
    return sep >= 0 ? [decoded.slice(0, sep), decoded.slice(sep + 1)] : null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  // 1. Check HTTP Basic Authorization header
  const authHeader = request.headers.get("authorization") ?? "";
  const credsFromHeader = parseBasic(authHeader);
  if (credsFromHeader && matches(credsFromHeader[0], demoUsername) && matches(credsFromHeader[1], demoPassword)) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Authorization, Cookie");
    return response;
  }

  // 2. Check auth cookie (useful for preview and webviews without native HTTP Basic prompt)
  const cookieAuth = request.cookies.get("docs_auth")?.value;
  if (cookieAuth) {
    try {
      const decoded = Buffer.from(cookieAuth, "base64").toString("utf8");
      const sep = decoded.indexOf(":");
      if (
        sep >= 0 &&
        matches(decoded.slice(0, sep), demoUsername) &&
        matches(decoded.slice(sep + 1), demoPassword)
      ) {
        const response = NextResponse.next();
        response.headers.set("Cache-Control", "private, no-store");
        response.headers.set("Vary", "Authorization, Cookie");
        return response;
      }
    } catch {
      // Invalid cookie, proceed to auth challenge
    }
  }

  // 3. One-click demo login via query parameter (e.g. ?demo=1)
  const demoParam = request.nextUrl.searchParams.get("demo");
  if (demoParam === "1" || demoParam === "true") {
    const nextUrl = request.nextUrl.clone();
    nextUrl.searchParams.delete("demo");
    const response = NextResponse.redirect(nextUrl);
    const token = Buffer.from(`${demoUsername}:${demoPassword}`).toString("base64");
    response.cookies.set("docs_auth", token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // 4. Return 401 with Basic Auth challenge and an HTML page for preview/webviews
  const currentPathWithSearch = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login · SOAS CRM Handbook</title>
  <style>
    :root {
      --bg: #0c121e;
      --card: #151f32;
      --border: #23334d;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      max-width: 440px;
      width: 100%;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #fff; }
    p.lead { font-size: 14px; color: var(--muted); line-height: 1.5; margin-bottom: 20px; }
    .badge {
      display: inline-block;
      background: rgba(37, 99, 235, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(37, 99, 235, 0.3);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .demo-btn {
      display: block;
      width: 100%;
      text-align: center;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 18px;
      border-radius: 8px;
      transition: background 0.15s ease;
      cursor: pointer;
      border: none;
    }
    .demo-btn:hover { background: var(--accent-hover); }
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--muted);
      font-size: 12px;
      margin: 20px 0;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border);
    }
    .divider::before { margin-right: 10px; }
    .divider::after { margin-left: 10px; }
    label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; font-weight: 500; }
    input {
      width: 100%;
      padding: 10px 12px;
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 6px;
      color: #fff;
      font-size: 14px;
      margin-bottom: 14px;
    }
    input:focus { outline: none; border-color: var(--accent); }
    .submit-btn {
      width: 100%;
      padding: 10px;
      background: #334155;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .submit-btn:hover { background: #475569; }
    .note { margin-top: 20px; font-size: 12px; color: var(--muted); line-height: 1.5; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Automa8e · SOAS Pte. Ltd.</span>
    <h1>SOAS CRM Handbook</h1>
    <p class="lead">Login dibutuhkan untuk membuka SOAS CRM Handbook. Browser preview tidak mendukung dialog pop-up HTTP Basic Auth bawaan.</p>
    
    <a class="demo-btn" href="${currentPathWithSearch}${currentPathWithSearch.includes('?') ? '&' : '?'}demo=1">
      Masuk dengan Akun Demo &rarr;
    </a>

    <div class="divider">atau masukkan akun</div>

    <form onsubmit="handleManualLogin(event)">
      <div>
        <label for="u">Username</label>
        <input id="u" type="text" value="demo" required />
      </div>
      <div>
        <label for="p">Password</label>
        <input id="p" type="password" value="demo123" required />
      </div>
      <button class="submit-btn" type="submit">Masuk Manual</button>
    </form>

    <p class="note">Kredensial demo: <code>demo</code> / <code>demo123</code></p>
  </div>

  <script>
    function handleManualLogin(e) {
      e.preventDefault();
      const u = document.getElementById('u').value.trim();
      const p = document.getElementById('p').value;
      const token = btoa(u + ':' + p);
      document.cookie = 'docs_auth=' + token + '; path=/; max-age=' + (60*60*24*30) + '; SameSite=Lax';
      window.location.reload();
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "WWW-Authenticate": 'Basic realm="SOAS CRM Handbook", charset="UTF-8"',
      "Cache-Control": "private, no-store, max-age=0",
      "Vary": "Authorization, Cookie",
    },
  });
}

export const config = {
  matcher: ["/docs/:path*"],
};
