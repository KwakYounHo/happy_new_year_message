import { ImageResponse } from "next/og";
import { getBeforeRecipient } from "./actions";
import fs from "fs";
import path from "path";

export const size = {
  width: 1200,
  height: 630,
};
export const alt = "편지 확인하기";
export const contentType = "image/png";

type Props = {
  params: {
    uuid: string;
  };
};
export default async function dynamicImageGenerate({ params }: Props) {
  const data = await getBeforeRecipient(params.uuid);
  const sub_name = `${data.data?.sub_name}` || "";

  // 여러 weight의 폰트 파일 로드
  const fontBold = await fs.promises.readFile(
    path.join(process.cwd(), "public/fonts/NotoSansKR-Black.ttf")
  );
  const fontRegular = await fs.promises.readFile(
    path.join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf")
  );
  const fontSemibold = await fs.promises.readFile(
    path.join(process.cwd(), "public/fonts/NotoSansKR-SemiBold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#a0adbf",
          fontFamily: "Noto Sans KR",
        }}
      >
        <img
          src="https://yunhodev.s3.ap-northeast-2.amazonaws.com/public/letter.png"
          alt="편지 확인하기"
          style={{
            width: "500px",
            height: "500px",
          }}
        />
        <div
          style={{
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              margin: "0",
              padding: "0",
              fontSize: "75px",
              fontWeight: "900",
              letterSpacing: "-1px",
            }}
          >
            {sub_name}님!
          </p>
          <p
            style={{
              margin: "0",
              padding: "0",
              fontSize: "25px",
              fontWeight: "400",
              letterSpacing: "-1px",
            }}
          >
            아직 끝나지 않은 2024년, 저의 편지가
          </p>
          <p
            style={{
              margin: "0",
              padding: "0",
              fontSize: "25px",
              fontWeight: "400",
              letterSpacing: "-1px",
            }}
          >
            2024년의 마지막 추억이 되었으면 좋겠어요!
          </p>
          <p
            style={{
              margin: "0",
              marginTop: "10px",
              padding: "0",
              fontSize: "40px",
              fontWeight: "600",
              letterSpacing: "-1px",
            }}
          >
            새해 복 많이 받으세요!
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans KR",
          data: fontBold,
          style: "normal",
          weight: 900,
        },
        {
          name: "Noto Sans KR",
          data: fontRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Noto Sans KR",
          data: fontSemibold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
