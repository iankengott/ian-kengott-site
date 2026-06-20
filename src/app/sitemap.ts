import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://iankengott.github.io/ian-kengott-site";
const LAST_MODIFIED = new Date("2026-06-20T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/#research`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/#systems`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/#projects`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/#journey`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/#connect`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
