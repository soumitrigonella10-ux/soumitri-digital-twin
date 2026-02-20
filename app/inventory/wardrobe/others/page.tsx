"use client";

import { Package } from "lucide-react";
import { WardrobeCategoryPage } from "@/components/WardrobeCategoryPage";

export default function OthersPage() {
  return <WardrobeCategoryPage category="Others" title="Others" icon={Package} />;
}
