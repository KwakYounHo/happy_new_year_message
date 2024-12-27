"use client";

import { useState } from "react";
import { createRecipient } from "./actions";
import { useRouter } from "next/navigation";

interface WriteFormData {
  name: string;
  sub_name: string;
  decoration: string;
  month: number;
  letter: string;
  keywords: string[];
  song: {
    title: string;
    artist: string;
    album_cover_url: string;
    youtube_id: string;
  };
  password: string;
}

export default function WritePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WriteFormData>({
    name: "",
    sub_name: "",
    decoration: "",
    month: 1,
    letter: "",
    keywords: [""],
    song: {
      title: "",
      artist: "",
      album_cover_url: "",
      youtube_id: "",
    },
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createRecipient(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        // 성공 시 생성된 편지 페이지로 이동
        router.push(`/${result.data.id}`);
      }
    } catch (error) {
      console.error(error);
      setError("예기치 못한 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addKeyword = () => {
    setFormData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, ""],
    }));
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.map((k, i) => (i === index ? value : k)),
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-4 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-2xl font-bold text-center text-foreground">
          새로운 편지 작성하기
        </h1>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="받는 분의 이름을 입력해주세요"
                  className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  호칭
                </label>
                <input
                  type="text"
                  value={formData.sub_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sub_name: e.target.value,
                    }))
                  }
                  placeholder="받는 분을 어떻게 부르시나요?"
                  className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">
                한 줄 소개
              </label>
              <input
                type="text"
                value={formData.decoration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    decoration: e.target.value,
                  }))
                }
                placeholder="받는 분을 한 줄로 표현해주세요"
                className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">
                기억에 남는 달
              </label>
              <select
                value={formData.month}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    month: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                aria-label="기억에 남는 달 선택"
                title="기억에 남는 달"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>

            {/* 키워드 입력 */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">
                키워드
              </label>
              <div className="space-y-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="키워드를 입력하세요"
                      required
                    />
                    {formData.keywords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addKeyword}
                  className="w-full px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20"
                >
                  키워드 추가
                </button>
              </div>
            </div>

            {/* 노래 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">노래 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.song.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        song: { ...prev.song, title: e.target.value },
                      }))
                    }
                    placeholder="노래 제목을 입력해주세요"
                    className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    아티스트
                  </label>
                  <input
                    type="text"
                    value={formData.song.artist}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        song: { ...prev.song, artist: e.target.value },
                      }))
                    }
                    placeholder="아티스트 이름을 입력해주세요"
                    className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  앨범 커버 URL
                </label>
                <input
                  type="url"
                  value={formData.song.album_cover_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      song: { ...prev.song, album_cover_url: e.target.value },
                    }))
                  }
                  placeholder="앨범 커버 이미지 URL을 입력해주세요"
                  className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  YouTube ID
                </label>
                <input
                  type="text"
                  value={formData.song.youtube_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      song: { ...prev.song, youtube_id: e.target.value },
                    }))
                  }
                  placeholder="YouTube 영상 ID를 입력해주세요"
                  className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>
            </div>

            {/* 편지 내용 */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">
                편지 내용
              </label>
              <textarea
                value={formData.letter}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, letter: e.target.value }))
                }
                placeholder="편지 내용을 작성해주세요"
                className="w-full h-64 px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="편지를 열어볼 때 사용할 비밀번호를 입력해주세요"
                className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 rounded-lg bg-foreground text-background font-medium transition-colors ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-foreground/90"
            }`}
          >
            {isSubmitting ? "편지 작성 중..." : "편지 작성하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
