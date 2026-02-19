"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Sidequest } from "@/data/sidequests";

interface QuestCardProps {
  quest: Sidequest;
  index: number;
  onClick: () => void;
}

export function QuestCard({ quest, index, onClick }: QuestCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container */}
      <div className="relative aspect-[3/2] bg-[#EBDCCB] rounded-sm overflow-hidden mb-2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EBDCCB] via-[#D4C4B0] to-[#BFAF9B]" />
        
        <div 
          className="absolute inset-0 bg-[#4A2C2A] transition-opacity duration-300"
          style={{ opacity: isHovered ? 0 : 0.15 }}
        />

        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full">
          <span className="text-[10px] font-medium text-[#8A2424] tracking-wider uppercase">
            {quest.category}
          </span>
        </div>

        {quest.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-2 right-2 w-6 h-6 bg-[#8A2424] rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="text-lg font-serif text-[#4A2C2A] leading-tight flex-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {quest.title}
          </h3>
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="w-4 h-4 text-[#8A2424] flex-shrink-0" />
          </motion.div>
        </div>

        <p 
          className="text-[#4A2C2A]/70 text-xs leading-relaxed line-clamp-2 font-light"
          style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.02em" }}
        >
          {quest.description}
        </p>
      </div>
    </motion.div>
  );
}
