import React, { useContext, useState } from "react";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";
import GalleryImage from "@/components/GalleryImage";
import Map from "@/components/Map";
import Spinner from "@/components/Spinner";

import type { MouseClickEvent, Pin } from "@/components/Map";
import type { PhotoData } from "@/app/api/photos/route";

const CURRENT_PIN_COLOR = "#fb7185";
const CORRECT_PIN_COLOR = "#168755";

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
  const [currentPin, setCurrentPin] = useState<Pin | null>(null);
  const [correctPin, setCorrectPin] = useState<Pin | null>(null);
  const { gameState, setGameStatus, addCompletedGuess } =
    useContext(GameStateContext);

  let currentImage;
  let contents;

  const clickHandler = (e: MouseClickEvent): void => {
    setCurrentPin({
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
      color: CURRENT_PIN_COLOR,
    });
  };

  const makeGuess = async (): void => {
    if (!currentPin) {
      return;
    }
    try {
      const body = {
        photoId: currentImage,
        guessLatitude: currentPin.latitude,
        guessLongitude: currentPin.longitude,
      };
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setCorrectPin({
        latitude: result.correctLatitude,
        longitude: result.correctLongitude,
        color: CORRECT_PIN_COLOR,
      });
      addCompletedGuess(currentImage, {
        latitude: result.correctLatitude,
        longitude: result.correctLongitude,
        score: result.score,
      });
      // TODO(Kim): Reset map zoom state when correct answer appears.
    } catch (error) {
      console.error(error);
    }
  };

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
    // TODO(Kim): Only advance currentImage when user clicks a button.
    currentImage = imageIds.filter(
      (imageId) => !gameState.completedGuesses.hasOwnProperty(imageId),
    )[0];
    const completedGuess = gameState.completedGuesses[currentImage];
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
    contents = (
      <div className="flex flex-col sm:flex-row gap-2 grow items-center sm:items-start w-full h-full">
        <GalleryImage
          imageId={currentImage}
          blurBase64Image={photoData[currentImage]?.blur}
          description={photoData[currentImage]?.description}
        />
        <div className="w-auto h-full sm:w-full sm:h-auto place-self-stretch">
          <Map
            apiKey={mapboxApiKey}
            onClick={clickHandler}
            clickable
            pins={pins}
          />
          <div className="relative top-[-80px] m-2 bg-white drop-shadow p-2 z-20">
            <p className="text-sm">
              Click a location on the map, then submit your guess.
            </p>
            {gameState.completedGuesses[currentImage] && (
              <p className="text-sky-600">
                Score: {gameState.completedGuesses[currentImage].score}
              </p>
            )}
          </div>
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
          <Button onClick={makeGuess} text="Submit" />
        </div>
      </div>
    </div>
  );
};

export default PhotoGame;
