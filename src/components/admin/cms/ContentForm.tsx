"use client";

// ─────────────────────────────────────────────────────────────
// Content Form — Dynamic form driven by content type registry
//
// Renders structured form inputs specific to each content type:
//   - Base fields (title, slug, visibility, featured, cover image)
//   - Metadata fields (category, tags, date — from type config)
//   - Payload fields (excerpt, PDF, reading time — from type config)
//
// Uses react-hook-form + Zod resolver for validation.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Eye,
  Loader2,
  ArrowLeft,
  Globe,
  FileEdit,
  Star,
  StarOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaUploader } from "./MediaUploader";
import { TagInput } from "./TagInput";
import { ContentPreview } from "./ContentPreview";
import { useToast } from "@/components/ToastProvider";
import {
  type ContentItem,
  type ContentTypeConfig,
  type ContentVisibility,
  VISIBILITY_OPTIONS,
} from "@/cms/types";
import { slugify } from "@/cms/registry";
import { cn } from "@/lib/utils";

interface ContentFormProps {
  /** Content type configuration */
  typeConfig: ContentTypeConfig;
  /** Existing item for editing (null = create new) */
  existingItem?: ContentItem | null;
  /** Called on successful save */
  onSave: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>;
  /** Called when user clicks back */
  onBack: () => void;
}

export function ContentForm({
  typeConfig,
  existingItem,
  onSave,
  onBack,
}: ContentFormProps) {
  const isEditing = !!existingItem;
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  // ── Build a combined Zod schema ────────────────────────────
  const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(100)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Lowercase alphanumeric with hyphens"
      ),
    visibility: z.enum(["draft", "published", "archived"]),
    isFeatured: z.boolean(),
    coverImage: z.string().optional().default(""),
    // Metadata & payload validated separately by type schemas
    metadata: z.record(z.unknown()),
    payload: z.record(z.unknown()),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingItem?.title ?? "",
      slug: existingItem?.slug ?? "",
      visibility: (existingItem?.visibility as ContentVisibility) ?? "draft",
      isFeatured: existingItem?.isFeatured ?? false,
      coverImage: existingItem?.coverImage ?? "",
      metadata: existingItem?.metadata ?? { ...typeConfig.defaultMetadata },
      payload: existingItem?.payload ?? { ...typeConfig.defaultPayload },
    },
  });

  const watchTitle = watch("title");
  const watchVisibility = watch("visibility");

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && watchTitle) {
      setValue("slug", slugify(watchTitle), { shouldValidate: true });
    }
  }, [watchTitle, autoSlug, setValue]);

  // ── Submit handler ──────────────────────────────────────────
  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsSaving(true);
      try {
        const submitData: Record<string, unknown> = {
          type: typeConfig.type,
          title: values.title,
          slug: values.slug,
          visibility: values.visibility,
          isFeatured: values.isFeatured,
          coverImage: values.coverImage || null,
          metadata: values.metadata,
          payload: values.payload,
        };

        if (isEditing && existingItem) {
          submitData.id = existingItem.id;
        }

        const result = await onSave(submitData);

        if (result.success) {
          toast({
            title: isEditing ? "Content updated" : "Content created",
            description: `"${values.title}" has been ${isEditing ? "updated" : "saved"}`,
            variant: "success",
          });
        } else {
          toast({
            title: "Save failed",
            description: result.error || "Something went wrong",
            variant: "error",
          });
        }
      } catch (err) {
        toast({
          title: "Save failed",
          description:
            err instanceof Error ? err.message : "An error occurred",
          variant: "error",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [typeConfig, isEditing, existingItem, onSave, toast]
  );

  // ── Render a form field based on its config ─────────────────
  const renderField = useCallback(
    (
      field: { name: string; label: string; type: string; placeholder?: string; description?: string; required?: boolean; options?: { value: string; label: string }[] },
      prefix: "metadata" | "payload"
    ) => {
      const fieldPath = `${prefix}.${field.name}` as `metadata.${string}` | `payload.${string}`;

      return (
        <div key={fieldPath} className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === "text" && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <Input
                  value={(f.value as string) ?? ""}
                  onChange={(e) => f.onChange(e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            />
          )}

          {field.type === "textarea" && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <textarea
                  value={(f.value as string) ?? ""}
                  onChange={(e) => f.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                />
              )}
            />
          )}

          {field.type === "select" && field.options && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <Select
                  value={(f.value as string) ?? ""}
                  onChange={(e) => f.onChange(e.target.value)}
                >
                  <option value="">Select…</option>
                  {field.options!.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              )}
            />
          )}

          {field.type === "tags" && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <TagInput
                  value={(f.value as string[]) ?? []}
                  onChange={f.onChange}
                  placeholder={field.placeholder}
                />
              )}
            />
          )}

          {field.type === "number" && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <Input
                  type="number"
                  value={(f.value as number) ?? 0}
                  onChange={(e) => f.onChange(Number(e.target.value))}
                  placeholder={field.placeholder}
                />
              )}
            />
          )}

          {field.type === "boolean" && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!f.value}
                    onChange={(e) => f.onChange(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-600">
                    {field.placeholder || field.label}
                  </span>
                </label>
              )}
            />
          )}

          {(field.type === "file-image" ||
            field.type === "file-pdf" ||
            field.type === "file-video") && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <MediaUploader
                  value={(f.value as string) ?? ""}
                  onChange={f.onChange}
                  accept={
                    field.type === "file-image"
                      ? "image"
                      : field.type === "file-pdf"
                        ? "pdf"
                        : "video"
                  }
                  uploadType={typeConfig.type}
                  description={field.description}
                />
              )}
            />
          )}

          {field.type === "url" && (
            <Controller
              name={fieldPath}
              control={control}
              render={({ field: f }) => (
                <Input
                  type="url"
                  value={(f.value as string) ?? ""}
                  onChange={(e) => f.onChange(e.target.value)}
                  placeholder={field.placeholder || "https://..."}
                />
              )}
            />
          )}

          {field.description && field.type !== "file-image" && field.type !== "file-pdf" && field.type !== "file-video" && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
        </div>
      );
    },
    [control, typeConfig.type]
  );

  // ── Preview data ────────────────────────────────────────────
  const previewData = watch();

  if (showPreview) {
    return (
      <ContentPreview
        typeConfig={typeConfig}
        data={{
          title: previewData.title,
          slug: previewData.slug,
          visibility: previewData.visibility,
          isFeatured: previewData.isFeatured,
          coverImage: previewData.coverImage || null,
          metadata: previewData.metadata,
          payload: previewData.payload,
        }}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit" : "New"} {typeConfig.label}
            </h2>
            <p className="text-sm text-gray-500">{typeConfig.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Column (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("title")}
                  placeholder={`Enter ${typeConfig.label.toLowerCase()} title...`}
                  className="text-lg font-medium"
                />
                {errors.title && (
                  <p className="text-xs text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {autoSlug ? "Manual edit" : "Auto-generate"}
                  </button>
                </div>
                <Input
                  {...register("slug")}
                  placeholder="url-friendly-slug"
                  disabled={autoSlug}
                  className={cn(autoSlug && "bg-gray-50 text-gray-500")}
                />
                {errors.slug && (
                  <p className="text-xs text-red-600">{errors.slug.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payload fields */}
          {typeConfig.payloadFields.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Content</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                {typeConfig.payloadFields.map((field) =>
                  renderField(field, "payload")
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar (1/3) ── */}
        <div className="space-y-6">
          {/* Publish settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {VISIBILITY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            field.value === opt.value
                              ? opt.value === "published"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : opt.value === "archived"
                                  ? "bg-gray-200 text-gray-700 border border-gray-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
                <div className="flex items-center gap-1.5 mt-1">
                  {watchVisibility === "draft" && (
                    <Badge variant="warning">
                      <FileEdit className="h-3 w-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                  {watchVisibility === "published" && (
                    <Badge variant="success">
                      <Globe className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  )}
                  {watchVisibility === "archived" && (
                    <Badge variant="secondary">Archived</Badge>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        field.value
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {field.value ? (
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                      {field.value ? "Featured" : "Mark as Featured"}
                    </button>
                  )}
                />
              </div>

              {existingItem && (
                <div className="border-t border-gray-100 pt-3 space-y-1 text-xs text-gray-500">
                  <p>Created: {existingItem.createdAt.toLocaleDateString()}</p>
                  <p>Updated: {existingItem.updatedAt.toLocaleDateString()}</p>
                  {existingItem.publishedAt && (
                    <p>
                      Published:{" "}
                      {existingItem.publishedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover image */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <Controller
                name="coverImage"
                control={control}
                render={({ field }) => (
                  <MediaUploader
                    value={field.value || ""}
                    onChange={field.onChange}
                    accept="image"
                    uploadType={typeConfig.type}
                    description="Featured image for cards and previews"
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Metadata fields */}
          {typeConfig.metadataFields.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                {typeConfig.metadataFields.map((field) =>
                  renderField(field, "metadata")
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
