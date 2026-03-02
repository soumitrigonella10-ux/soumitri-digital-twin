"use client";

import { useState, useCallback } from "react";
import { X, Loader2, Check } from "lucide-react";
import { createContent } from "@/cms/actions";

interface UploadSkillModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const FIELD_OPTIONS = [
  "Strategy",
  "Technical",
  "Design",
  "Craft",
  "Language",
];

export function UploadSkillModal({ onClose, onSuccess }: UploadSkillModalProps) {
  const [name, setName] = useState("");
  const [field, setField] = useState("Strategy");
  const [keywords, setKeywords] = useState("");
  const [proficiency, setProficiency] = useState(50);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) { setError("Name is required"); return; }
    if (!description.trim()) { setError("Description is required"); return; }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createContent({
        type: "skill",
        title: name.trim(),
        slug: slugify(name),
        visibility: "published",
        isFeatured: false,
        coverImage: null,
        metadata: {
          category: field,
          tags: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        },
        payload: {
          description: description.trim(),
          proficiency,
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => { onSuccess?.(); onClose(); }, 1000);
      } else {
        setError(result.error || "Failed to create skill quest");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, field, keywords, proficiency, description, onClose, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] sm:pt-[8vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[85vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Skill Quest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Systems Thinking" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-900/40 focus:border-amber-900" />
          </div>

          {/* Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Field</label>
            <select value={field} onChange={(e) => setField(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-900/40 focus:border-amber-900">
              {FIELD_OPTIONS.map((f) => (<option key={f} value={f}>{f}</option>))}
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Keywords</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Mental Models, Causal Loops, Feedback Systems" className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-900/40 focus:border-amber-900" />
            <p className="text-xs text-gray-400 mt-1">Comma-separated tools, technologies, methodologies</p>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Progress — {proficiency}%</label>
            <input type="range" min={0} max={100} value={proficiency} onChange={(e) => setProficiency(Number(e.target.value))} className="w-full accent-amber-900" />
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-amber-900 h-2 rounded-full transition-all" style={{ width: `${proficiency}%` }} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What this skill involves..." className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-900/40 focus:border-amber-900 resize-none" />
          </div>

          {/* Error / Success */}
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              <Check className="h-4 w-4" /> Skill quest created successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting || success} className="px-5 py-2 text-sm rounded-lg bg-amber-900 text-white hover:bg-amber-800 disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Creating..." : "Create Skill Quest"}
          </button>
        </div>
      </div>
    </div>
  );
}
