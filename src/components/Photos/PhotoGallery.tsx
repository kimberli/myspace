"use client";

import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import useSWR from "swr";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

import type { PhotoData } from "@/app/api/photos/route";

const URL_PREFIX = "https://static.curious.kim/photos/";
const fetcher = (url: string): Promise<PhotoData> =>
  fetch(url).then((res) => res.json());

const PhotoGallery: React.FC = () => {
  const { data, error, isLoading } = useSWR<PhotoData, string, string>(
    "/api/photos",
    fetcher,
  );
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (!isLoading) {
      setCurrentImage(Object.keys(data || {})[0]);
    }
  }, [isLoading, data]);

  const { setGameStatus } = useContext(GameStateContext);

  let contents;
  if (error) {
    contents = (
      <p className="text-center">Error fetching images. Please try again.</p>
    );
  } else if (data && currentImage) {
    contents = (
      <div className="flex flex-col gap-4">
        <div className="w-[400px] h-[400px]">
          <Image
            key={`current-${currentImage}`}
            src={`${URL_PREFIX}${currentImage}.jpg`}
            fill={true}
            alt="TODO"
            placeholder="blur"
            blurDataURL={`data:image/jpg;base64,${data[currentImage]?.blur}`}
          />
        </div>
        <div className="flex flex-row gap-1 overflow-x-scroll">
          {Object.keys(data).map((imageId) => (
            <Image
              key={imageId}
              className={classNames(
                "cursor-pointer",
                imageId === currentImage ? "" : "brightness-75",
              )}
              src={`${URL_PREFIX}${imageId}_small.jpg`}
              width={100}
              height={100}
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
    <div className="flex flex-col gap-2 grow">
      <div className="w-full h-full">{contents}</div>
      <div className="flex flex-row gap-2 justify-end">
        <Button onClick={() => setGameStatus(GameStatus.INTRO)}>Go back</Button>
      </div>
    </div>
  );
};

export default PhotoGallery;
