import classNames from "classnames";
import Image from "next/image";
import React from "react";

export const URL_PREFIX = `https://${process.env.NEXT_PUBLIC_PHOTOS_HOSTNAME}/photos/`;

interface GalleryImageProps {
  imageId: string;
  blurBase64Image: string;
  altText: string;
  className?: string;
  description?: string;
  descriptionClassName?: string;
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  imageId,
  blurBase64Image,
  altText,
  className,
  description,
  descriptionClassName,
}: GalleryImageProps) => {
  return (
    <div
      className={classNames("flex flex-col gap-2 w-full relative", className)}
    >
      <div className="aspect-square h-auto xs:max-w-[380px] w-full relative">
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
      {description && (
        <p className={classNames("mb-1 text-xs", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
};

export default GalleryImage;
