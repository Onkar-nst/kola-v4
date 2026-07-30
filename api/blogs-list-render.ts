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

const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const decodeHtmlEntities = (str: string): string =>
  str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"');

const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }).format(new Date(iso));
  } catch { return iso; }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiRes = await fetch(
      `${WP_API}/posts?per_page=6&page=1&status=publish&_embed=1` +
      `&_fields=id,title,excerpt,slug,date,modified,categories,aioseo_head_json,_embedded`,
      { signal: AbortSignal.timeout(8000) } // 8s timeout
    );

    if (!apiRes.ok) throw new Error(`WP API ${apiRes.status}`);

    const totalPages = Number(apiRes.headers.get("X-WP-TotalPages") ?? 1);
    const totalItems = Number(apiRes.headers.get("X-WP-Total") ?? 0);
    const rawPosts = (await apiRes.json()) as Array<any>;

    const normalizedPosts = rawPosts.map((p) => {
      const img = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "https://kolacommunications.com/KolaFavicon.jpg";
      const imgAlt = p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? decodeHtmlEntities(p.title.rendered);
      const categories = p._embedded?.["wp:term"]?.[0]?.map((t: any) => decodeHtmlEntities(t.name)).slice(0, 2) ?? [];
      const excerpt = decodeHtmlEntities(stripHtml(p.excerpt.rendered));

      return {
        id: p.id,
        slug: p.slug,
        title: decodeHtmlEntities(p.title.rendered),
        excerpt,
        date: p.date,
        formattedDate: formatDate(p.date),
        img,
        imgAlt,
        categories,
        categoryIds: p.categories ?? [],
        articleTags: [],
        readTime: Math.max(1, Math.round(excerpt.split(/\s+/).length / 200 * 8)), // Heuristic
      };
    });

    const metaTitle  = "Blogs & Insights | Kola Communications";
    const metaDesc   = "Read our latest thinking and articles on web development, SEO, AEO, content marketing, and brand strategy.";
    const canonical = `${SITE}/blogs`;
    const ogImage    = "https://kolacommunications.com/KolaFavicon.jpg";

    const seoTags = `
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}"/>
  <meta name="robots" content="index, follow"/>
  <link rel="canonical" href="${canonical}"/>

  <meta property="og:type"        content="website"/>
  <meta property="og:url"         content="${canonical}"/>
  <meta property="og:title"       content="${metaTitle}"/>
  <meta property="og:description" content="${metaDesc}"/>
  <meta property="og:image"       content="${ogImage}"/>

  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${metaTitle}"/>
  <meta name="twitter:description" content="${metaDesc}"/>
  <meta name="twitter:image"       content="${ogImage}"/>
  <script>window.__INITIAL_DATA__ = { blogs: { posts: ${safeJsonStringify(normalizedPosts)}, totalPages: ${totalPages}, totalItems: ${totalItems} } };</script>
    `;

    const bodyContent = `
<div class="blogs-list-seo-render" style="font-family: system-ui, -apple-system, sans-serif; max-width: 1000px; margin: 0 auto; padding: 3rem 1rem;">
  <h1 style="font-size: 3rem; margin-bottom: 2rem;">Blogs & Insights</h1>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
    ${normalizedPosts.map(p => `
      <article style="border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
        ${p.img ? `<img src="${p.img}" alt="${p.title}" style="width: 100%; height: 200px; object-fit: cover;" />` : ""}
        <div style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column;">
          <h2 style="font-size: 1.5rem; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/blogs/${p.slug}" style="color: #000; text-decoration: none;">${p.title}</a>
          </h2>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1;">${p.excerpt}</p>
          <a href="/blogs/${p.slug}" style="color: #000; text-decoration: none; font-weight: 600; font-size: 0.95rem;">Read More &rarr;</a>
        </div>
      </article>
    `).join("")}
  </div>
</div>
    `;

    let html = getSPAShell();
    html = html.replace(/<title>[^<]*<\/title>/i, seoTags);
    html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${bodyContent}</div>`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).send(html);

  } catch (err) {
    console.error("Blogs list SSR failed, falling back to SPA shell:", err);
    try {
      const html = getSPAShell();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    } catch {
      return res.redirect(302, "/");
    }
  }
}
