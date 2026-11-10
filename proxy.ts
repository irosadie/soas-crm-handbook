import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const demoUsername = process.env.DOCS_DEMO_USERNAME || "demo";
const demoPassword = process.env.DOCS_DEMO_PASSWORD || "demo123";

function matches(value: string, expected: string) {
  const received = Buffer.from(value);
  const configured = Buffer.from(expected);
  return received.length === configured.length && timingSafeEqual(received, configured);
}

export function proxy(request: NextRequest) {
  const authorization = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = authorization.split(/\s+/, 2);

  if (scheme?.toLowerCase() === "basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separator = decoded.indexOf(":");

    if (
      separator >= 0 &&
      matches(decoded.slice(0, separator), demoUsername) &&
      matches(decoded.slice(separator + 1), demoPassword)
    ) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "private, no-store");
      response.headers.set("Vary", "Authorization");
      return response;
    }
  }

  return new NextResponse("Login dibutuhkan untuk membuka SOAS CRM Handbook.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SOAS CRM Handbook", charset="UTF-8"',
      "Cache-Control": "private, no-store, max-age=0",
      "Vary": "Authorization",
    },
  });
}

export const config = {
  matcher: ["/docs/:path*"],
};
