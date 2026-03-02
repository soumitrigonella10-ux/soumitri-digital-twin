"use client";

// ─────────────────────────────────────────────────────────────
// Content Preview — Shows how the content will look before publish
// ─────────────────────────────────────────────────────────────
import Image from "next/image";
import { ArrowLeft, Globe, FileEdit, Star, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ContentTypeConfig } from "@/cms/types";

interface ContentPreviewProps {
  typeConfig: ContentTypeConfig;
  data: {
    title: string;
    slug: string;
    visibility: string;
    isFeatured: boolean;
    coverImage: string | null;
    metadata: Record<string, unknown>;
    payload: Record<string, unknown>;
  };
  onClose: () => void;
}

export function ContentPreview({ typeConfig, data, onClose }: ContentPreviewProps) {
  const metadata = data.metadata as Record<string, string | string[]>;
  const payload = data.payload as Record<string, string | unknown[]>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <p className="text-sm text-gray-500">
              How this {typeConfig.label.toLowerCase()} will appear
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data.visibility === "draft" && (
            <Badge variant="warning">
              <FileEdit className="h-3 w-3 mr-1" />
              Draft
            </Badge>
          )}
          {data.visibility === "published" && (
            <Badge variant="success">
              <Globe className="h-3 w-3 mr-1" />
              Published
            </Badge>
          )}
          {data.isFeatured && (
            <Badge variant="default">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Preview Card — mimics the editorial card style */}
      <div className="max-w-2xl mx-auto">
        {/* Cover Image */}
        {data.coverImage && (
          <div className="aspect-[16/9] rounded-t-xl overflow-hidden bg-gray-100 relative">
            <Image
              src={data.coverImage}
              alt={data.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-8 space-y-6">
          {/* Category & Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {metadata.category && (
              <span className="font-medium text-gray-700 uppercase tracking-wider text-xs">
                {String(metadata.category)}
              </span>
            )}
            {metadata.date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {String(metadata.date)}
              </span>
            )}
            {payload.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {String(payload.readingTime)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold text-gray-900 leading-tight">
            {data.title || "Untitled"}
          </h1>

          {/* Excerpt */}
          {payload.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              {String(payload.excerpt)}
            </p>
          )}

          {/* Tags */}
          {Array.isArray(metadata.tags) && (metadata.tags as string[]).length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-3.5 w-3.5 text-gray-400" />
              {(metadata.tags as string[]).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* PDF indicator */}
          {payload.pdfUrl && (
            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                PDF
              </span>
              <span className="truncate">{String(payload.pdfUrl)}</span>
            </div>
          )}

          {/* Slug */}
          <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 font-mono">
            /{typeConfig.type}/{data.slug}
          </div>
        </div>
      </div>
    </div>
  );
}
