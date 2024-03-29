import Image from "next/image";
import React from "react";

interface RoomItemProps {
  src: string;
  className?: string;
  imageClass?: string;
  cover?: boolean;
}

const RoomItem: React.FC<RoomItemProps> = ({ src, className, imageClass }) => {
  return (
    <div className={className}>
      <Image
        src={src}
        className={imageClass}
        alt={src.replace(".svg", "").replace("/", "")}
        fill={true}
        priority
      />
    </div>
  );
};

export default RoomItem;
