"use client";

import classNames from "classnames";
import Image from "next/image";
import React from "react";

export const CLICKABLE_ITEM =
  "cursor-pointer hover:drop-shadow-[0_0_6px_rgba(245,222,171,1)] z-10";

interface RoomItemProps {
  src: string;
  className?: string;
  imageClass?: string;
  base64PlaceholderImage?: string; // Base64-encoded color to show while image is loading.
  onClick?: () => void;
}

const RoomItem: React.FC<RoomItemProps> = ({
  src,
  className,
  imageClass,
  base64PlaceholderImage,
  onClick,
}) => {
  const classes = classNames(className, onClick ? CLICKABLE_ITEM : "");

  return (
    <div className={classes}>
      <Image
        src={src}
        className={imageClass}
        alt={src.replace(".svg", "").replace("/", "")}
        fill={true}
        priority
        placeholder={`data:image/png;base64,${base64PlaceholderImage}` || ""}
        onClick={onClick}
      />
    </div>
  );
};

export default RoomItem;
