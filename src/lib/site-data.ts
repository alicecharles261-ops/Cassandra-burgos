export const AGENT = {
  name: "Cassandra Burgos",
  title: "Real Estate Agent",
  phone: "469-493-6319",
  phoneHref: "tel:+14694936319",
  email: "cburgos@smartcitylocating.com",
  instagram: "cassandraburgos.realtor",
  instagramUrl: "https://instagram.com/cassandraburgos.realtor",
  location: "Dallas–Fort Worth, TX",
} as const;

export type PropertyStatus = "for-sale" | "for-lease" | "sold" | "leased";

export type Property = {
  slug: string;
  title: string;
  status: PropertyStatus;
  price: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  beds: number;
  baths: number;
  garage?: number | null;
  sqft?: number | null;
  yearBuilt?: number | null;
  mls?: string | null;
  image: string;
  gallery?: string[];
  description: string;
  features?: string[];
  amenities?: string[];
  date?: string | null;
};

export type Review = { name: string; quote: string };

export const WHY_CHOOSE = [
  { title: "Professional", body: "Polished representation and consistent, reliable follow-through." },
  { title: "Trusted", body: "Referred by clients who share her with friends and family." },
  { title: "Local Market Expert", body: "Deep knowledge of DFW neighborhoods, pricing, and value." },
  { title: "Excellent Communication", body: "Clear, warm, and responsive from first tour to close." },
  { title: "Fast Response", body: "Quick to answer texts, calls, and showing requests." },
  { title: "Negotiation Skills", body: "Advocates hard to protect your budget and terms." },
  { title: "Client Focused", body: "Listens first — every recommendation fits your priorities." },
] as const;
