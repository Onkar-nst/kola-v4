import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

const WP_API = "https://cms.kolacommunications.com/wp-json/wp/v2";
const SITE   = "https://kolacommunications.com";

/* ── Cache index.html in memory after first read ── */
let indexHtmlCache: string | null = null;
const getSPAShell = (): string => {
  if (indexHtmlCache) return indexHtmlCache;
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

/* ── Prevent script injection in JSON data ── */
const safeJsonStringify = (obj: any): string =>
  JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

/* ── Main handler ── */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract slug: /project/my-project-slug → "my-project-slug"
  const slug = req.url?.split("/project/")[1]?.split("?")[0] ?? "";

  if (!slug) {
    try {
      const html = getSPAShell();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      return res.status(200).send(html);
    } catch (e) {
      console.error("Could not read index.html:", e);
      return res.redirect(302, "/");
    }
  }

  try {
    const apiRes = await fetch(
      `${WP_API}/projects?slug=${encodeURIComponent(slug)}&status=publish&_embed=1`,
      { signal: AbortSignal.timeout(8000) } // 8s timeout
    );

    if (!apiRes.ok) throw new Error(`WP API ${apiRes.status}`);

    const projects = (await apiRes.json()) as Array<any>;

    if (!projects.length) {
      return res.status(404).send(
        `<!DOCTYPE html><html><head><title>Not Found</title>
         <meta name="robots" content="noindex"/></head>
         <body><h1>404 – Project not found</h1></body></html>`
      );
    }

    const project   = projects[0];
    const seo       = (project.aioseo_head_json ?? {}) as Record<string, any>;
    const title     = project.title.rendered;
    const content   = project.content.rendered;
    const featImg   = project._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "https://kolacommunications.com/KolaFavicon.jpg";
    const canonical = `${SITE}/project/${slug}`;

    const metaTitle  = escapeHtml((seo.title as string) ?? title);
    const metaDesc   = escapeHtml((seo.description as string) ?? "Read details about our project: " + title);
    const ogTitle    = escapeHtml((seo["og:title"] as string) ?? title);
    const ogDesc     = escapeHtml((seo["og:description"] as string) ?? metaDesc);
    const robotsMeta = "index, follow";
    const jsonLd     = seo.schema ? JSON.stringify(seo.schema) : null;

    const seoTags = `
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
  <script>window.__INITIAL_DATA__ = { project: ${safeJsonStringify(project)} };</script>
  ${jsonLd ? `<script type="application/ld+json" id="kola-project-jsonld">${jsonLd}</script>` : ""}
    `;

    const bodyContent = `
<div class="project-seo-render" style="padding: 2rem; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  <h1>${title}</h1>
  ${featImg && featImg !== "https://kolacommunications.com/KolaFavicon.jpg" ? `<img src="${featImg}" alt="${title}" style="max-width:100%; height:auto; margin: 1rem 0; border-radius: 8px;" />` : ""}
  <div class="content" style="line-height: 1.8; font-size: 1.1rem; color: #1a1a1a;">${content}</div>
</div>
    `;

    let html = getSPAShell();
    html = html.replace(/<title>[^<]*<\/title>/i, seoTags);
    html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${bodyContent}</div>`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).send(html);

  } catch (err) {
    console.error("Project SSR failed, falling back to SPA shell:", err);
    try {
      const html = getSPAShell();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    } catch {
      return res.redirect(302, "/");
    }
  }
}
