import React, { useContext } from "react";
import { FaCircle } from "react-icons/fa";

import {
  GameStateContext,
  GameStatus,
  PHOTOS_PER_ROUND,
} from "@/context/GameState";
import { ScoreQuality } from "@/app/api/photos/route";

import type { ResponsePhotoData } from "@/app/api/photos/route";

interface PhotoProgressProps {
  currentImageIndex: number;
  photoData?: ResponsePhotoData;
}

const PhotoProgress: React.FC<PhotoProgressProps> = ({
  currentImageIndex,
  photoData,
}: PhotoProgressProps) => {
  const { gameState, getGuessesFromCurrentRound } =
    useContext(GameStateContext);

  const totalImages = Object.keys(photoData || {}).length;
  if (currentImageIndex === totalImages) {
    return null;
  }
  if (!photoData) {
    return null;
  }
  if (gameState?.status === GameStatus.PLAYING) {
    const guesses = Object.values(getGuessesFromCurrentRound());
    return (
      <span className="flex flex-row gap-2 mr-2">
        {Array.from({ length: PHOTOS_PER_ROUND }, (_, i) => {
          const guess = guesses[i];
          let color: string;
          switch (guess?.scoreQuality) {
            case ScoreQuality.GREAT:
              color = "text-emerald-400";
              break;
            case ScoreQuality.GOOD:
              color = "text-emerald-200";
              break;
            case ScoreQuality.OK:
              color = "text-amber-200";
              break;
            case ScoreQuality.POOR:
              color = "text-red-200";
              break;
            default:
              color = "text-zinc-200";
              break;
          }
          return <FaCircle className={color} key={i} size={6} />;
        })}
      </span>
    );
  }
  return (
    <span>{`${currentImageIndex + 1} / ${Object.keys(photoData).length}`}</span>
  );
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
  return (
    <div className="flex flex-col gap-2 min-h-full">
      <div className="flex flex-col grow h-full w-full">{contents}</div>
      <div className="flex flex-row gap-2 justify-end">
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
