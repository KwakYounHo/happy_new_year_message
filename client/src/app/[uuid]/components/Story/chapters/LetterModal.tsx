"use client";

import ReactMarkdown from "react-markdown";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Recipient } from "@/app/types/recipient";

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: Recipient;
  onNext: () => void;
  onPrev: () => void;
  sub_name: string;
  name: string;
}

export default function LetterModal({
  isOpen,
  onClose,
  recipient,
  onNext,
  onPrev,
  sub_name,
  name,
}: LetterModalProps) {
  const letterRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        ref={modalRef}
        className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden flex flex-col"
      >
        {/* 모달 헤더 */}
        <div className="p-4 border-b border-foreground/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-foreground">
            {name} / {sub_name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
            aria-label="닫기"
          >
            <span className="material-icons text-foreground">close</span>
          </button>
        </div>

        {/* 편지 내용 */}
        <div ref={letterRef} className="p-6 overflow-y-auto flex-1">
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground prose-p:text-foreground prose-headings:text-foreground">
            <ReactMarkdown>{recipient.letter}</ReactMarkdown>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 border-t border-foreground/10 bg-background">
          <div className="flex gap-3">
            <button
              onClick={onPrev}
              className="flex-1 py-3 px-4 bg-foreground text-background hover:bg-foreground/90 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span className="material-icons">arrow_left</span>
              <span>이전 페이지</span>
            </button>
            <button
              onClick={onNext}
              className="flex-1 py-3 px-4 bg-foreground text-background hover:bg-foreground/90 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>다음 페이지</span>
              <span className="material-icons">arrow_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal을 사용하여 모달을 document.body에 직접 렌더링
  return typeof window === "undefined"
    ? null
    : createPortal(modalContent, document.body);
}
