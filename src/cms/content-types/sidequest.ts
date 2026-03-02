import { registerContentType, slugify } from "../registry";
import { sidequestPayloadSchema, sidequestMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

const metadataFields: MetadataField[] = [
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "Style", label: "Style" },
      { value: "Wellness", label: "Wellness" },
      { value: "Mindfulness", label: "Mindfulness" },
      { value: "Beauty", label: "Beauty" },
      { value: "Nutrition", label: "Nutrition" },
      { value: "Connection", label: "Connection" },
      { value: "Fitness", label: "Fitness" },
      { value: "Space", label: "Space" },
    ],
    defaultValue: "Style",
  },
  {
    name: "difficulty",
    label: "Difficulty",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "Easy", label: "Easy" },
      { value: "Medium", label: "Medium" },
      { value: "Hard", label: "Hard" },
      { value: "Expert", label: "Expert" },
    ],
    defaultValue: "Medium",
  },
];

const payloadFields: FormField[] = [
  {
    name: "description",
    label: "Short Description",
    type: "textarea",
    placeholder: "A brief description of this sidequest...",
    description: "Shown on cards — keep it concise",
    required: true,
  },
  {
    name: "questLog",
    label: "Write-up",
    type: "richtext",
    placeholder: "The full write-up for this sidequest...",
    description: "A few lines describing the journey",
    required: true,
  },
  {
    name: "imageUrl",
    label: "Image / Video",
    type: "file-image",
    description: "Upload a cover image or video for this sidequest",
  },
];

const sidequestConfig: ContentTypeConfig = {
  type: "sidequest",
  label: "Sidequest",
  pluralLabel: "Sidequests",
  icon: "Compass",
  description: "Side projects and personal challenges",
  payloadSchema: sidequestPayloadSchema,
  metadataSchema: sidequestMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: { description: "", questLog: "", imageUrl: "" },
  defaultMetadata: { category: "Style", difficulty: "Medium" },
  generateSlug: slugify,
};

registerContentType(sidequestConfig);
export { sidequestConfig };
