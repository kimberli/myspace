"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Image from "next/image";

import { AnalyticsEvent, AnalyticsVariable, trackEvent } from "@/lib/analytics";
import GalleryImage, { URL_PREFIX } from "@/components/GalleryImage";
import IconButton from "@/components/IconButton";
import PhotosLayout from "@/components/Photos/PhotosLayout";
import Spinner from "@/components/Spinner";

import type { ResponsePhotoData } from "@/app/api/photos/route";

const PREVIEW_WIDTH = 80;

interface PhotoGalleryProps {
  photoData?: ResponsePhotoData;
  loadingError?: string;
  isLoading: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photoData,
  loadingError,
  isLoading,
}: PhotoGalleryProps) => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const scrollableImagesRef = useRef<HTMLDivElement>(null);

  const setCurrentImageAndTrack = (imageId: string): void => {
    setCurrentImage(imageId);
    trackEvent(AnalyticsEvent.CHANGE_PHOTO, {
      [AnalyticsVariable.PHOTO_ID]: imageId,
    });
  };

  const changeCurrentImage = (delta: number): void => {
    if (currentImage) {
      const imageIds = Object.keys(photoData || {});
      const newIndex =
        (imageIds.indexOf(currentImage) + imageIds.length + delta) %
        imageIds.length;
      setCurrentImageAndTrack(imageIds[newIndex]);

      // Scroll the images list to center on the new current image.
      const scrollableDiv = scrollableImagesRef.current;
      if (scrollableDiv && scrollableDiv.parentElement) {
        const totalWidth = scrollableDiv.scrollWidth;
        const containerWidth = scrollableDiv.parentElement.clientWidth;
        const newScrollPosition =
          totalWidth * (newIndex / imageIds.length) +
          (PREVIEW_WIDTH - containerWidth) / 2;
        scrollableDiv.scrollTo({ left: newScrollPosition, behavior: "smooth" });
      }
    }
  };

  const getCurrentImageIndex = (): number => {
    if (currentImage) {
      const imageIds = Object.keys(photoData || {});
      return imageIds.indexOf(currentImage);
    }
    return 0;
  };

  useEffect(() => {
    // Initialize current image to display.
    if (!isLoading) {
      setCurrentImage(Object.keys(photoData || {})[0]);
    }
  }, [isLoading, photoData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeCurrentImage(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        changeCurrentImage(1);
      }
    };

    // Attach listener to change current image and remove when unmounted.
    const listener = handleKeyDown;
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  });

  let contents;
  if (loadingError) {
    contents = (
      <p className="text-center">Error fetching images. Please try again.</p>
    );
  } else if (photoData && currentImage) {
    contents = (
      <div className="flex flex-col grow justify-between items-center h-full w-full select-none">
        <GalleryImage
          imageId={currentImage}
          blurBase64Image={photoData[currentImage]?.blur}
          altText={photoData[currentImage]?.label}
          className="items-center"
          description={photoData[currentImage]?.description}
          descriptionClassName="text-center max-w-[800px]"
          location={photoData[currentImage]?.location}
          showLocationOnHover
        />
        <div
          className="flex flex-row gap-1 overflow-x-scroll"
          ref={scrollableImagesRef}
        >
          {Object.keys(photoData).map((imageId) => (
            <Image
              key={imageId}
              className={classNames(
                "cursor-pointer",
                imageId === currentImage ? "" : "brightness-50",
              )}
              src={`${URL_PREFIX}${imageId}_small.jpg`}
              width={PREVIEW_WIDTH}
              height={PREVIEW_WIDTH}
              onClick={() => setCurrentImageAndTrack(imageId)}
              alt={photoData[imageId]?.label}
            />
          ))}
        </div>
      </div>
    );
  } else {
    contents = (
      <div className="flex grow items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <PhotosLayout
      contents={contents}
      controls={
        <>
          <IconButton
            className="px-2"
            onClick={() => changeCurrentImage(-1)}
            icon={<HiChevronLeft />}
          />
          <IconButton
            className="px-2"
            onClick={() => changeCurrentImage(1)}
            icon={<HiChevronRight />}
          />
        </>
      }
      currentImageIndex={getCurrentImageIndex()}
      photoData={photoData}
    />
  );
};

export default PhotoGallery;
