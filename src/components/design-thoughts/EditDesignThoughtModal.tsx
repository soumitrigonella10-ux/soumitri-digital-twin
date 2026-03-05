"use client";

import { useState, useCallback, useRef } from "react";
import { X, Loader2, Check, Upload, Link } from "lucide-react";
import { updateContent } from "@/cms/actions";
import type { DesignThought } from "@/types/editorial";

const CATEGORIES = [
  { value: "UX Philosophy", label: "UX Philosophy" }, { value: "Layout Theory", label: "Layout Theory" },
  { value: "Type Design", label: "Type Design" }, { value: "Animation", label: "Animation" },
  { value: "Visual Design", label: "Visual Design" }, { value: "Technical", label: "Technical" },
  { value: "Design Systems", label: "Design Systems" }, { value: "Ethics", label: "Ethics" },
];

const CARD_TYPES = [
  { value: "standard", label: "Standard" }, { value: "blueprint", label: "Blueprint" },
  { value: "inverted", label: "Inverted (Dark)" }, { value: "technical", label: "Technical" },
];

const ANNOTATION_TYPES = [
  { value: "none", label: "None" }, { value: "measurement", label: "Measurement" },
  { value: "redline", label: "Redline" }, { value: "stamp", label: "Stamp" },
];

interface EditDesignThoughtModalProps {
  thought: DesignThought;
  onClose: () => void;
  onSaved?: () => void;
}

export function EditDesignThoughtModal({ thought, onClose, onSaved }: EditDesignThoughtModalProps) {
  const [title, setTitle] = useState(thought.title);
  const [subtitle, setSubtitle] = useState(thought.subtitle || "");
  const [category, setCategory] = useState(thought.category);
  const [date, setDate] = useState(thought.date);
  const [cardType, setCardType] = useState(thought.cardType);
  const [annotationType, setAnnotationType] = useState(thought.annotationType);
  const [pdfUrl, setPdfUrl] = useState(thought.pdfUrl || "");
  const [pdfMode, setPdfMode] = useState<"upload" | "url">("upload");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadedPdfName, setUploadedPdfName] = useState("");
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [hasTechnicalPattern, setHasTechnicalPattern] = useState(thought.hasTechnicalPattern || false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

  const handlePdfUpload = useCallback(async (file: File) => {
    setIsUploadingPdf(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "essays");
      const res = await fetch("/api/cms/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setPdfUrl(json.data.url);
      setUploadedPdfName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF upload failed");
    } finally {
      setIsUploadingPdf(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!date.trim()) { setError("Date is required"); return; }
    setError(null); setIsSubmitting(true);
    try {
      const result = await updateContent({
        id: thought.id,
        title: title.trim(),
        slug: slugify(title),
        metadata: { category, date: date.trim(), cardType, annotationType },
        payload: { subtitle: subtitle.trim(), pdfUrl: pdfUrl.trim(), hasTechnicalPattern },
      });
      if (result.success) { setSuccess(true); setTimeout(() => { onSaved?.(); onClose(); }, 1200); }
      else { setError(result.error || "Failed to update"); }
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); } finally { setIsSubmitting(false); }
  }, [title, subtitle, category, date, cardType, annotationType, pdfUrl, hasTechnicalPattern, thought.id, onClose, onSaved]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] sm:pt-[5vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FFF8F0] rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto border border-stone-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="font-serif italic text-xl md:text-2xl font-bold text-telugu-kavi">Edit Design Thought</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Subtitle</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Date</label>
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Card Type</label>
              <select value={cardType} onChange={(e) => setCardType(e.target.value as DesignThought["cardType"])} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {CARD_TYPES.map((ct) => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold mb-1.5">Annotation Type</label>
              <select value={annotationType} onChange={(e) => setAnnotationType(e.target.value as DesignThought["annotationType"])} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial appearance-none cursor-pointer">
                {ANNOTATION_TYPES.map((at) => <option key={at.value} value={at.value}>{at.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-telugu-marigold">PDF Document</label>
              <div className="flex items-center gap-1 bg-stone-100 rounded-md p-0.5">
                <button type="button" onClick={() => setPdfMode("upload")} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-editorial font-semibold uppercase tracking-wider transition-colors ${pdfMode === "upload" ? "bg-white text-telugu-kavi shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><Upload className="h-3 w-3" />Upload</button>
                <button type="button" onClick={() => setPdfMode("url")} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-editorial font-semibold uppercase tracking-wider transition-colors ${pdfMode === "url" ? "bg-white text-telugu-kavi shadow-sm" : "text-stone-400 hover:text-stone-600"}`}><Link className="h-3 w-3" />URL</button>
              </div>
            </div>
            {pdfMode === "upload" ? (
              <div>
                <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); }} className="hidden" />
                <button type="button" onClick={() => pdfInputRef.current?.click()} disabled={isUploadingPdf} className="w-full px-3 py-3 rounded-lg border-2 border-dashed border-stone-300 bg-white hover:border-telugu-marigold/50 hover:bg-stone-50 text-sm text-stone-500 transition-colors flex items-center justify-center gap-2 font-editorial">
                  {isUploadingPdf ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</> : uploadedPdfName ? <><Check className="h-4 w-4 text-green-600" /><span className="text-stone-700 truncate max-w-[200px]">{uploadedPdfName}</span></> : <><Upload className="h-4 w-4" />Choose PDF file (max 50MB)</>}
                </button>
                {pdfUrl && uploadedPdfName && <p className="mt-1 text-[10px] text-stone-400 font-editorial truncate">Uploaded: {pdfUrl}</p>}
              </div>
            ) : (
              <input type="text" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-telugu-marigold/40 focus:border-telugu-marigold font-editorial" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setHasTechnicalPattern(!hasTechnicalPattern)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${hasTechnicalPattern ? "bg-telugu-kavi" : "bg-stone-300"}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${hasTechnicalPattern ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <span className="font-editorial text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600">Technical Pattern Background</span>
          </div>

          {error && <p className="text-sm text-red-600 font-editorial">{error}</p>}
          {success && <div className="flex items-center gap-2 text-sm text-green-700 font-editorial"><Check className="h-4 w-4" />Updated!</div>}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || !title.trim() || !date.trim()} className="font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-telugu-kavi hover:bg-telugu-kavi/90 disabled:bg-stone-300 disabled:text-stone-500 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
