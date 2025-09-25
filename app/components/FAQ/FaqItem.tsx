"use client"

import type { FaqItemProps } from "~/interfaces/FaqItemProps";
import { useState} from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FaqItem = ({ title, description }: FaqItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
    <div
      className="w-3xl bg-gray-200 rounded-lg p-4 cursor-pointer shadow-sm"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isOpen ? (
          <Minus className="w-5 h-5 text-gray-700" />
        ) : (
          <Plus className="w-5 h-5 text-gray-700" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-700 text-sm mt-2">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}