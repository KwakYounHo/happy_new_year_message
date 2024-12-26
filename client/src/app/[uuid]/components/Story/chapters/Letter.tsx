"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import type { Recipient } from "@/app/types/recipient";
import LetterModal from "./LetterModal";

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
            playsinline?: number;
            rel?: number;
            showinfo?: number;
            modestbranding?: number;
            origin?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const togglePlay = () => {
    if (!isReady) return;

    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      setIsLoading(true);
      try {
        // 현재 상태를 확인하고 필요한 경우에만 cue 실행
        const playerState = playerRef.current?.getPlayerState();
        if (playerState === -1 || playerState === 5) {
          // -1: unstarted, 5: video cued
          playerRef.current?.loadVideoById({
            videoId: recipient.song.youtube_id,
            startSeconds: 0,
          });
        } else {
          playerRef.current?.playVideo();
        }
        setTimeout(() => setIsLoading(false), 1000);
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

  // YouTube 플레이어 초기화 로직
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
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          origin: window.location.origin, // 원본 도메인 설정
        },
        events: {
          onReady: () => {
            if (!cleanup) {
              // 플레이어가 준비되면 동영상을 미리 큐에 로드
              playerRef.current?.cueVideoById({
                videoId: videoId,
                startSeconds: 0,
              });
              setIsReady(true);
              setIsLoading(false);
              // 플레이어가 준비되면 반복 재생 설정
              if (playerRef.current) {
                playerRef.current.setLoop(true);
              }
            }
          },
          onStateChange: (event: { data: number }) => {
            if (!cleanup) {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsLoading(false);
              }
              // 노래가 끝났을 때 다시 재생
              if (event.data === window.YT.PlayerState.ENDED) {
                if (playerRef.current) {
                  playerRef.current.seekTo(0);
                  playerRef.current.playVideo();
                }
              }
            }
          },
          onError: () => {
            if (!cleanup) {
              setIsLoading(false);
              setIsReady(false);
              setShouldInitialize(true);
              // 에러 발생 시 다시 초기화 시도
              setTimeout(() => {
                if (playerRef.current) {
                  playerRef.current.destroy();
                  playerRef.current = null;
                  setShouldInitialize(true);
                }
              }, 1000);
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

            {/* 곡 정보 */}
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

          {/* 안내 문구 */}
          {!isPlaying && isReady && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-foreground/60 text-center"
            >
              재생이 되지 않는다면 버튼을 한 번 더 눌러주세요
            </motion.p>
          )}

          {/* 편지 열기 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="relative bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-foreground/10 space-y-4"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 px-6 bg-foreground text-background hover:bg-foreground/90 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span className="material-icons">mail</span>
              <span>편지 읽기</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={onPrev}
                className="flex-1 py-3 px-4 bg-foreground/10 hover:bg-foreground/20 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span className="material-icons">arrow_left</span>
                <span>이전 페이지</span>
              </button>
              <button
                onClick={onNext}
                className="flex-1 py-3 px-4 bg-foreground/10 hover:bg-foreground/20 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>다음 페이지</span>
                <span className="material-icons">arrow_right</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 편지 모달 */}
      <LetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipient={recipient}
        onNext={onNext}
        onPrev={onPrev}
        sub_name={recipient.sub_name}
        name={recipient.name}
      />

      {/* YouTube 플레이어 (숨김) */}
      <div id="youtube-player" className="hidden" />
    </div>
  );
}
