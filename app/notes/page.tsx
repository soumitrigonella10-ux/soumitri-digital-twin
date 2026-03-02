"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────

interface Note {
  id: string;
  type: "task" | "idea";
  content: string;
  category: string | null;
  completed: boolean | null;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── Category colours ─────────────────────────────────────────

const TASK_CATEGORIES = [
  "CAREER",
  "WELLNESS",
  "PERSONAL",
  "FINANCE",
  "CREATIVE",
  "ADMIN",
] as const;

const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  CAREER:   { text: "text-orange-600", bg: "bg-orange-50" },
  WELLNESS: { text: "text-emerald-600", bg: "bg-emerald-50" },
  PERSONAL: { text: "text-blue-600", bg: "bg-blue-50" },
  FINANCE:  { text: "text-violet-600", bg: "bg-violet-50" },
  CREATIVE: { text: "text-pink-600", bg: "bg-pink-50" },
  ADMIN:    { text: "text-slate-600", bg: "bg-slate-50" },
  GENERAL:  { text: "text-gray-600", bg: "bg-gray-50" },
};

// ── Time-ago helper ──────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
}

// ── API helpers ──────────────────────────────────────────────

async function fetchNotes(type?: "task" | "idea"): Promise<Note[]> {
  const url = type ? `/api/notes?type=${type}` : "/api/notes";
  const res = await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function createNote(
  type: "task" | "idea",
  content: string,
  category?: string
): Promise<Note> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, content, category }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function updateNote(
  id: string,
  updates: Partial<Pick<Note, "content" | "category" | "completed">>
): Promise<Note> {
  const res = await fetch("/api/notes", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
}

// ════════════════════════════════════════════════════════════════
// Notes Page
// ════════════════════════════════════════════════════════════════

function NotesContent() {
  const [tasks, setTasks] = useState<Note[]>([]);
  const [ideas, setIdeas] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Input state
  const [taskInput, setTaskInput] = useState("");
  const [taskCategory, setTaskCategory] = useState<string>("CAREER");
  const [ideaInput, setIdeaInput] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // ── Fetch ────────────────────────────────────────────────────

  const loadNotes = useCallback(async () => {
    try {
      setError(null);
      const allNotes = await fetchNotes();
      setTasks(allNotes.filter((n) => n.type === "task"));
      setIdeas(allNotes.filter((n) => n.type === "idea"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Close category picker on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── CRUD handlers ────────────────────────────────────────────

  const handleAddTask = async () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    try {
      const created = await createNote("task", trimmed, taskCategory);
      setTasks((prev) => [created, ...prev]);
      setTaskInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleAddIdea = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed) return;
    try {
      const created = await createNote("idea", trimmed);
      setIdeas((prev) => [created, ...prev]);
      setIdeaInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create idea");
    }
  };

  const handleToggleComplete = async (task: Note) => {
    const newCompleted = !task.completed;
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: newCompleted } : t))
    );
    try {
      await updateNote(task.id, { completed: newCompleted });
    } catch {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !newCompleted } : t))
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    const prev = tasks;
    setTasks((t) => t.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
    } catch {
      setTasks(prev);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    const prev = ideas;
    setIdeas((i) => i.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
    } catch {
      setIdeas(prev);
    }
  };

  // ── Task counts ──────────────────────────────────────────────

  const activeTasks = tasks.filter((t) => !t.completed);

  // ── Loading state ────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ───────────────────────────────────────────── */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notes Management</h1>
            <p className="text-sm text-gray-500">
              Secure admin space for task matrix and ideation
            </p>
          </div>
        </div>
      </header>

      {/* ── Error banner ─────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 underline hover:no-underline"
          >
            dismiss
          </button>
        </div>
      )}

      {/* ── Two-column layout ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ════════════════════════════════════════════════════ */}
        {/* Admin Task Matrix                                    */}
        {/* ════════════════════════════════════════════════════ */}
        <section>
          {/* Section header */}
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Admin Task Matrix
            </h2>
            {activeTasks.length > 0 && (
              <span className="ml-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {activeTasks.length} Active
              </span>
            )}
          </div>

          {/* Add task input */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-1.5 mb-4 flex items-center gap-2 shadow-sm">
            {/* Category selector */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setShowCategoryPicker((p) => !p)}
                className={cn(
                  "text-[10px] font-bold tracking-wide px-2 py-1 rounded-lg transition-colors",
                  CATEGORY_COLORS[taskCategory]?.bg || "bg-gray-100",
                  CATEGORY_COLORS[taskCategory]?.text || "text-gray-600"
                )}
              >
                {taskCategory}
              </button>
              {showCategoryPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 min-w-[120px]">
                  {TASK_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setTaskCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors",
                        CATEGORY_COLORS[cat]?.text
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Capture new critical task..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none px-2 py-2"
            />
            <button
              onClick={handleAddTask}
              disabled={!taskInput.trim()}
              className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Task list */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No tasks yet — capture your first critical action
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "group bg-white rounded-2xl border-2 border-gray-100 px-4 py-3 flex items-start gap-3 transition-all duration-200 hover:shadow-sm",
                    task.completed && "opacity-60"
                  )}
                >
                  {/* Completion toggle */}
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        task.completed
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-gray-300 hover:border-emerald-400"
                      )}
                    >
                      {task.completed && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium text-gray-800",
                        task.completed && "line-through text-gray-500"
                      )}
                    >
                      {task.content}
                    </p>
                    {task.category && (
                      <span
                        className={cn(
                          "inline-block mt-1 text-[10px] font-bold tracking-wide",
                          CATEGORY_COLORS[task.category]?.text || "text-gray-500"
                        )}
                      >
                        {task.category}
                      </span>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════ */}
        {/* Ideation Scrapbook                                   */}
        {/* ════════════════════════════════════════════════════ */}
        <section>
          {/* Section header */}
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Ideation Scrapbook
            </h2>
          </div>

          {/* Add idea input */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-1.5 mb-4 flex items-center gap-2 shadow-sm">
            <input
              type="text"
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddIdea()}
              placeholder="Log a fleeting thought or potential project..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none px-3 py-2"
            />
            <button
              onClick={handleAddIdea}
              disabled={!ideaInput.trim()}
              className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Ideas list */}
          <div className="space-y-3">
            {ideas.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No ideas yet — log your first fleeting thought
              </p>
            ) : (
              ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="group bg-amber-50/60 rounded-2xl border-2 border-amber-100 px-5 py-4 transition-all duration-200 hover:shadow-sm relative"
                >
                  {/* Timestamp */}
                  <p className="text-[10px] font-semibold text-amber-600/70 uppercase tracking-wider mb-2">
                    {timeAgo(idea.createdAt)}
                  </p>

                  {/* Content */}
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    &ldquo;{idea.content}&rdquo;
                  </p>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Page Export
// ════════════════════════════════════════════════════════════════

export default function NotesPage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen py-8 px-6 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <NotesContent />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
