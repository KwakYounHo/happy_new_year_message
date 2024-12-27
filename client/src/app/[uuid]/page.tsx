"use client";

import { useState, useEffect } from "react";
import Gravatar from "./components/Gravatar";
import PasswordForm from "./components/PasswordForm";
import LoadingView from "./components/LoadingView";
import ErrorView from "./components/ErrorView";
import { getBeforeRecipient, verifyRecipient } from "./actions";
import type { BeforeRecipient, Recipient } from "../types/recipient";
import Story from "./components/Story";

export default function RecipientPage({
  params,
}: {
  params: { uuid: string };
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipient, setRecipient] = useState<BeforeRecipient | null>(null);
  const [fullRecipient, setFullRecipient] = useState<Recipient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFullData, setIsLoadingFullData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const result = await getBeforeRecipient(params.uuid);
        if (result.error) {
          console.error("Failed to fetch recipient:", result.error);
          setRecipient(null);
        } else if (result.data) {
          setRecipient(result.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipient();
  }, [params.uuid]);

  const handlePasswordSubmit = async (password: string) => {
    setIsLoadingFullData(true);
    setError(null);

    const result = await verifyRecipient(params.uuid, password);

    if (result.error) {
      console.error("Failed to verify password:", result.error);
      setError(result.error.message);
      setIsAuthenticated(false);
    } else if (result.data) {
      setFullRecipient(result.data);
      setIsAuthenticated(true);
    }

    setIsLoadingFullData(false);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (!recipient) {
    return <ErrorView />;
  }

  if (isAuthenticated && fullRecipient) {
    return <Story recipient={fullRecipient} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-6">
      <Gravatar email="kwakyh951@gmail.com" size={400} className="w-48 h-48" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          <span className="text-2xl">{recipient.sub_name}</span>님!
        </h2>
        <p className="text-lg text-foreground/80">
          정성스레 작성한 편지가 준비되어 있어요!
        </p>
      </div>

      {!isAuthenticated && !isLoadingFullData && (
        <>
          <PasswordForm onSubmit={handlePasswordSubmit} />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </>
      )}

      {isLoadingFullData && (
        <p className="text-foreground/60">비밀번호를 확인하는 중...</p>
      )}
    </div>
  );
}
