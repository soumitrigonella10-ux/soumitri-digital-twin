"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTopicBySlug, getTopicHref } from "@/data/topics";
import { notFound } from "next/navigation";

/**
 * Catch-all slug page.
 *
 * Every editorial topic now has a dedicated page (e.g. /essays, /consumption,
 * /skills). This route exists only to redirect legacy / bookmarked URLs like
 * `/content-consumption` → `/consumption`.
 */
export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const topic = getTopicBySlug(slug);

  useEffect(() => {
    if (topic) {
      router.replace(getTopicHref(topic.slug));
    }
  }, [topic, router]);

  // Unknown slug → 404
  if (!topic) {
    notFound();
  }

  // Brief loading state while the redirect fires
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}