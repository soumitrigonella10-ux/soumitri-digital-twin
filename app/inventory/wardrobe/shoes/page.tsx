"use client";

import { Footprints } from "lucide-react";
import { WardrobeCategoryPage } from "@/components/WardrobeCategoryPage";

export default function ShoesPage() {
  return <WardrobeCategoryPage category="Shoes" title="Shoes" icon={Footprints} objectFit="cover" />;
}
