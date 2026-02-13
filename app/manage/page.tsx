"use client";

import { useState, useEffect } from "react";
import { Settings, Database, Download, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { ManageTabs } from "@/components/manage/ManageTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ToastProvider";

function ManagePageContent() {
  const { data, deletePreset, loadPresetNames } = useAppStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [presets, setPresets] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPresets(loadPresetNames());
    }, 300);
    return () => clearTimeout(timer);
  }, [loadPresetNames]);

  // Export all data as JSON
  const handleExport = () => {
    const exportData = {
      products: data.products,
      routines: data.routines,
      wardrobe: data.wardrobe,
      mealTemplates: data.mealTemplates,
      dressings: data.dressings,
      workoutPlans: data.workoutPlans,
      outfits: data.outfits,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `routines-wardrobe-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Data exported", description: "Check your downloads folder", variant: "success" });
  };

  // Clear all localStorage data
  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This will reset everything to default."
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Delete a preset
  const handleDeletePreset = (name: string) => {
    deletePreset(name);
    setPresets(loadPresetNames());
    toast({ title: "Preset deleted", description: name });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit, and organize your data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Data Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{data.products.length}</p>
            <p className="text-xs text-gray-500">Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{data.routines.length}</p>
            <p className="text-xs text-gray-500">Routines</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{data.wardrobe.length}</p>
            <p className="text-xs text-gray-500">Wardrobe</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{data.mealTemplates.length}</p>
            <p className="text-xs text-gray-500">Meals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{data.dressings.length}</p>
            <p className="text-xs text-gray-500">Dressings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{data.workoutPlans.length}</p>
            <p className="text-xs text-gray-500">Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{data.outfits.length}</p>
            <p className="text-xs text-gray-500">Outfits</p>
          </CardContent>
        </Card>
      </div>

      {/* Saved Presets */}
      {presets.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Saved Filter Presets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <div
                  key={preset}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5"
                >
                  <span className="text-sm">{preset}</span>
                  <button
                    onClick={() => handleDeletePreset(preset)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Management Tabs */}
      <ManageTabs />

      {/* Storage Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Settings className="h-4 w-4" />
            <span>
              Data is stored in your browser&apos;s localStorage. Export regularly
              for backup.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManagePage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <ManagePageContent />
      </div>
    </AuthenticatedLayout>
  );
}
