import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectPage from "./ProjectsPage";
import BlogPage from "./BlogPage";
import NotFound from "./NotFound";
import Loading from "@/components/Projectpageloader";

const WP_API_BASE = "https://cms.kolacommunications.com/wp-json/wp/v2";

// In-memory cache for resolved slug types to avoid repeat network waterfalls
const slugTypeCache = new Map<string, "project" | "blog" | "not-found">();

export const setCachedSlugType = (slug: string, type: "project" | "blog") => {
  slugTypeCache.set(slug.toLowerCase(), type);
};

const SlugResolver = () => {
  const { slug } = useParams<{ slug: string }>();
  const normalizedSlug = slug ? slug.toLowerCase() : "";

  const [resolvedType, setResolvedType] = useState<"project" | "blog" | "not-found" | "loading">(
    () => {
      if (!normalizedSlug) return "not-found";
      return slugTypeCache.get(normalizedSlug) || "loading";
    }
  );

  useEffect(() => {
    if (!normalizedSlug) {
      setResolvedType("not-found");
      return;
    }

    if (slugTypeCache.has(normalizedSlug)) {
      setResolvedType(slugTypeCache.get(normalizedSlug)!);
      return;
    }

    let cancelled = false;
    setResolvedType("loading");

    // Fetch projects and posts in parallel to quickly determine content type
    Promise.allSettled([
      fetch(`${WP_API_BASE}/projects?slug=${encodeURIComponent(normalizedSlug)}&_fields=id,slug`),
      fetch(`${WP_API_BASE}/posts?slug=${encodeURIComponent(normalizedSlug)}&_fields=id,slug`),
    ])
      .then(async ([projRes, blogRes]) => {
        if (cancelled) return;

        let isProject = false;
        let isBlog = false;

        if (projRes.status === "fulfilled" && projRes.value.ok) {
          try {
            const data = await projRes.value.json();
            if (Array.isArray(data) && data.length > 0) {
              isProject = true;
            }
          } catch {}
        }

        if (!isProject && blogRes.status === "fulfilled" && blogRes.value.ok) {
          try {
            const data = await blogRes.value.json();
            if (Array.isArray(data) && data.length > 0) {
              isBlog = true;
            }
          } catch {}
        }

        if (cancelled) return;

        if (isProject) {
          slugTypeCache.set(normalizedSlug, "project");
          setResolvedType("project");
        } else if (isBlog) {
          slugTypeCache.set(normalizedSlug, "blog");
          setResolvedType("blog");
        } else {
          slugTypeCache.set(normalizedSlug, "not-found");
          setResolvedType("not-found");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedType("not-found");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedSlug]);

  if (resolvedType === "loading") {
    return <Loading />;
  }

  if (resolvedType === "project") {
    return <ProjectPage />;
  }

  if (resolvedType === "blog") {
    return <BlogPage />;
  }

  return <NotFound />;
};

export default SlugResolver;
