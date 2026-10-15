import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Citadel of Grace — Christ Apostolic Church (CAC)",
    short_name: "Citadel of Grace",
    description:
      "Service times, sermons, events and giving for Citadel of Grace, a CAC congregation.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/seal-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/seal.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
