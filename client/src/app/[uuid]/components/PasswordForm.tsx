"use client";

import { useState } from "react";

interface PasswordFormProps {
  onSubmit: (password: string) => void;
}

export default function PasswordForm({ onSubmit }: PasswordFormProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      <p className="text-sm text-foreground/50 text-center">
        메시지와 함께 전달받은 비밀번호를 입력해 주세요
      </p>
      <div className="flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="w-full px-4 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
        >
          편지 열어보기
        </button>
      </div>
    </form>
  );
}
