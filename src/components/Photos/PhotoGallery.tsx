"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Image from "next/image";

import GalleryImage, { URL_PREFIX } from "@/components/GalleryImage";
import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Spinner from "@/components/Spinner";

import type { PhotoData } from "@/app/api/photos/route";

const PREVIEW_WIDTH = 80;

interface PhotoGalleryProps {
  photoData: PhotoData;
  loadingError: string;
  isLoading: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photoData,
  loadingError,
  isLoading,
}: PhotoGalleryProps) => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const { setGameStatus } = useContext(GameStateContext);
  const scrollableImagesRef = useRef<HTMLDivElement>(null);

  const changeCurrentImage = (delta: number): void => {
    if (currentImage) {
      const imageIds = Object.keys(photoData || {});
      const newIndex =
        (imageIds.indexOf(currentImage) + imageIds.length + delta) %
        imageIds.length;
      setCurrentImage(imageIds[newIndex]);

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
        <div className="flex flex-col gap-3 grow items-center w-full">
          <GalleryImage
            imageId={currentImage}
            blurBase64Image={photoData[currentImage]?.blur}
          />
          <p className="mb-1 text-sm text-center max-w-[800px]">
            {photoData[currentImage]?.description}
          </p>
        </div>
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
              onClick={() => setCurrentImage(imageId)}
              alt="TODO"
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
    <div className="flex flex-col gap-2 min-h-full">
      <div className="flex flex-col grow h-full w-full">{contents}</div>
      <div className="flex flex-row gap-2 justify-between">
        <Button
          onClick={() => setGameStatus(GameStatus.INTRO)}
          text="Go back"
          outline
        />
        <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
