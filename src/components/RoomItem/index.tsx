"use client";

import classNames from "classnames";
import Image from "next/image";
import React from "react";

import { AnalyticsEvent, AnalyticsVariable, trackEvent } from "@/lib/analytics";

const GLOW = "hover:drop-shadow-[0_0_6px_rgba(245,222,171,1)]";
export const PARENT_GLOW =
  "has-[:hover]:drop-shadow-[0_0_6px_rgba(245,222,171,1)]";

export const CLICKABLE_ITEM = "cursor-pointer z-10";

interface RoomItemProps {
  src: string;
  className?: string;
  imageClass?: string;
  base64PlaceholderImage?: string; // Base64-encoded color to show while image is loading.
  onClick?: () => void;
  glow?: boolean;
}

const RoomItem: React.FC<RoomItemProps> = ({
  src,
  className,
  imageClass,
  base64PlaceholderImage,
  onClick,
  glow,
}) => {
  const classes = classNames(
    className,
    onClick && CLICKABLE_ITEM,
    onClick && glow && GLOW,
  );

  const itemName = src.replace(".svg", "").replace("/", "");

  const trackedOnClick = onClick
    ? (): void => {
        trackEvent(AnalyticsEvent.ITEM_CLICKED, {
          [AnalyticsVariable.ITEM_CLICKED]: itemName,
        });
        onClick();
      }
    : undefined;

  return (
    <div className={classes}>
      <Image
        src={src}
        className={imageClass}
        alt={itemName}
        fill={true}
        priority
        placeholder={`data:image/png;base64,${base64PlaceholderImage}` || ""}
        onClick={trackedOnClick}
      />
    </div>
  );
};

export default RoomItem;
