import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2024년 감사 편지",
  description: "2024년을 마무리하며 보내는 감사 편지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <ThemeProvider>
          <main className="max-w-[600px] w-full h-[100dvh] bg-background text-foreground mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
