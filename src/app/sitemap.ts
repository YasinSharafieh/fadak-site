import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://fadak-site-murex.vercel.app";

  const staticPages = [
    "",
    "/events",
    "/archive",
    "/audio",
    "/videos",
    "/reels",
    "/reels/list",
    "/gallery",
    "/poems",
    "/search",
    "/khadam",
    "/donate",
    "/link",
    "/about-heyat",
    "/about-taheri",
    "/collections",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  let eventPages: MetadataRoute.Sitemap = [];
  if (supabase) {
    const { data: events } = await supabase.from("events").select("slug,created_at");
    if (events) {
      eventPages = events.map((e) => ({
        url: `${baseUrl}/archive/${e.slug}`,
        lastModified: new Date(e.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  }

  return [...staticPages, ...eventPages];
}
