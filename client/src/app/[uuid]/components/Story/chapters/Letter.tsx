"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import type { Recipient } from "@/app/types/recipient";

interface LetterProps {
  recipient: Recipient;
  onNext: () => void;
  onPrev: () => void;
}

// YouTube Player 타입 정의
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string;
          width: string;
          videoId: string;
          playerVars: {
            autoplay: number;
            controls: number;
            disablekb: number;
            loop: number;
            playlist: string;
          };
          events: {
            onReady: () => void;
            onStateChange: (event: { data: number }) => void;
            onError: () => void;
          };
        }
      ) => any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }
}

export default function Letter({ recipient, onNext, onPrev }: LetterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const [shouldInitialize, setShouldInitialize] = useState(true);
  const [showNextButton, setShowNextButton] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  // 기존의 YouTube 플레이어 초기화 및 제어 로직 복원
  // ... (이전 Letter.tsx의 useEffect와 togglePlay 함수들)

  const togglePlay = () => {
    if (!isReady) return;

    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      setIsLoading(true);
      try {
        playerRef.current?.playVideo();
        setTimeout(() => setIsLoading(false), 3000);
      } catch (error) {
        setIsLoading(false);
        console.error("Failed to play video:", error);
      }
    }
  };

  // 컴포넌트가 언마운트될 때 플레이어 정리
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setIsReady(false);
      setIsPlaying(false);
      setIsLoading(false);
    };
  }, []);

  // 크롤 감지하여 다음 버튼 표시 여부 결정
  useEffect(() => {
    const letterContainer = letterRef.current;
    if (!letterContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = letterContainer;
      // 스크롤이 거의 끝에 도달했을 때 (20px 여유)
      if (scrollHeight - scrollTop - clientHeight < 20) {
        setShowNextButton(true);
      } else {
        setShowNextButton(false);
      }
    };

    letterContainer.addEventListener("scroll", handleScroll);
    // 초기 체크
    handleScroll();

    return () => letterContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // YouTube 플레이어 초기화 로직 추가
  useEffect(() => {
    if (!shouldInitialize) return;

    const videoId = recipient.song.youtube_id;
    if (!videoId) return;

    let cleanup = false;

    const initializePlayer = () => {
      if (cleanup) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          loop: 1,
          playlist: videoId,
        },
        events: {
          onReady: () => {
            if (!cleanup) {
              setIsReady(true);
              setIsLoading(false);
            }
          },
          onStateChange: (event: { data: number }) => {
            if (!cleanup) {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsLoading(false);
              }
            }
          },
          onError: () => {
            if (!cleanup) {
              setIsLoading(false);
              setIsReady(false);
              setShouldInitialize(true);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      window.onYouTubeIframeAPIReady = initializePlayer;
      document.body.appendChild(script);
    }

    return () => {
      cleanup = true;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setIsReady(false);
      setIsPlaying(false);
      setIsLoading(false);
      setShouldInitialize(true);
    };
  }, [recipient.song.youtube_id, shouldInitialize]);

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-4 overflow-hidden touch-none">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          {/* 음악 컨트롤러 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-foreground/10 flex items-center relative z-[5]"
          >
            {/* 재생 버튼 */}
            <div className="flex-shrink-0 mr-4">
              <button
                onClick={togglePlay}
                disabled={isLoading || !isReady}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-foreground/10 hover:bg-foreground/20"
                } ${isLoading ? "cursor-wait" : ""} ${
                  !isReady ? "opacity-50" : ""
                }`}
                aria-label={isPlaying ? "일시정지" : "재생"}
              >
                {isLoading ? (
                  <motion.span
                    className="material-icons"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    sync
                  </motion.span>
                ) : isPlaying ? (
                  <span className="material-icons">pause</span>
                ) : (
                  <span className="material-icons">play_arrow</span>
                )}
              </button>
            </div>

            {/* 곡 정보 - 남은 공간 전체 사용 */}
            <div className="flex-1 min-w-0">
              {/* 제목 */}
              <div className="overflow-hidden">
                {recipient.song.title.length > 20 ? (
                  <div className="relative w-full">
                    <div className="whitespace-nowrap inline-flex">
                      <span className="animate-marquee font-medium">
                        {recipient.song.title}&nbsp;&nbsp;&nbsp;&nbsp;
                        {recipient.song.title}&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="font-medium truncate">{recipient.song.title}</p>
                )}
              </div>

              {/* 아티스트 */}
              <div className="overflow-hidden">
                {recipient.song.artist.length > 20 ? (
                  <div className="relative w-full">
                    <div className="whitespace-nowrap inline-flex">
                      <span className="animate-marquee text-foreground/60">
                        {recipient.song.artist}&nbsp;&nbsp;&nbsp;&nbsp;
                        {recipient.song.artist}&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground/60 truncate">
                    {recipient.song.artist}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* 편지 내용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="relative bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-foreground/10 h-[75dvh] z-20 overflow-hidden"
          >
            <div
              ref={letterRef}
              className="h-full overflow-y-auto overscroll-contain touch-pan-y pr-4 relative will-change-scroll"
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
              }}
            >
              <div className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{recipient.letter}</ReactMarkdown>
              </div>
              <div className="h-32" />
            </div>

            {/* 이전/다음 페이지 버튼 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showNextButton ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 px-8 pb-8 bg-gradient-to-t from-background/95 to-transparent pt-16"
            >
              <div className="flex gap-3">
                <button
                  onClick={onPrev}
                  className="flex-1 py-3 px-4 bg-foreground/10 hover:bg-foreground/20 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span className="material-icons">arrow_left</span>
                  <span className="text-foreground/80">이전 페이지</span>
                </button>
                <button
                  onClick={onNext}
                  className="flex-1 py-3 px-4 bg-foreground/10 hover:bg-foreground/20 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span className="text-foreground/80">다음 페이지</span>
                  <span className="material-icons">arrow_right</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* YouTube 플레이어 (숨김) */}
      <div id="youtube-player" className="hidden" />
    </div>
  );
}
