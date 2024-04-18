import React, { useContext } from "react";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import GalleryImage from "@/components/GalleryImage";
import Map from "@/components/Map";
import Spinner from "@/components/Spinner";

import type { PhotoData } from "@/app/api/photos/route";

interface PhotoGameProps {
  mapboxApiKey: string;
  photoData: PhotoData;
  loadingError: string;
  isLoading: boolean;
}

const PhotoGame: React.FC<PhotoGameProps> = ({
  mapboxApiKey,
  photoData,
  loadingError,
  isLoading,
}: PhotoGameProps) => {
  const { gameState, setGameStatus } = useContext(GameStateContext);

  let currentImage;
  let contents;

  if (loadingError) {
    contents = (
      <p className="text-center">Error fetching . Please try again.</p>
    );
  } else if (
    !isLoading &&
    photoData &&
    Object.keys(photoData).length &&
    gameState.completedGuesses
  ) {
    const imageIds = Object.keys(photoData);
    currentImage = imageIds.filter(
      (imageId) => !gameState.completedGuesses.hasOwnProperty(imageId),
    )[0];
    contents = (
      <>
        <GalleryImage
          imageId={currentImage}
          blurBase64Image={photoData[currentImage]?.blur}
        />
        <Map apiKey={mapboxApiKey} clickable />
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
      <div className="flex flex-col sm:flex-row w-full h-full gap-2 grow">
        {contents}
      </div>
      <div className="flex flex-row gap-2 justify-between">
        <Button
          onClick={() => setGameStatus(GameStatus.INTRO)}
          text="Go back"
          outline
        />
        <div className="flex gap-2">
          <Button onClick={() => {}} text="Submit" />
        </div>
      </div>
    </div>
  );
};

export default PhotoGame;
