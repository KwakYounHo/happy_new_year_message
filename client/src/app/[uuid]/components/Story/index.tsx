"use client";

import { useState, useRef, useEffect } from "react";
import type { Recipient } from "@/app/types/recipient";
import Intro from "./chapters/Intro";
import Before from "./chapters/Before";
import Decoration from "./chapters/Decoration";
import Keywords from "./chapters/Keywords";
import Month from "./chapters/Month";
import BeforeLetter from "./chapters/BeforeLetter";
import Letter from "./chapters/Letter";
import EndingFirst from "./chapters/EndingFirst";
import EndingSecond from "./chapters/EndingSecond";
import BeforeBeforeLetter from "./chapters/BeforeBeforeLetter";

interface StoryProps {
  recipient: Recipient;
}

export default function Story({ recipient }: StoryProps) {
  const [currentChapter, setCurrentChapter] = useState(0);

  const chapters = [
    { id: 0, title: "시작 인사", component: <Intro recipient={recipient} /> },
    {
      id: 1,
      title: "시작하기 앞서",
      component: <Before recipient={recipient} />,
    },
    {
      id: 2,
      title: "2024년의 당신",
      component: <Decoration recipient={recipient} />,
    },
    {
      id: 3,
      title: "당신을 기억하는 키워드",
      component: <Keywords recipient={recipient} />,
    },
    {
      id: 4,
      title: "기억에 남는 달",
      component: <Month recipient={recipient} />,
    },
    {
      id: 5,
      title: "편지 준비",
      component: <BeforeBeforeLetter recipient={recipient} />,
    },
    {
      id: 6,
      title: "편지 읽기 전",
      component: <BeforeLetter recipient={recipient} />,
    },
    {
      id: 7,
      title: "편지",
      component: (
        <Letter
          recipient={recipient}
          onNext={() => setCurrentChapter((prev) => prev + 1)}
        />
      ),
    },
    {
      id: 8,
      title: "마무리 인사",
      component: <EndingFirst recipient={recipient} />,
    },
    {
      id: 9,
      title: "마무리 인사",
      component: <EndingSecond recipient={recipient} />,
    },
  ];

  const handleNext = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 스토리 진행 상태 표시 */}
      <div className="absolute top-4 left-0 right-0 z-10 flex gap-1 px-4">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index <= currentChapter ? "bg-foreground" : "bg-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* 현재 챕터 내용 */}
      <div className="w-full h-full">
        {chapters[currentChapter].component || (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl font-bold">
              {chapters[currentChapter].title}
            </h2>
          </div>
        )}
      </div>

      {/* 네비게이션 영역 */}
      <div className="absolute inset-0 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="w-1/3 h-full opacity-0"
          disabled={currentChapter === 0}
          aria-label="이전 페이지"
        />
        <div className="w-1/3 h-full" />
        <button
          onClick={handleNext}
          className="w-1/3 h-full opacity-0"
          disabled={currentChapter === chapters.length - 1}
          aria-label="다음 페이지"
        />
      </div>
    </div>
  );
}
