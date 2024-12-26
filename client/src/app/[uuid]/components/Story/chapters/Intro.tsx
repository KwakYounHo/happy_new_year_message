"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface IntroProps {
  recipient: Recipient;
}

export default function Intro({ recipient }: IntroProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-foreground">
          2024년에 {recipient.name}님과
          <br />
          추억을 공유할 수 있어 영광이었어요!
        </h2>
      </motion.div>
    </div>
  );
}
