"use client";

import React, { useContext, useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import useSWR from "swr";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

const URL_PREFIX = "https://static.curious.kim/photos/";
const fetcher = (url): string => fetch(url).then((res) => res.json());

const PhotoGallery: React.FC = () => {
  const { data, error, isLoading } = useSWR("/api/photos", fetcher);
  const [currentImage, setCurrentImage] = useState<string>("");

  const { setGameStatus } = useContext(GameStateContext);

  let contents;
  if (isLoading) {
    contents = <Spinner />;
  } else if (error) {
    contents = (
      <p className="text-center">Error fetching images. Please try again.</p>
    );
  } else if (data?.length > 0) {
    // TODO(Kim): Add placeholder while images are loading.
    contents = (
      <div className="flex flex-col gap-4">
        <Image
          key={`current-${currentImage}`}
          src={`${URL_PREFIX}${currentImage || data[0]?.id}.jpg`}
          width={400}
          height={400}
          alt="TODO"
        />
        <div className="flex flex-row gap-1 overflow-x-scroll">
          {data.map((image) => (
            <Image
              key={image.id}
              className={classNames(
                "cursor-pointer",
                image.id === currentImage ? "" : "brightness-75",
              )}
              src={`${URL_PREFIX}${image.id}_small.jpg`}
              width={100}
              height={100}
              onClick={() => setCurrentImage(image.id)}
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
    <div className="flex flex-col gap-2">
      <div className="w-7/8 h-7/8">{contents}</div>
      <div className="flex flex-row gap-2 justify-end">
        <Button onClick={() => setGameStatus(GameStatus.INTRO)}>Go back</Button>
      </div>
    </div>
  );
};

export default PhotoGallery;
