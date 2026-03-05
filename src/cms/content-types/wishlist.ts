// ─────────────────────────────────────────────────────────────
// Wishlist Content Type — Registration
//
// Items the user is considering purchasing.
// Images can be URLs (no upload required).
// metadata: category, tags, priority, purchased
// payload:  brand, imageUrl, websiteUrl, price, currency
// ─────────────────────────────────────────────────────────────
import { registerContentType, slugify } from "../registry";
import { wishlistPayloadSchema, wishlistMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

// ── Metadata fields ──────────────────────────────────────────
const metadataFields: MetadataField[] = [
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "Tops", label: "Tops" },
      { value: "Bottoms", label: "Bottoms" },
      { value: "Dresses", label: "Dresses" },
      { value: "Outerwear", label: "Outerwear" },
      { value: "Suits", label: "Suits" },
      { value: "Bags", label: "Bags" },
      { value: "Shoes", label: "Shoes" },
      { value: "Jewellery", label: "Jewellery" },
      { value: "Things", label: "Things" },
    ],
    defaultValue: "Tops",
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ],
    defaultValue: "Medium",
  },
  {
    name: "tags",
    label: "Tags",
    type: "text",
    placeholder: "Comma-separated tags, e.g. Apparel, Tops",
    description: "Comma-separated tags",
    isMetadata: true,
    defaultValue: "",
  },
  {
    name: "purchased",
    label: "Purchased",
    type: "boolean",
    description: "Mark as already purchased",
    isMetadata: true,
    defaultValue: false,
  },
];

// ── Payload fields ───────────────────────────────────────────
const payloadFields: FormField[] = [
  {
    name: "brand",
    label: "Brand",
    type: "text",
    placeholder: "e.g. Zara, Uniqlo",
  },
  {
    name: "imageUrl",
    label: "Image URL",
    type: "text",
    placeholder: "https://... (or upload via the inventory page)",
    description: "Paste an image URL or upload an image",
  },
  {
    name: "websiteUrl",
    label: "Website URL",
    type: "text",
    placeholder: "https://...",
    description: "Link to the product page",
  },
  {
    name: "price",
    label: "Price",
    type: "text",
    placeholder: "e.g. 1299",
    description: "Price in the specified currency",
  },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    options: [
      { value: "INR", label: "INR (₹)" },
      { value: "USD", label: "USD ($)" },
      { value: "EUR", label: "EUR (€)" },
      { value: "GBP", label: "GBP (£)" },
    ],
    defaultValue: "INR",
  },
];

// ── Registration ─────────────────────────────────────────────
const wishlistCmsConfig: ContentTypeConfig = {
  type: "wishlist-item",
  label: "Wishlist Item",
  pluralLabel: "Wishlist Items",
  icon: "Heart",
  description: "A running list of objects being considered",
  payloadSchema: wishlistPayloadSchema,
  metadataSchema: wishlistMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: {
    brand: "",
    imageUrl: "",
    websiteUrl: "",
    price: undefined,
    currency: "INR",
  },
  defaultMetadata: {
    category: "Tops",
    tags: [],
    priority: "Medium",
    purchased: false,
  },
  generateSlug: slugify,
};

registerContentType(wishlistCmsConfig);

export { wishlistCmsConfig };
