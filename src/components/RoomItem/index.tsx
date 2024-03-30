"use client";

import classNames from "classnames";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface RoomItemProps {
  src: string;
  className?: string;
  imageClass?: string;
  base64PlaceholderImage?: string; // Base64-encoded color to show while image is loading.
  destination?: string;
}

const RoomItem: React.FC<RoomItemProps> = ({
  src,
  className,
  imageClass,
  base64PlaceholderImage,
  destination,
}) => {
  const router = useRouter();

  const classes = classNames(
    className,
    destination
      ? "cursor-pointer z-10 hover:drop-shadow-[0_0_8px_rgba(255,220,115,1)]"
      : "",
  );

  return (
    <div className={classes}>
      <Image
        src={src}
        className={imageClass}
        alt={src.replace(".svg", "").replace("/", "")}
        fill={true}
        priority
        placeholder={`data:image/png;base64,${base64PlaceholderImage}` || ""}
        {...(destination && {
          onClick: () => router.push(destination),
        })}
      />
    </div>
  );
};

export default RoomItem;
