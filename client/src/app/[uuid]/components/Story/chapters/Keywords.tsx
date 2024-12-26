"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface KeywordsProps {
  recipient: Recipient;
}

export default function Keywords({ recipient }: KeywordsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100dvh] ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        <h2 className="text-xl font-bold text-foreground">
          2024년 저에게 {recipient.name}님은
          <br />
          이런 기억들로 남아있어요!
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {recipient.keywords.map((keyword, index) => (
            <motion.div
              key={keyword}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index === 0 ? 0.5 : (index + 1) * 0.5,
              }}
              className="px-4 py-2 bg-foreground/5 rounded-full"
            >
              <span className="text-lg font-medium text-foreground">
                {keyword}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
