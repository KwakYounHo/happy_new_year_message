"use client";

import { motion } from "framer-motion";

export default function BeforeBeforeLetter() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 min-h-[100dvh] ">
      <div className="text-center space-y-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-xl text-foreground"
        >
          이제 제가 준비한...
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="text-xl text-foreground"
        >
          편지를 보여드릴게요...!
        </motion.p>
      </div>
    </div>
  );
}
