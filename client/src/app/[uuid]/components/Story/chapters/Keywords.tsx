"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface KeywordsProps {
  recipient: Recipient;
}

export default function Keywords({ recipient }: KeywordsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100dvh] gap-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-8"
      >
        <h2 className="text-xl font-bold text-foreground">2024년 저에게</h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center space-y-4"
      >
        <span className="text-2xl font-bold">
          <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {recipient.name}
          </span>
          님은
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="text-center space-y-4"
      >
        <p className="text-lg text-foreground/80">이런 기억들로 남아있어요!</p>
      </motion.div>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {recipient.keywords.map((keyword, index) => (
          <motion.div
            key={keyword}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 1.5 + index * 0.5,
            }}
            className="px-4 py-2 bg-foreground/5 rounded-full"
          >
            <span className="text-lg font-medium text-foreground">
              {keyword}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
