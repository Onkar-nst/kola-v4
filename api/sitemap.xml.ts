import type { VercelRequest, VercelResponse } from "@vercel/node";

const WP_API  = "https://cms.kolacommunications.com/wp-json/wp/v2";
const SITE    = "https://kolacommunications.com";

interface WPEntry { slug: string; modified: string; }

function urlTag(loc: string, lastmod: string, freq: string, priority: string) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    // Fetch all published blog posts and projects in parallel
    const [postsRes, projectsRes] = await Promise.all([
      fetch(`${WP_API}/posts?per_page=100&status=publish&_fields=slug,modified`),
      fetch(`${WP_API}/projects?per_page=100&status=publish&_fields=slug,modified`),
    ]);

    const [posts, projects]: [WPEntry[], WPEntry[]] = await Promise.all([
      postsRes.json(),
      projectsRes.json(),
    ]);

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = [
      urlTag(`${SITE}/`,        today, "daily",  "1.0"),
      urlTag(`${SITE}/projects`, today, "weekly", "0.9"),
      urlTag(`${SITE}/blogs`,   today, "daily", "0.9"),
    ];

    const blogUrls = posts.map((p) =>
      urlTag(
        `${SITE}/blogs/${p.slug}`,
        new Date(p.modified).toISOString().split("T")[0],
        "weekly",
        "0.8"
      )
    );

    const projectUrls = projects.map((p) =>
      urlTag(
        `${SITE}/project/${p.slug}`,
        new Date(p.modified).toISOString().split("T")[0],
        "monthly",
        "0.7"
      )
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...blogUrls, ...projectUrls].join("")}
</urlset>`;

    // Cache for 1 hour on CDN, serve stale while regenerating
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    res.status(200).send(sitemap);

  } catch (err) {
    console.error("Sitemap generation failed:", err);
    res.status(500).send("Failed to generate sitemap");
  }
}