import featured1 from "@/assets/featured-1.jpg";
import featured2 from "@/assets/featured-2.jpg";
import featured3 from "@/assets/featured-3.jpg";
import soldLodestone from "@/assets/properties/sold-lodestone.jpg";
import leasedCoyote from "@/assets/properties/leased-coyote-ridge.jpg";
import leasedPrinceton from "@/assets/properties/leased-princeton.jpg";
import leasedDowntown from "@/assets/properties/leased-downtown.jpg";

const FALLBACK = featured1;

const MAP: Record<string, string> = {
  featured1,
  featured2,
  featured3,
  soldLodestone,
  leasedCoyote,
  leasedPrinceton,
  leasedDowntown,
};

export function resolveImage(key: string | null | undefined): string {
  if (!key) return FALLBACK;
  return MAP[key] ?? FALLBACK;
}

export function resolveGallery(keys: string[] | null | undefined): string[] {
  if (!keys || keys.length === 0) return [];
  return keys.map(resolveImage);
}
