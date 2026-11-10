import type { MetadataRoute } from "next";
import { loadEvents, loadMinistries, loadSermons } from "@/content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/plan-your-visit",
    "/live",
    "/sermons",
    "/events",
    "/ministries",
    "/give",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/give" ? 0.9 : 0.7,
  }));

  const [sermons, events, ministries] = await Promise.all([
    loadSermons(),
    loadEvents(),
    loadMinistries(),
  ]);

  const sermonRoutes: MetadataRoute.Sitemap = sermons.map((sermon) => ({
    url: `${baseUrl}/sermons/${sermon.slug}`,
    lastModified: new Date(sermon.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const ministryRoutes: MetadataRoute.Sitemap = ministries.map((ministry) => ({
    url: `${baseUrl}/ministries/${ministry.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...sermonRoutes, ...eventRoutes, ...ministryRoutes];
}
