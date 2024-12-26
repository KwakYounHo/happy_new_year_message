"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface DecorationProps {
  recipient: Recipient;
}

export default function Decoration({ recipient }: DecorationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100dvh] gap-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-4"
      >
        <h2 className="text-xl font-bold text-foreground">
          저에게 {recipient.name}님은
        </h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="text-center space-y-4"
      >
        <p className="text-3xl font-bold text-foreground">
          [{recipient.decoration}]
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="text-center space-y-4"
      >
        <p className="text-xl text-foreground">이었어요!</p>
      </motion.div>
    </div>
  );
}
