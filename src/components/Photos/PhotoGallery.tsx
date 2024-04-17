"use client";

import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import useSWR from "swr";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

const URL_PREFIX = "https://static.curious.kim/photos/";
const fetcher = (url): string => fetch(url).then((res) => res.json());

const PhotoGallery: React.FC = () => {
  // TODO(Kim): Paginate this since it's reading a 3 MB file.
  const { data, error, isLoading } = useSWR("/api/photos", fetcher);
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (!isLoading) {
      setCurrentImage(Object.keys(data)[0]);
    }
  }, [isLoading, data]);

  const { setGameStatus } = useContext(GameStateContext);

  let contents;
  if (isLoading) {
    contents = (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  } else if (error) {
    contents = (
      <p className="text-center">Error fetching images. Please try again.</p>
    );
  } else if (currentImage) {
    contents = (
      <div className="flex flex-col gap-4">
        <Image
          key={`current-${currentImage}`}
          src={`${URL_PREFIX}${currentImage}.jpg`}
          width={400}
          height={400}
          alt="TODO"
          placeholder="blur"
          blurDataURL={`data:image/jpg;base64,${data[currentImage]?.blur}`}
        />
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
      <p className="text-center">No images found. Please try again.</p>
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
