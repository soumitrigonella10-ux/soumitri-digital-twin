// ─────────────────────────────────────────────────────────────
// Wishlist — URL Metadata Fetcher
//
// POST /api/wishlist/fetch-meta  { url: "https://..." }
//
// Fetches Open Graph / meta tags from the given product page
// and returns extracted metadata (title, image, price, brand, etc.)
// so the Add-to-Wishlist form can auto-fill.
//
// Requires admin authentication.
// ─────────────────────────────────────────────────────────────
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { withErrorHandling } from "@/lib/api-utils";

/** Tiny regex helpers to pull content from meta tags. */
function metaContent(html: string, property: string): string | null {
  // Match <meta property="..." content="..."> or <meta name="..." content="...">
  // Also handle content before property and single-quoted or unquoted values.
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escapeRegex(property)}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapeRegex(property)}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtmlEntities(m[1].trim());
  }
  return null;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/** Extract <title> fallback. */
function titleTag(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim() ?? null;
}

/** Try to extract a price number from common meta tags or JSON-LD. */
function extractPrice(html: string): { amount?: number | undefined; currency?: string | undefined } {
  // OG product tags
  const ogAmount =
    metaContent(html, "og:price:amount") ??
    metaContent(html, "product:price:amount") ??
    metaContent(html, "product:price");
  const ogCurrency =
    metaContent(html, "og:price:currency") ??
    metaContent(html, "product:price:currency");

  if (ogAmount) {
    const parsed = parseFloat(ogAmount.replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(parsed)) {
      return { amount: parsed, currency: ogCurrency ?? undefined };
    }
  }

  // JSON-LD fallback — look for "price" in structured data
  const ldMatch = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  if (ldMatch) {
    for (const block of ldMatch) {
      const jsonStr = block.replace(/<\/?script[^>]*>/gi, "");
      try {
        const data = JSON.parse(jsonStr);
        const offer = data?.offers ?? data?.offers?.[0] ?? data;
        const p = offer?.price ?? offer?.lowPrice;
        if (p != null) {
          return {
            amount: typeof p === "number" ? p : parseFloat(String(p)),
            currency: offer?.priceCurrency ?? ogCurrency ?? undefined,
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        /* skip malformed JSON-LD */
      }
    }
  }
  return {};
}

/** Validate and normalise the incoming URL. */
function validateUrl(raw: unknown): URL | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

// ── POST Handler ─────────────────────────────────────────────

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();

  const body = await req.json();
  const url = validateUrl(body?.url);

  if (!url) {
    return NextResponse.json(
      { success: false, error: "A valid HTTP(S) URL is required" },
      { status: 400 },
    );
  }

  // Fetch page HTML with a reasonable timeout & size limit
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  let html: string;
  try {
    const res = await fetch(url.href, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WishlistBot/1.0; +https://soumitri.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch page (HTTP ${res.status})` },
        { status: 422 },
      );
    }

    // Only consume up to ~2 MB to prevent memory issues
    const reader = res.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { success: false, error: "Could not read response body" },
        { status: 422 },
      );
    }

    const chunks: Uint8Array[] = [];
    let total = 0;
    const MAX_BYTES = 2 * 1024 * 1024;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      chunks.push(value);
      if (total >= MAX_BYTES) break;
    }
    reader.cancel();
    html = new TextDecoder().decode(
      Buffer.concat(chunks.map((c) => Buffer.from(c))),
    );
  } catch (err) {
    const msg =
      err instanceof DOMException && err.name === "AbortError"
        ? "Request timed out"
        : "Failed to fetch page";
    return NextResponse.json({ success: false, error: msg }, { status: 422 });
  } finally {
    clearTimeout(timer);
  }

  // Extract metadata from the HTML
  const title =
    metaContent(html, "og:title") ??
    metaContent(html, "twitter:title") ??
    titleTag(html) ??
    "";
  const image =
    metaContent(html, "og:image") ??
    metaContent(html, "twitter:image") ??
    "";
  const description =
    metaContent(html, "og:description") ??
    metaContent(html, "description") ??
    metaContent(html, "twitter:description") ??
    "";
  const siteName = metaContent(html, "og:site_name") ?? "";
  const brand =
    metaContent(html, "product:brand") ??
    metaContent(html, "og:brand") ??
    siteName;
  const { amount: price, currency } = extractPrice(html);

  return NextResponse.json({
    success: true,
    data: {
      title: title.slice(0, 300),
      image,
      description: description.slice(0, 500),
      brand: brand.slice(0, 100),
      price,
      currency,
      url: url.href,
    },
  });
}, "Failed to fetch metadata");
