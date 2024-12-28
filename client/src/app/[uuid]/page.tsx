import RecipientPage from "./components/RecipientPage";
import { getBeforeRecipient } from "./actions";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { uuid: string };
}): Promise<Metadata> => {
  const data = await getBeforeRecipient(params.uuid);
  return {
    title: `${data.data?.sub_name}님께 드리는 2024년 감사의 편지`,
    description: `${data.data?.sub_name}님을 위해 준비한 편지`,
    openGraph: {
      images: [
        {
          url: `/${params.uuid}/opengraph-image`,
          alt: `${data.data?.sub_name || ""} 님을 위한 편지`,
          type: "image/png",
        },
      ],
    },
  };
};

export default function Page({ params }: { params: { uuid: string } }) {
  return <RecipientPage params={params} />;
}
