"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Recipient } from "@/app/types/recipient";

interface BeforeLetterProps {
  recipient: Recipient;
}

export default function BeforeLetter({ recipient }: BeforeLetterProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100dvh] ">
      <div className="text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl font-bold text-foreground"
        >
          아, 그 전에 {recipient.name}님을 생각하면
          <br />
          떠오르는 노래를 먼저 소개해 드릴게요!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg text-foreground/80"
        >
          2024년 {recipient.name}님을 생각하면 떠오르는 노래에요.
          <br />이 노래를 들으면서 편지를 읽어보시는 건 어떤가요?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative w-48 h-48">
            <Image
              src={recipient.song.album_cover_url}
              alt="Album Cover"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-foreground">
              {recipient.song.title}
            </p>
            <p className="text-foreground/60">{recipient.song.artist}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
