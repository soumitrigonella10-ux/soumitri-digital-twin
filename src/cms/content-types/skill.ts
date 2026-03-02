import { registerContentType, slugify } from "../registry";
import { skillPayloadSchema, skillMetadataSchema } from "../schemas";
import type { ContentTypeConfig, FormField, MetadataField } from "../types";

const metadataFields: MetadataField[] = [
  {
    name: "category",
    label: "Field",
    type: "select",
    required: true,
    isMetadata: true,
    options: [
      { value: "Strategy", label: "Strategy" },
      { value: "Technical", label: "Technical" },
      { value: "Design", label: "Design" },
      { value: "Craft", label: "Craft" },
      { value: "Language", label: "Language" },
    ],
    defaultValue: "Strategy",
  },
  {
    name: "tags",
    label: "Keywords",
    type: "tags",
    placeholder: "Add keywords (press Enter)",
    description: "Tools, frameworks, methodologies — press Enter to add",
    isMetadata: true,
    defaultValue: [],
  },
];

const payloadFields: FormField[] = [
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe this skill experiment...",
    description: "A short paragraph about what this skill involves",
    required: true,
  },
  {
    name: "proficiency",
    label: "Progress (%)",
    type: "number",
    placeholder: "0-100",
    description: "Proficiency percentage (0–100) shown as a progress bar",
    required: true,
  },
];

const skillConfig: ContentTypeConfig = {
  type: "skill",
  label: "Skill Quest",
  pluralLabel: "Skill Quests",
  icon: "FlaskConical",
  description: "Skill experiments with progress tracking",
  payloadSchema: skillPayloadSchema,
  metadataSchema: skillMetadataSchema,
  payloadFields,
  metadataFields,
  defaultPayload: { description: "", proficiency: 0 },
  defaultMetadata: { category: "Strategy", tags: [] },
  generateSlug: slugify,
};

registerContentType(skillConfig);
export { skillConfig };
