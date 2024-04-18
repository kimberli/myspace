import React, { useContext } from "react";
import useSWR from "swr";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import GalleryImage from "@/components/GalleryImage";
import Map from "@/components/Map";
import Spinner from "@/components/Spinner";

import type { PhotoData } from "@/app/api/photos/route";

interface PhotoGameProps {
  mapboxApiKey: string;
}

const fetcher = (url: string): Promise<PhotoData> =>
  fetch(url).then((res) => res.json());

const PhotoGame: React.FC<PhotoGameProps> = ({
  mapboxApiKey,
}: PhotoGameProps) => {
  const { gameState, setGameStatus } = useContext(GameStateContext);

  const { data, error, isLoading } = useSWR<PhotoData, string, string>(
    "/api/photos",
    fetcher,
  );

  let currentImage;
  let contents;

  if (error) {
    contents = (
      <p className="text-center">Error fetching . Please try again.</p>
    );
  } else if (
    !isLoading &&
    data &&
    Object.keys(data).length &&
    gameState.completedGuesses
  ) {
    const imageIds = Object.keys(data);
    currentImage = imageIds.filter(
      (imageId) => !gameState.completedGuesses.hasOwnProperty(imageId),
    )[0];
    contents = (
      <>
        <GalleryImage
          imageId={currentImage}
          blurBase64Image={data[currentImage]?.blur}
        />
        <Map apiKey={mapboxApiKey} />
      </>
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
      <div className="w-full h-full grow">{contents}</div>
      <div className="flex flex-row gap-2 justify-end">
        <Button
          onClick={() => setGameStatus(GameStatus.INTRO)}
          text="Go back"
        />
        <div className="flex gap-2">
          <Button onClick={() => {}} text="Submit" />
        </div>
      </div>
    </div>
  );
};

export default PhotoGame;
