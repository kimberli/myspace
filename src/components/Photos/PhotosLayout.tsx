import React, { useContext } from "react";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";

import type { ResponsePhotoData } from "@/app/api/photos/route";

interface PhotoProgressProps {
  currentImageIndex: number;
  photoData?: ResponsePhotoData;
}

const PhotoProgress: React.FC<PhotoProgressProps> = ({
  currentImageIndex,
  photoData,
}: PhotoProgressProps) => {
  return photoData ? (
    <span>{`${currentImageIndex + 1} / ${Object.keys(photoData).length}`}</span>
  ) : null;
};

interface PhotosLayoutProps {
  contents: React.ReactNode;
  controls: React.ReactNode;
  currentImageIndex: number;
  photoData?: ResponsePhotoData;
}

const PhotosLayout: React.FC<PhotosLayoutProps> = ({
  contents,
  controls,
  currentImageIndex,
  photoData,
}: PhotosLayoutProps) => {
  const { setGameStatus } = useContext(GameStateContext);
  return (
    <div className="flex flex-col gap-2 min-h-full">
      <div className="flex flex-col grow h-full w-full">{contents}</div>
      <div className="flex flex-row gap-2 justify-between">
        <Button
          onClick={() => setGameStatus(GameStatus.INTRO)}
          text="Return"
          outline
        />
        <div className="flex gap-2 items-center">
          <PhotoProgress
            currentImageIndex={currentImageIndex}
            photoData={photoData}
          />
          {controls}
        </div>
      </div>
    </div>
  );
};

export default PhotosLayout;
