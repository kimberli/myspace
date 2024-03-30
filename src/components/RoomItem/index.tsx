import Image from "next/image";
import React from "react";

interface RoomItemProps {
  src: string;
  className?: string;
  imageClass?: string;
  base64PlaceholderImage?: string; // Base64-encoded color to show while image is loading.
}

const RoomItem: React.FC<RoomItemProps> = ({
  src,
  className,
  imageClass,
  base64PlaceholderImage,
}) => {
  return (
    <div className={className}>
      <Image
        src={src}
        className={imageClass}
        alt={src.replace(".svg", "").replace("/", "")}
        fill={true}
        priority
        placeholder={`data:image/png;base64,${base64PlaceholderImage}` || ""}
      />
    </div>
  );
};

export default RoomItem;
