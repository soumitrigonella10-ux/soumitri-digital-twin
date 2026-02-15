"use client";

import { useMemo } from "react";
import { Palette, Sparkles } from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { SAMPLE_MAKEUP_PRODUCTS } from "@/data/makeupProducts";

// Categorize products into 4 main groups
const categorizeMakeupProduct = (category: string): "Eyes" | "Skin" | "Lips" | "Body" => {
  const lowerCategory = category.toLowerCase();
  
  // Eyes category
  if (lowerCategory.includes("eye") || lowerCategory.includes("mascara") || 
      lowerCategory.includes("liner") || lowerCategory.includes("shadow") ||
      lowerCategory.includes("brow")) {
    return "Eyes";
  }
  
  // Lips category
  if (lowerCategory.includes("lip")) {
    return "Lips";
  }
  
  // Body category
  if (lowerCategory.includes("body") || lowerCategory.includes("hand") || 
      lowerCategory.includes("nail") || lowerCategory.includes("perfume")) {
    return "Body";
  }
  
  // Default to Skin (includes foundation, primer, concealer, powder, blush, etc.)
  return "Skin";
};

function MakeupPageContent() {
  const makeupProducts = useMemo(() => {
    return SAMPLE_MAKEUP_PRODUCTS.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, []);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<"Eyes" | "Skin" | "Lips" | "Body", typeof SAMPLE_MAKEUP_PRODUCTS> = {
      Eyes: [],
      Skin: [],
      Lips: [],
      Body: []
    };

    makeupProducts.forEach(product => {
      const mainCategory = categorizeMakeupProduct(product.category);
      grouped[mainCategory].push(product);
    });

    return grouped;
  }, [makeupProducts]);

  return (
    <div className="space-y-6">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Makeup Routine</h1>
            <p className="text-gray-600">Your daily beauty ritual</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {makeupProducts.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No makeup products
              </h3>
              <p className="text-gray-500">
                Add products to start building your makeup routine
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Eyes Column */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b-2 border-purple-300">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Eyes
                </h3>
                {productsByCategory.Eyes.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No products</p>
                ) : (
                  productsByCategory.Eyes.map((product, index) => (
                    <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-purple-600 mb-1">{product.category}</div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h4>
                          {product.shade && (
                            <p className="text-xs text-gray-500">{product.shade}</p>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-400 ml-2 flex-shrink-0">{index + 1}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Skin Column */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b-2 border-pink-300">
                  <Sparkles className="w-5 h-5 text-pink-600" />
                  Skin
                </h3>
                {productsByCategory.Skin.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No products</p>
                ) : (
                  productsByCategory.Skin.map((product, index) => (
                    <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-pink-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-pink-600 mb-1">{product.category}</div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h4>
                          {product.shade && (
                            <p className="text-xs text-gray-500">{product.shade}</p>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-400 ml-2 flex-shrink-0">{index + 1}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Lips Column */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b-2 border-rose-300">
                  <Palette className="w-5 h-5 text-rose-600" />
                  Lips
                </h3>
                {productsByCategory.Lips.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No products</p>
                ) : (
                  productsByCategory.Lips.map((product, index) => (
                    <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-rose-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-rose-600 mb-1">{product.category}</div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h4>
                          {product.shade && (
                            <p className="text-xs text-gray-500">{product.shade}</p>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-400 ml-2 flex-shrink-0">{index + 1}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Body Column */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b-2 border-amber-300">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Body
                </h3>
                {productsByCategory.Body.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No products</p>
                ) : (
                  productsByCategory.Body.map((product, index) => (
                    <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-amber-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-amber-600 mb-1">{product.category}</div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h4>
                          {product.shade && (
                            <p className="text-xs text-gray-500">{product.shade}</p>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-400 ml-2 flex-shrink-0">{index + 1}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MakeupPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <MakeupPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}