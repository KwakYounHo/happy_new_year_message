"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface EndingFirstProps {
  recipient: Recipient;
}

export default function EndingFirst({ recipient }: EndingFirstProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100vh]">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-xl text-foreground"
          >
            저에게 2024년 한 해는
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl text-foreground"
          >
            기쁨, 슬픔, 즐거움 등 풍성한 감정들로 다채로운 한 해였어요.
          </motion.p>
        </div>
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="text-xl text-foreground"
          >
            이렇게나 많은 색상으로 한 해를 채울 수 있었던 것은
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
            className="text-xl text-foreground"
          >
            <span className="text-2xl font-bold">{recipient.name}</span>님과의
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 4 }}
            className="text-xl text-foreground"
          >
            아름다운 추억 덕분이라고 생각해요.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
