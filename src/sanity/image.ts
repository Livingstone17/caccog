import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build an optimised Sanity CDN URL for an image field.
 *
 * Returns `null` for an empty field so components can skip the image instead of
 * rendering a broken one. Pair the result with `next/image`: `cdn.sanity.io` is
 * already listed in `images.remotePatterns` in next.config.ts, and the Sanity
 * CDN resizes/encodes on their side, which keeps `/_next/image` cheap.
 */
export function imageUrl(
  source: SanityImageSource | null | undefined,
  { width, height, quality = 80 }: { width: number; height?: number; quality?: number },
): string | null {
  if (!source) return null;

  let image = builder
    .image(source)
    .width(width)
    .auto("format")
    .fit("max")
    .quality(quality);
  if (height) image = image.height(height);

  return image.url();
}
