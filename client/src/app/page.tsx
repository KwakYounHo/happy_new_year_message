import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        2024년을 마무리하며 보내는 감사 편지
      </h1>
      <p className="text-foreground/60 mb-8">
        소중한 분들께 전하는 특별한 마음을 담았습니다.
      </p>
      <div className="text-sm text-foreground/50">
        편지를 받으셨다면, 전달받은 링크로 접속해주세요.
      </div>
    </div>
  );
}
