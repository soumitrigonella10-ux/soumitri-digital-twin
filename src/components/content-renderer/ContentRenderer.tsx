"use client";

import { ListDetail } from "./ListDetail";
import { PdfFlipbook } from "./PdfFlipbook";
import { PdfSingleViewer } from "./PdfSingleViewer";
import { SplitDetail } from "./SplitDetail";
import type { ContentRendererProps } from "./types";

export function ContentRenderer({
  type,
  data,
  layoutVariant = "default",
  onClose,
  className,
}: ContentRendererProps) {
  const optionalProps = {
    ...(onClose ? { onClose } : {}),
    ...(className ? { className } : {}),
  };

  switch (type) {
    case "split-detail":
      return (
        <SplitDetail
          data={data}
          layoutVariant={layoutVariant}
          {...optionalProps}
        />
      );

    case "list-detail":
      return (
        <ListDetail
          items={data.items ?? []}
          title={data.title}
          layoutVariant={layoutVariant}
          {...(className ? { className } : {})}
        />
      );

    case "pdf-flipbook":
      return (
        <PdfFlipbook
          data={data}
          layoutVariant={layoutVariant}
          {...optionalProps}
        />
      );

    case "pdf-single":
      return (
        <PdfSingleViewer
          data={data}
          layoutVariant={layoutVariant}
          {...optionalProps}
        />
      );

    default:
      return null;
  }
}
