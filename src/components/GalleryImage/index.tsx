import Image from "next/image";
import React from "react";

export const URL_PREFIX = "https://static.curious.kim/photos/";

interface GalleryImageProps {
  imageId: string;
  blurBase64Image: string;
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  imageId,
  blurBase64Image,
}: GalleryImageProps) => {
  return (
    <div className="relative w-full aspect-square xs:max-w-[380px] sm:max-w-none sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px]">
      <a href={`${URL_PREFIX}${imageId}.jpg`} target="_blank" rel="noreferrer">
        <Image
          key={`current-${imageId}`}
          className="drop-shadow-xl object-contain"
          src={`${URL_PREFIX}${imageId}.jpg`}
          fill={true}
          sizes="(min-width: 480px) 420px, 300px"
          alt="TODO"
          placeholder="blur"
          quality={100}
          blurDataURL={`data:image/jpg;base64,${blurBase64Image}`}
        />
      </a>
    </div>
  );
};

export default GalleryImage;