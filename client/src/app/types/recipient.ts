interface Recipient {
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

interface BeforeRecipient {
  id: string;
  name: string;
  sub_name: string;
}

export type { Recipient, BeforeRecipient };
