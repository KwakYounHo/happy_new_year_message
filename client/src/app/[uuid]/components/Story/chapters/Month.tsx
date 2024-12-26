"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface MonthProps {
  recipient: Recipient;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Month({ recipient }: MonthProps) {
  const monthIndex = recipient.month - 1;
  const monthName = MONTH_NAMES[monthIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center space-y-8"
      >
        <h2 className="text-xl font-bold text-foreground">
          2024년 제가 선정한 {recipient.name}님과의 기억 중
          <br />
          가장 기억에 남는 달이에요!
        </h2>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-4xl font-bold text-foreground"
        >
          {monthName}/{monthIndex + 1}월
        </motion.div>
      </motion.div>
    </div>
  );
}
