import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

/*
 * Fallback for every URL that is not a static file and not handled by a more
 * specific route in vercel.json.
 *
 * The React app renders all pages from one index.html, so without this every
 * unknown URL answered "200 OK" (a "soft 404" that search engines penalise).
 * Here we work out whether the URL is real and send the same app shell with
 * the right status code; the React <NotFound /> page still renders for people.
 */

const WP_API = "https://cms.kolacommunications.com/wp-json/wp/v2";

/* Top-level paths served by the React router (see src/App.tsx) */
const STATIC_ROUTES = new Set(["/", "/about", "/about-us", "/services", "/contact", "/contact-us"]);

/* Archive routes whose slug the React app resolves on its own */
const ARCHIVE_ROUTE = /^\/(project-category|project-tag|category|tag)\/[^/]+$/;

/* Single-segment URLs such as /livyor resolve to a project or a blog post */
const SINGLE_SLUG = /^\/([a-z0-9][a-z0-9-_%]*)$/i;

let indexHtmlCache: string | null = null;
const getSPAShell = (): string => {
  if (indexHtmlCache) return indexHtmlCache;
  indexHtmlCache = fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf-8");
  return indexHtmlCache;
};

const normalise = (url: string | undefined): string => {
  const raw = (url ?? "/").split("?")[0].split("#")[0] || "/";
  const trimmed = raw.length > 1 ? raw.replace(/\/+$/, "") : raw;
  return trimmed || "/";
};

async function slugExists(slug: string): Promise<boolean | null> {
  try {
    const q = `slug=${encodeURIComponent(slug)}&status=publish&_fields=id`;
    const results = await Promise.all(
      ["project", "posts"].map(async (type) => {
        const res = await fetch(`${WP_API}/${type}?${q}`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`WP API ${type} ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) && data.length > 0;
      })
    );
    return results.some(Boolean);
  } catch (err) {
    console.error("page-render: slug lookup failed", err);
    return null; // unknown — WordPress is unreachable
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathname = normalise(req.url);

  let status = 404;
  if (STATIC_ROUTES.has(pathname.toLowerCase()) || ARCHIVE_ROUTE.test(pathname)) {
    status = 200;
  } else {
    const match = pathname.match(SINGLE_SLUG);
    if (match) {
      const exists = await slugExists(decodeURIComponent(match[1]).toLowerCase());
      // If WordPress is down, don't tell search engines the page is gone
      status = exists === null ? 503 : exists ? 200 : 404;
    }
  }

  let html: string;
  try {
    html = getSPAShell();
  } catch (e) {
    console.error("page-render: could not read index.html", e);
    return res.status(500).send("Internal Server Error");
  }

  if (status !== 200) {
    html = html.replace(/<head>/i, `<head>\n  <meta name="robots" content="noindex"/>`);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (status === 200) {
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  } else if (status === 404) {
    res.setHeader("Cache-Control", "s-maxage=60");
  } else {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Retry-After", "120");
  }
  return res.status(status).send(html);
}
