"use server";

import { BeforeRecipient, Recipient } from "@/app/types/recipient";

type ErrorResponse = {
  message: string;
  status: number;
};

export async function getBeforeRecipient(
  uuid: string
): Promise<{ error?: ErrorResponse; data?: BeforeRecipient }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipients/${uuid}/before`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return {
      error: {
        message: "Failed to fetch recipient",
        status: response.status,
      },
    };
  }

  const data = await response.json();
  return { data };
}

export async function verifyRecipient(
  uuid: string,
  password: string
): Promise<{ error?: ErrorResponse; data?: Recipient }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipients/${uuid}/password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      return {
        error: {
          message: "비밀번호가 일치하지 않습니다",
          status: 401,
        },
      };
    }
    return {
      error: {
        message: "서버 오류가 발생했습니다",
        status: response.status,
      },
    };
  }

  const data = await response.json();
  return { data };
}
