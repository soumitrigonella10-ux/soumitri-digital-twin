"use client";

import { Shirt } from "lucide-react";
import { WardrobeCategoryPage } from "@/components/WardrobeCategoryPage";

export default function DressesPage() {
  return <WardrobeCategoryPage category="Dress" title="Dresses" icon={Shirt} />;
}
