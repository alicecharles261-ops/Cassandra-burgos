This is a large build. To keep it high quality and shippable, I'll deliver it in 3 phases. Confirm and I'll start Phase 1 immediately.

## Design system (applies to all phases)
- Palette from your logo: Black `#111111`, White `#FFFFFF`, Gold `#C8A75D` (hover: darker gold `#A6873F`), Light Gray `#F7F7F7`.
- Typography: elegant serif display (Cormorant / Playfair-style) for headings + clean sans (Inter) for body. Generous whitespace, gold hairline dividers, soft shadows, rounded-2xl cards.
- Motion: fade-up on scroll, subtle image zoom on hover, sticky glass navbar, smooth scroll.

## Phase 1 — Public marketing site (this turn)
Single-page site + property detail route, using your uploaded photos as the initial listings (hardcoded), so it looks real from minute one.

Sections:
1. Sticky glass navbar (logo mark "CB" + full name, gold underline on active, Instagram icon, "Book a Consultation" CTA).
2. Hero — full-bleed luxury interior image, serif headline, subheadline, two CTAs.
3. Featured Properties grid (uses uploaded imagery).
4. Sold — the Fort Worth $320,000 listing card.
5. Leased — Coyote Ridge Carrollton $1,888, Princeton TX $1,850 (4bd/2ba), Downtown high-rise $3,504.
6. About Cassandra + Why Choose Me (7 pillars with gold icons).
7. Reviews — elegant carousel with all 8 testimonials verbatim, 5-star gold ratings.
8. Contact form (Full name, phone, email, interested property, message, preferred contact method) with success state and client-side zod validation.
9. Instagram section + footer (logo, quick links, contact, IG, copyright, privacy link).
10. Property detail page `/properties/$slug` with gallery, full spec sheet, map placeholder, schedule tour + contact + favorite + share.

SEO per route (title, description, OG, Twitter, canonical, JSON-LD RealEstateListing), sitemap.xml, robots.txt.

## Phase 2 — Lovable Cloud + public site reads from DB
- Enable Lovable Cloud.
- Schema: `properties`, `property_images`, `property_features`, `property_amenities`, `reviews`, `inquiries`, `favorites`, `property_views`, `profiles`, `user_roles` (admin role via `has_role` security-definer).
- Seed migration inserts the current hardcoded listings + reviews so nothing changes visually.
- Public site switches to reading from DB (server functions + TanStack Query). Contact form writes to `inquiries`.
- Advanced search & filter (keyword, city, zip, type, beds, baths, price range, sale/lease) + sort.

## Phase 3 — Admin dashboard `/admin`
- Email/password auth (Cassandra only). Protected `_authenticated/admin` routes.
- Dashboard stats (totals by status, draft count).
- Property CRUD with rich text description, full field set from your spec, status workflow (Available/Pending/Sold/Leased/Featured/Hidden/Draft), duplicate.
- Multi-image upload to Supabase Storage: drag-drop, reorder, delete, set featured, compressed + lazy on public site.
- Inquiries inbox.
- Realtime: property changes reflect on the public site immediately (Supabase realtime + query invalidation).

## Notes / decisions I'll make unless you object
- Use `imagegen` to create the hero and About portrait (I don't have a real photo of Cassandra — I'll generate an elegant placeholder portrait; swap later via the admin once Phase 3 ships).
- Instagram handle: I'll use `@cassandraburgos.realtor` as placeholder — tell me the real handle and I'll swap.
- Phone/email from the flyers: `469-493-6319` and `cburgos@smartcitylocating.com`. Confirm if different.
- "Book a Consultation" CTA scrolls to the contact form in Phase 1; can become a Calendly link later if you want.

Reply "go" (or with changes) and I'll ship Phase 1.