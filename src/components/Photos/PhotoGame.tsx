import React, { useCallback, useContext, useEffect, useState } from "react";
import classNames from "classnames";

import Button from "@/components/Button";
import GalleryImage from "@/components/GalleryImage";
import { GameStateContext } from "@/context/GameState";
import Map from "@/components/Map";
import PhotosLayout from "@/components/Photos/PhotosLayout";
import Spinner from "@/components/Spinner";

import type { MapClickEvent, Pin } from "@/components/Map";
import type { ResponsePhotoData } from "@/app/api/photos/route";

const CURRENT_PIN_COLOR = "#fb7185";
const CORRECT_PIN_COLOR = "#168755";

interface PhotoGameProps {
  mapboxApiKey: string;
  photoData?: ResponsePhotoData;
  loadingError?: string;
  isLoading: boolean;
}

const PhotoGame: React.FC<PhotoGameProps> = ({
  mapboxApiKey,
  photoData,
  loadingError,
  isLoading,
}: PhotoGameProps) => {
  const [currentPin, setCurrentPin] = useState<Pin | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const { gameState, addCompletedGuess } = useContext(GameStateContext);

  let contents;
  const completedGuess = gameState?.completedGuesses?.[currentImage];

  const advanceCurrentImage = useCallback((): void => {
    if (!photoData || (currentImage && !hasSubmitted)) {
      return;
    }
    const imageIds = Object.keys(photoData);
    const initialImage = imageIds.filter(
      (imageId) => !gameState.completedGuesses.hasOwnProperty(imageId),
    )[0];
    setCurrentImage(initialImage);
    setCurrentPin(null);
    setHasSubmitted(false);
  }, [currentImage, hasSubmitted, photoData, gameState.completedGuesses]);

  const clickHandler = (e: MapClickEvent): void => {
    setCurrentPin({
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
      color: CURRENT_PIN_COLOR,
    });
  };

  const makeGuess = async (): Promise<void> => {
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
      addCompletedGuess(currentImage, {
        latitude: result.correctLatitude,
        longitude: result.correctLongitude,
        score: result.score,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      advanceCurrentImage();
    }
  }, [photoData, isLoading, advanceCurrentImage]);

  if (loadingError) {
    contents = (
      <p className="text-center">Error fetching . Please try again.</p>
    );
  } else if (!isLoading && photoData && currentImage && gameState.userId) {
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
    const score = gameState.completedGuesses[currentImage]?.score;
    let guessColor: string;
    let guessText: string;
    if (score === undefined) {
      guessColor = "bg-white";
    } else if (score < 1000) {
      guessColor = "bg-emerald-100";
      guessText = "Good job!";
    } else if (score < 5000) {
      guessColor = "bg-amber-100";
      guessText = "Not bad.";
    } else {
      guessColor = "bg-red-100";
      guessText = "Better luck next time.";
    }
    contents = (
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
  } else {
    contents = (
      <div className="flex grow items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <PhotosLayout
      contents={contents}
      currentImageIndex={Object.keys(gameState?.completedGuesses || {}).length}
      photoData={photoData}
      controls={
        completedGuess ? (
          <Button
            onClick={() => {
              setHasSubmitted(true);
              advanceCurrentImage();
            }}
            text="Next"
          />
        ) : (
          <Button onClick={makeGuess} disabled={!currentPin} text="Submit" />
        )
      }
    />
  );
};

export default PhotoGame;
