"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface BeforeProps {
  recipient: Recipient;
}

export default function Before({ recipient }: BeforeProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-xl font-bold text-foreground">
          제가 생각하는 2024년의 {recipient.name}님을 소개할게요!
        </h2>
      </motion.div>
    </div>
  );
}
