import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

const BOT_PATTERN = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|twitterbot|linkedinbot|facebot|applebot|googleother|google-inspectiontool/i;

const WP_API = "https://cms.kolacommunications.com/wp-json/wp/v2";
const SITE   = "https://kolacommunications.com";

/* ── Cache index.html in memory after first read ── */
let indexHtmlCache: string | null = null;
const getSPAShell = (): string => {
  if (indexHtmlCache) return indexHtmlCache;
  // "dist/index.html" is bundled into this function via vercel.json includeFiles
  const filePath = path.join(process.cwd(), "dist", "index.html");
  indexHtmlCache = fs.readFileSync(filePath, "utf-8");
  return indexHtmlCache;
};

/* ── Escape special chars for HTML attribute values ── */
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/* ── Main handler ── */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ua    = (req.headers["user-agent"] ?? "").toString();
  const isBot = BOT_PATTERN.test(ua);

  // Extract slug: /blogs/my-post-slug → "my-post-slug"
  const slug = req.url?.split("/blogs/")[1]?.split("?")[0] ?? "";

  /* ────────────────────────────────────────────
     NON-BOT: serve the React SPA shell normally
  ──────────────────────────────────────────── */
  if (!isBot || !slug) {
    try {
      const html = getSPAShell();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      return res.status(200).send(html);
    } catch (e) {
      console.error("Could not read index.html:", e);
      // Fallback: hard redirect to home
      return res.redirect(302, "/");
    }
  }

  /* ────────────────────────────────────────────
     BOT: fetch from WP and return full HTML
  ──────────────────────────────────────────── */
  try {
    const apiRes = await fetch(
      `${WP_API}/posts?slug=${encodeURIComponent(slug)}&status=publish&_embed=1` +
      `&_fields=title,excerpt,content,slug,date,modified,aioseo_head_json,_embedded`,
      { signal: AbortSignal.timeout(8000) } // 8s timeout
    );

    if (!apiRes.ok) throw new Error(`WP API ${apiRes.status}`);

    const posts = (await apiRes.json()) as Array<{
      slug: string;
      title: { rendered: string };
      excerpt: { rendered: string };
      content: { rendered: string };
      aioseo_head_json?: Record<string, unknown>;
      _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
    }>;

    if (!posts.length) {
      // Real 404 — tell Google this page doesn't exist
      return res.status(404).send(
        `<!DOCTYPE html><html><head><title>Not Found</title>
         <meta name="robots" content="noindex"/></head>
         <body><h1>404 – Page not found</h1></body></html>`
      );
    }

    const post      = posts[0];
    const seo       = (post.aioseo_head_json ?? {}) as Record<string, unknown>;
    const title     = post.title.rendered;
    const excerpt   = post.excerpt.rendered.replace(/<[^>]+>/g, "").trim();
    const content   = post.content.rendered;
    const featImg   = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
    const canonical = `${SITE}/blogs/${slug}`;

    const metaTitle  = escapeHtml((seo.title as string) ?? title);
    const metaDesc   = escapeHtml((seo.description as string) ?? excerpt);
    const ogTitle    = escapeHtml((seo["og:title"] as string) ?? title);
    const ogDesc     = escapeHtml((seo["og:description"] as string) ?? excerpt);
    const robotsMeta = "index, follow";
    const jsonLd     = seo.schema ? JSON.stringify(seo.schema) : null;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}"/>
  <meta name="robots" content="${robotsMeta}"/>
  <link rel="canonical" href="${canonical}"/>

  <meta property="og:type"        content="article"/>
  <meta property="og:url"         content="${canonical}"/>
  <meta property="og:title"       content="${ogTitle}"/>
  <meta property="og:description" content="${ogDesc}"/>
  <meta property="og:image"       content="${featImg}"/>

  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${ogTitle}"/>
  <meta name="twitter:description" content="${ogDesc}"/>
  <meta name="twitter:image"       content="${featImg}"/>

  ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
</head>
<body>
  <article>
    <h1>${title}</h1>
    ${content}
  </article>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).send(html);

  } catch (err) {
    console.error("Bot SSR failed, falling back to SPA shell:", err);
    // On any error, fall back to SPA shell — better than a broken page
    try {
      const html = getSPAShell();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    } catch {
      return res.redirect(302, "/");
    }
  }
}