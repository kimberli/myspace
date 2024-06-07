import React, { useContext } from "react";
import classNames from "classnames";

import GalleryImage from "@/components/GalleryImage";
import { GameStateContext } from "@/context/GameState";
import Map from "@/components/Map";
import { ScoreQuality } from "@/app/api/photos/route";

import type { MapClickEvent, Pin } from "@/components/Map";
import type { ResponsePhotoData } from "@/app/api/photos/route";

export const CURRENT_PIN_COLOR = "#fb7185";
export const CORRECT_PIN_COLOR = "#168755";

interface GameGuessProps {
  mapboxApiKey: string;
  currentImage: string;
  currentPin?: Pin;
  hasSubmitted: boolean;
  photoData: ResponsePhotoData;
  clickHandler: (e: MapClickEvent) => void;
}

const GameGuess: React.FC<GameGuessProps> = ({
  mapboxApiKey,
  currentImage,
  currentPin,
  hasSubmitted,
  photoData,
  clickHandler,
}: GameGuessProps) => {
  const { gameState } = useContext(GameStateContext);

  const completedGuess = gameState?.completedGuesses?.[currentImage];
  const score = completedGuess?.score;
  const scoreQuality = completedGuess?.scoreQuality;

  const pins = [];
  if (currentPin) {
    pins.push(currentPin);
  }
  if (completedGuess) {
    pins.push({
      latitude: completedGuess.latitude,
      longitude: completedGuess.longitude,
      color: CORRECT_PIN_COLOR,
    });
  }

  let guessColor: string = "bg-white";
  let guessText: string = "";

  switch (scoreQuality) {
    case ScoreQuality.GREAT:
      guessColor = "bg-emerald-200";
      guessText = "Amazing!";
      break;
    case ScoreQuality.GOOD:
      guessColor = "bg-emerald-100";
      guessText = "Good job!";
      break;
    case ScoreQuality.OK:
      guessColor = "bg-amber-100";
      guessText = "Not bad.";
      break;
    case ScoreQuality.POOR:
      guessColor = "bg-red-100";
      guessText = "Better luck next time.";
      break;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 grow items-center sm:items-start w-full h-full">
      <GalleryImage
        altText={photoData[currentImage]?.label}
        imageId={currentImage}
        blurBase64Image={photoData[currentImage]?.blur}
        description={photoData[currentImage]?.description}
        className="xs:max-w-[380px]"
      />
      <div className="relative w-auto h-full sm:w-full sm:h-auto place-self-stretch">
        <Map
          apiKey={mapboxApiKey}
          centerLatitude={completedGuess?.latitude}
          centerLongitude={completedGuess?.longitude}
          zoomLevel={hasSubmitted ? 0 : undefined}
          onClick={clickHandler}
          clickable
          pins={pins}
        />
        <div
          className={classNames(
            "absolute top-0 m-2 drop-shadow-xl p-2 z-20",
            guessColor,
          )}
        >
          <p className="text-sm">
            {gameState.completedGuesses[currentImage]
              ? `Score: ${score.toFixed(3)} km`
              : "Click a location on the map, then submit your guess."}
          </p>
          <p className="text-sm">{guessText}</p>
        </div>
      </div>
    </div>
  );
};

export default GameGuess;
