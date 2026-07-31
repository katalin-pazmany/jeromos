import type { MetadataRoute } from "next";
import { getAllDogs } from "@/lib/dogs-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jeromos-one.vercel.app";

const staticRoutes = [
  "",
  "/gazdira-varnak",
  "/osszeparosito",
  "/orokbefogadas",
  "/jelentkezes",
  "/rolunk",
  "/kapcsolat",
  "/segitseg",
  "/tanacsok",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dogs = await getAllDogs();

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
    })),
    ...dogs.map((dog) => ({
      url: `${SITE_URL}/gazdira-varnak/${dog.slug}`,
      lastModified: new Date(),
    })),
  ];
}
