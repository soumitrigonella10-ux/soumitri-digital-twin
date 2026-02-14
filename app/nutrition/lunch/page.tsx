"use client";

import { useState } from "react";
import { UtensilsCrossed, Plus, Clock, Leaf, Droplets, ChefHat, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { lunchBowlConfig } from "@/data/meals/lunch";
import { lunchDressings, DressingRecipe } from "@/data/meals/dressings";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

type TabType = "bowl" | "dressings";

function LunchPageContent() {
  const [activeTab, setActiveTab] = useState<TabType>("bowl");
  const [expandedDressing, setExpandedDressing] = useState<string | null>(null);

  const getDressingTypeColor = (type: DressingRecipe["baseType"]) => {
    switch (type) {
      case "yogurt": return "bg-blue-100 text-blue-700";
      case "oil": return "bg-amber-100 text-amber-700";
      case "tahini": return "bg-orange-100 text-orange-700";
      case "tomato": return "bg-red-100 text-red-700";
      case "tamarind": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-category-lunch flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lunch</h1>
            <p className="text-gray-500">Midday meal templates</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab("bowl")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "bowl"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <ChefHat className="w-4 h-4" />
          Bowl Builder
        </button>
        <button
          onClick={() => setActiveTab("dressings")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "dressings"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Droplets className="w-4 h-4" />
          Dressings ({lunchDressings.length})
        </button>
      </div>

      {/* Bowl Tab Content */}
      {activeTab === "bowl" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="lifeos-card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-gray-500">12:00 - 2:00 PM</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Ideal window</p>
          </div>

          {/* Bowl Configuration Card */}
          <div className="lifeos-card p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-500" />
              Build Your Bowl
            </h3>
            
            {/* Base */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Base</p>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="font-medium text-gray-800">{lunchBowlConfig.base.item}</span>
                <span className="text-sm text-amber-600 font-medium">{lunchBowlConfig.base.quantity}</span>
              </div>
            </div>

            {/* Salads */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Salads</p>
              <div className="space-y-2">
                {lunchBowlConfig.salads.map((salad, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="font-medium text-gray-800">{salad.name}</span>
                    <span className="text-sm text-green-600 font-medium">{salad.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Protein Options (pick one) */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Protein <span className="text-purple-500">(pick one)</span></p>
              <div className="grid grid-cols-3 gap-2">
                {lunchBowlConfig.proteinOptions.map((protein, i) => (
                  <div key={i} className="p-3 bg-purple-50 rounded-xl text-center border-2 border-dashed border-purple-200">
                    <span className="font-medium text-gray-800 text-sm">{protein.name}</span>
                    <p className="text-xs text-purple-600 font-medium mt-1">{protein.quantity}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center italic">Choose any one protein per bowl</p>
            </div>

            {/* Protein Portions by Day */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Daily Protein Portions</p>
              <div className="grid grid-cols-2 gap-2">
                {lunchBowlConfig.proteinPortions.map((portion, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{portion.days}</span>
                    <span className="text-xs text-emerald-600 font-medium">{portion.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Protein Top-ups */}
          <div className="lifeos-card p-5 bg-orange-50 border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-orange-600" />
              <h3 className="font-medium text-orange-800">2-Ingredient Protein Rescue</h3>
            </div>
            <p className="text-xs text-orange-600 mb-3">When you&apos;re short on time</p>
            <div className="space-y-2">
              {lunchBowlConfig.quickProteinTopups.map((topup, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-gray-800 font-medium">{topup.combo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="lifeos-card p-5 bg-emerald-50 border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <h3 className="font-medium text-emerald-800">Lunch Tips</h3>
            </div>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Include vegetables for nutrients</li>
              <li>• Balance protein, carbs, and fats</li>
              <li>• Avoid heavy meals that cause afternoon slump</li>
              <li>• Take a short walk after eating</li>
            </ul>
          </div>
        </div>
      )}

      {/* Dressings Tab Content */}
      {activeTab === "dressings" && (
        <div className="space-y-6">
          {/* Dressing Storage Info */}
          <div className="lifeos-card p-4 bg-blue-50 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-blue-800">Storage Tips</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Yogurt-based:</strong> 5–6 days (keep thick, avoid raw onion in jar)</li>
              <li>• <strong>Oil/soy/vinegar-based:</strong> 7 days easily</li>
              <li>• Make 1 and store for the week!</li>
            </ul>
          </div>

          {/* Dressings Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Weekly Dressings ({lunchDressings.length})
            </h2>

            {lunchDressings.map((dressing, index) => (
              <div
                key={dressing.id}
                className="lifeos-card overflow-hidden animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Dressing Header */}
                <button
                  onClick={() => setExpandedDressing(expandedDressing === dressing.id ? null : dressing.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dressing.name}</h3>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getDressingTypeColor(dressing.baseType))}>
                          {dressing.baseType}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          Lasts {dressing.shelfLifeDays} days
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
                      expandedDressing === dressing.id ? "rotate-180" : ""
                    )}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedDressing === dressing.id && (
                  <>
                    {/* Ingredients */}
                    <div className="px-5 pb-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                        Ingredients
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {dressing.ingredients.map((ing, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">{ing.name}</span>
                            <span className="text-xs text-emerald-600 font-medium">
                              {ing.quantity} {ing.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                        How to Make
                      </p>
                      <ol className="space-y-2">
                        {dressing.instructions.map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Tips */}
                    {dressing.tips && dressing.tips.length > 0 && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Tips
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {dressing.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {dressing.tags && dressing.tags.length > 0 && (
                      <div className="px-5 pb-5 flex flex-wrap gap-2">
                        {dressing.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Dressing Button */}
          <button className="add-button-dashed w-full py-6">
            <Plus className="w-5 h-5" />
            <span>Add New Dressing</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function LunchPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <LunchPageContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
