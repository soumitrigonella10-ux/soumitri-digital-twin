"use client";

import { Shirt } from "lucide-react";
import { WardrobeCategoryPage } from "@/components/WardrobeCategoryPage";

export default function InnerwearPage() {
  return <WardrobeCategoryPage category="Innerwear" title="Innerwear" icon={Shirt} objectFit="cover" />;
}
