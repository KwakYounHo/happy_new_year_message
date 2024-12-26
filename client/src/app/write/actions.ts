"use server";

interface CreateRecipientData {
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

interface CreateRecipientResponse {
  id: string;
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
}

export async function createRecipient(
  data: CreateRecipientData
): Promise<{ error?: string; data?: CreateRecipientResponse }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recipients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
        return { error: "잘못된 요청입니다. 입력값을 확인해주세요." };
      }
      return { error: "편지를 저장하는 중에 오류가 발생했습니다." };
    }

    const responseData = await response.json();
    return { data: responseData };
  } catch (error) {
    console.error("Failed to create recipient:", error);
    return { error: "서버와 통신하는 중에 오류가 발생했습니다." };
  }
}
