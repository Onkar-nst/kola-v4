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
/* WordPress titles arrive HTML-encoded already; only neutralise quotes/brackets
   that could break out of an attribute or inject tags */
const attrSafe = (str: string): string =>
  String(str).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
      `${WP_API}/project?slug=${encodeURIComponent(slug)}&status=publish&_embed=1&acf_format=standard`,
      { signal: AbortSignal.timeout(8000) } // 8s timeout
    );

    if (!apiRes.ok) throw new Error(`WP API ${apiRes.status}`);

    const projects = (await apiRes.json()) as Array<any>;

    if (!Array.isArray(projects) || !projects.length) {
      // Real 404 status, but still the site's own "not found" page for visitors
      const shell = getSPAShell().replace(/<head>/i, `<head>\n  <meta name="robots" content="noindex"/>`);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "s-maxage=60");
      return res.status(404).send(shell);
    }

    const project   = projects[0];
    const seo       = (project.aioseo_head_json ?? {}) as Record<string, any>;
    const title     = (project.acf?.project_name as string) || project.title.rendered;
    const content   = project.content.rendered;
    const featImg   = project._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "https://kolacommunications.com/KolaFavicon.jpg";
    const canonical = `${SITE}/project/${encodeURIComponent(slug)}`;

    const metaTitle  = escapeHtml((seo.title as string) ?? title);
    const metaDesc   = escapeHtml((seo.description as string) ?? "Read details about our project: " + title);
    const ogTitle    = escapeHtml((seo["og:title"] as string) ?? title);
    const ogDesc     = escapeHtml((seo["og:description"] as string) ?? metaDesc);
    const robotsMeta = "index, follow";
    const jsonLd     = seo.schema ? safeJsonStringify(seo.schema) : null;

    /* New case-study fields (ACF "Projects" group) */
    const acf = (project.acf ?? {}) as Record<string, any>;
    const txt = (v: unknown) => escapeHtml(String(v ?? "").trim());
    const lines = (v: unknown) => String(v ?? "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const faqs = [1, 2, 3, 4, 5]
      .map((n) => ({ q: String(acf[`faq_${n}_question`] ?? "").trim(), a: String(acf[`faq_${n}_answer`] ?? "").trim() }))
      .filter((f) => f.q && f.a);
    const isCaseStudy = Boolean(acf.brief || acf.approach);
    const faqLd = faqs.length
      ? safeJsonStringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        })
      : null;

    const seoTags = `
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}"/>
  <meta name="robots" content="${robotsMeta}"/>
  <link rel="canonical" href="${canonical}"/>

  <meta property="og:type"        content="article"/>
  <meta property="og:url"         content="${canonical}"/>
  <meta property="og:title"       content="${ogTitle}"/>
  <meta property="og:description" content="${ogDesc}"/>
  <meta property="og:image"       content="${attrSafe(featImg)}"/>

  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${ogTitle}"/>
  <meta name="twitter:description" content="${ogDesc}"/>
  <meta name="twitter:image"       content="${attrSafe(featImg)}"/>
  <script>window.__INITIAL_DATA__ = { project: ${safeJsonStringify(project)} };</script>
  ${jsonLd ? `<script type="application/ld+json" id="kola-project-jsonld">${jsonLd}</script>` : ""}
  ${faqLd ? `<script type="application/ld+json" id="kola-project-faq">${faqLd}</script>` : ""}
    `;

    const bodyContent = `
<div class="project-seo-render" style="padding: 2rem; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  <h1>${attrSafe(title)}</h1>
  ${featImg && featImg !== "https://kolacommunications.com/KolaFavicon.jpg" ? `<img src="${attrSafe(featImg)}" alt="${attrSafe(title)}" style="max-width:100%; height:auto; margin: 1rem 0; border-radius: 8px;" />` : ""}
  ${isCaseStudy ? `
  ${acf.tagline ? `<p><strong>${txt(acf.tagline)}</strong></p>` : ""}
  <ul>
    ${acf.industry ? `<li>Industry: ${txt(acf.industry)}</li>` : ""}
    ${acf.platform ? `<li>Platform: ${txt(acf.platform)}</li>` : ""}
    ${acf.location ? `<li>Location: ${txt(acf.location)}</li>` : ""}
    ${acf.website_url ? `<li>Website: <a href="${attrSafe(acf.website_url)}">${txt(acf.website_url)}</a></li>` : ""}
  </ul>
  <h2>Overview</h2>
  ${acf.about_client ? `<p>${txt(acf.about_client)}</p>` : ""}
  <div class="content">${content}</div>
  ${acf.brief ? `<h2>The brief</h2><p>${txt(acf.brief)}</p>` : ""}
  ${acf.approach ? `<h2>${txt(acf.approach_heading || "Our approach")}</h2>${acf.approach}` : ""}
  ${lines(acf.deliverables).length ? `<h2>What we delivered</h2><ul>${lines(acf.deliverables).map((d) => `<li>${txt(d)}</li>`).join("")}</ul>` : ""}
  ${lines(acf.results).length ? `<h2>Results</h2><ul>${lines(acf.results).map((d) => `<li>${txt(d)}</li>`).join("")}</ul>` : ""}
  ${faqs.length ? `<h2>Frequently asked questions</h2>${faqs.map((f) => `<h3>${txt(f.q)}</h3><p>${txt(f.a)}</p>`).join("")}` : ""}
  ` : `<div class="content" style="line-height: 1.8; font-size: 1.1rem; color: #1a1a1a;">${content}</div>`}
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
