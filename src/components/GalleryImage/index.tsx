import Image from "next/image";
import React from "react";

export const URL_PREFIX = "https://static.curious.kim/photos/";

interface GalleryImageProps {
  imageId: string;
  blurBase64Image: string;
  description?: string;
  altText?: string;
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  imageId,
  blurBase64Image,
  description,
  altText,
}: GalleryImageProps) => {
  return (
    <div className="flex flex-col gap-2 w-full xs:max-w-[380px]">
      <div className="aspect-square h-auto w-full relative">
        <a
          href={`${URL_PREFIX}${imageId}.jpg`}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            key={`current-${imageId}`}
            className="drop-shadow-md object-contain"
            src={`${URL_PREFIX}${imageId}.jpg`}
            fill={true}
            sizes="(min-width: 400px) 380px, 400x"
            alt={altText}
            placeholder="blur"
            quality={100}
            blurDataURL={`data:image/jpg;base64,${blurBase64Image}`}
          />
        </a>
      </div>
      {description && <p className="mb-1 text-sm grow">{description}</p>}
    </div>
  );
};

export default GalleryImage;
