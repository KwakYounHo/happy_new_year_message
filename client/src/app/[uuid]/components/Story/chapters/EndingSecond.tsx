"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Recipient } from "@/app/types/recipient";

interface EndingSecondProps {
  recipient: Recipient;
}

export default function EndingSecond({ recipient }: EndingSecondProps) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full p-4 min-h-[100dvh] ">
      <motion.div
        initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
        animate={{ opacity: 0.075, clipPath: "circle(100% at 50% 50%)" }}
        transition={{
          duration: 7,
          opacity: { duration: 7 },
          clipPath: {
            duration: 7,
            ease: "easeOut",
          },
        }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/happy_new_year.png"
          alt="새해 복 많이 받으세요"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </motion.div>

      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-xl text-foreground"
          >
            저에게 너무나도 값진
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl text-foreground"
          >
            2024년을 선물해 주셔서 감사드리고
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="text-xl text-foreground"
          >
            <span className="text-2xl font-bold">{recipient.name}</span>님도
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
            className="text-xl text-foreground"
          >
            2024년에 끝내 다 못이룬 계획들이 있었다면
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 4 }}
            className="text-xl text-foreground"
          >
            2025년에는 계획하시는 모든 일들이
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 5 }}
            className="text-xl text-foreground"
          >
            다 이루어지시길 간절히 바랄게요.
          </motion.p>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 6 }}
          className="text-2xl font-bold text-foreground"
        >
          새해 복 많이 받으세요!
        </motion.p>
      </div>
    </div>
  );
}
