"use client";

import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import type { Sidequest } from "@/data/sidequests";

interface QuestModalProps {
  quest: Sidequest;
  onClose: () => void;
}

export function QuestModal({ quest, onClose }: QuestModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-0"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#8A2424]/80 editorial-backdrop" />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-7xl h-[90vh] lg:h-[85vh] bg-[#F9F5F0] flex flex-col lg:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column - Media */}
        <div className="w-full lg:w-1/2 h-64 lg:h-full bg-gradient-to-br from-[#EBDCCB] via-[#D4C4B0] to-[#BFAF9B] flex-shrink-0" />

        {/* Right Column - Content */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto modal-scroll p-8 lg:p-12 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 lg:top-8 lg:right-8 w-10 h-10 flex items-center justify-center text-[#4A2C2A] hover:text-[#8A2424] transition-all duration-300 hover:rotate-90 group"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Entry ID */}
            <div>
              <span className="text-xs text-[#8A2424] tracking-[0.3em] uppercase font-medium">
                Entry {quest.entryId}
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-4xl lg:text-6xl font-serif italic text-[#4A2C2A] leading-tight pr-12"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {quest.title}
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-[#EBDCCB] text-[#4A2C2A] text-sm font-medium rounded-full">
                {quest.category}
              </span>
              {quest.completed && (
                <span className="px-4 py-2 bg-[#8A2424] text-white text-sm font-medium rounded-full flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>

            {/* Quest Log */}
            <div className="space-y-4">
              <h3 className="text-sm text-[#8A2424] tracking-[0.2em] uppercase font-bold">
                Quest Log
              </h3>
              <p
                className="text-[#4A2C2A]/80 text-base leading-loose font-light"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  lineHeight: "1.9",
                  letterSpacing: "0.01em",
                }}
              >
                {quest.questLog}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
