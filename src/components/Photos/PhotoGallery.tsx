"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import useSWR from "swr";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Spinner from "@/components/Spinner";

import type { PhotoData } from "@/app/api/photos/route";

const PREVIEW_WIDTH = 80;

const URL_PREFIX = "https://static.curious.kim/photos/";
const fetcher = (url: string): Promise<PhotoData> =>
  fetch(url).then((res) => res.json());

const PhotoGallery: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const { setGameStatus } = useContext(GameStateContext);
  const scrollableImagesRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading } = useSWR<PhotoData, string, string>(
    "/api/photos",
    fetcher,
  );

  const changeCurrentImage = (delta: number): void => {
    if (currentImage) {
      const imageIds = Object.keys(data || {});
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
      setCurrentImage(Object.keys(data || {})[0]);
    }
  }, [isLoading, data]);

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
  if (error) {
    contents = (
      <p className="text-center">Error fetching images. Please try again.</p>
    );
  } else if (data && currentImage) {
    contents = (
      <div className="flex flex-col gap-3 select-none">
        <div className="relative w-full aspect-square xs:w-[380px] xs:h-[380px] md:w-[420px] md:h-[420px]">
          <a
            href={`${URL_PREFIX}${currentImage}.jpg`}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              key={`current-${currentImage}`}
              className="drop-shadow-xl object-contain"
              src={`${URL_PREFIX}${currentImage}.jpg`}
              fill={true}
              sizes="(min-width: 768px) 420px, 300px"
              alt="TODO"
              placeholder="blur"
              quality={100}
              blurDataURL={`data:image/jpg;base64,${data[currentImage]?.blur}`}
            />
          </a>
        </div>
        <div
          className="flex flex-row gap-1 overflow-x-scroll"
          ref={scrollableImagesRef}
        >
          {Object.keys(data).map((imageId) => (
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
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 grow h-full">
      <div className="w-full h-full">{contents}</div>
      <div className="flex flex-row gap-2 justify-end">
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
        <Button
          onClick={() => setGameStatus(GameStatus.INTRO)}
          text="Go back"
        />
      </div>
    </div>
  );
};

export default PhotoGallery;
