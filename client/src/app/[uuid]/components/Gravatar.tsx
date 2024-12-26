import Image from "next/image";
import crypto from "crypto";

interface GravatarProps {
  email: string;
  size?: number;
  className?: string;
}

export default function Gravatar({
  email,
  size = 80,
  className = "",
}: GravatarProps) {
  const hash = crypto
    .createHash("md5")
    .update(email.toLowerCase().trim())
    .digest("hex");

  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=retro`;

  return (
    <div
      className={`relative rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)] ${className}`}
    >
      <Image
        src={gravatarUrl}
        alt="Profile"
        width={size}
        height={size}
        className="object-cover"
        priority
      />
    </div>
  );
}
