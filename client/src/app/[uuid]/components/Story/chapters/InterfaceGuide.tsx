"use client";

import { motion } from "framer-motion";
import type { Recipient } from "@/app/types/recipient";

interface InterfaceGuideProps {
  recipient: Recipient;
  onNext: () => void;
  onPrev: () => void;
}

export default function InterfaceGuide({
  recipient,
  onNext,
  onPrev,
}: InterfaceGuideProps) {
  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center relative p-4">
      <div className="w-full max-w-lg space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-3"
        >
          <h1 className="text-xl font-bold">{recipient.name}님, 잠시만요!</h1>
          <p className="text-base text-foreground/80">
            편지를 읽기 전에 간단한 안내를 드릴게요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-foreground/10 space-y-4"
        >
          <div className="space-y-2">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <span className="material-icons text-base">touch_app</span>
              화면 터치로 이동하기
            </h2>
            <p className="text-sm text-foreground/80">
              화면의 오른쪽을 터치하면 다음으로 넘어갈 수 있어요.
            </p>
          </div>

          {/* 실제 터치 가능한 네비게이션 영역 */}
          <div className="relative aspect-[16/9] max-h-[30vh] w-full bg-background/50 rounded-xl border-2 border-dashed border-foreground/20 overflow-hidden">
            {/* 왼쪽 영역 - 비활성화 */}
            <div className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-center opacity-30">
              <div className="text-center space-y-2">
                <div className="relative">
                  <span className="material-icons text-3xl text-foreground/40">
                    arrow_back
                  </span>
                </div>
                <p className="text-sm text-foreground/60">이전 페이지</p>
              </div>
            </div>

            {/* 중앙 영역 */}
            <div className="absolute left-1/3 top-0 w-1/3 h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-foreground/60">콘텐츠 영역</p>
              </div>
            </div>

            {/* 오른쪽 영역 - 실제 클릭 가능 */}
            <button
              onClick={onNext}
              className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-center group"
            >
              <div className="text-center space-y-2">
                <div className="relative">
                  <span className="material-icons text-3xl text-foreground/40 group-hover:text-foreground/60 transition-colors">
                    arrow_forward
                  </span>
                  <motion.div
                    initial={false}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-foreground/5 rounded-full -z-10"
                  />
                </div>
                <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                  다음 페이지
                </p>
              </div>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center text-foreground/60 text-xs"
        >
          오른쪽 영역을 터치해서 시작해보세요!
        </motion.div>
      </div>
    </div>
  );
}
