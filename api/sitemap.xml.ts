import type { VercelRequest, VercelResponse } from "@vercel/node";

const WP_API  = "https://cms.kolacommunications.com/wp-json/wp/v2";
const SITE    = "https://kolacommunications.com";
const PER_PAGE = 100;
const MAX_PAGES = 20; // safety cap: 2,000 entries per type

interface WPEntry { slug: string; modified: string; }

const xmlEscape = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toDate = (iso: string, fallback: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? fallback : d.toISOString().split("T")[0];
};

function urlTag(loc: string, lastmod: string, freq: string, priority: string) {
  return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/* Fetch every published item of a post type, following WordPress pagination.
   Throws if WordPress errors, so we never publish a half-empty sitemap. */
async function fetchAll(type: string): Promise<WPEntry[]> {
  const all: WPEntry[] = [];
  let totalPages = 1;

  for (let page = 1; page <= Math.min(totalPages, MAX_PAGES); page++) {
    const res = await fetch(
      `${WP_API}/${type}?per_page=${PER_PAGE}&page=${page}&status=publish&_fields=slug,modified`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`WP API ${type} page ${page}: ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error(`WP API ${type}: unexpected response`);

    all.push(...data.filter((e) => e && typeof e.slug === "string" && e.slug));
    totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1) || 1;
  }

  return all;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [posts, projects] = await Promise.all([fetchAll("posts"), fetchAll("project")]);

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = [
      urlTag(`${SITE}/`,         today, "daily",   "1.0"),
      urlTag(`${SITE}/services`, today, "monthly", "0.9"),
      urlTag(`${SITE}/projects`, today, "weekly",  "0.9"),
      urlTag(`${SITE}/blogs`,    today, "daily",   "0.9"),
      urlTag(`${SITE}/about`,    today, "monthly", "0.7"),
      urlTag(`${SITE}/contact`,  today, "monthly", "0.7"),
    ];

    const blogUrls = posts.map((p) =>
      urlTag(`${SITE}/blogs/${encodeURIComponent(p.slug)}`, toDate(p.modified, today), "weekly", "0.8")
    );

    const projectUrls = projects.map((p) =>
      urlTag(`${SITE}/project/${encodeURIComponent(p.slug)}`, toDate(p.modified, today), "monthly", "0.7")
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...blogUrls, ...projectUrls].join("")}
</urlset>`;

    // Cache for 1 hour on CDN; keep serving the last good copy for a day if WordPress is down
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600, stale-if-error=86400");
    res.status(200).send(sitemap);

  } catch (err) {
    console.error("Sitemap generation failed:", err);
    // 503 tells search engines "try again later" instead of "this sitemap is gone"
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Retry-After", "600");
    res.status(503).send("Sitemap temporarily unavailable");
  }
}
