import React, { useCallback, useContext, useEffect, useState } from "react";

import { AnalyticsEvent, AnalyticsVariable, trackEvent } from "@/lib/analytics";
import Button from "@/components/Button";
import GameGuess from "@/components/Photos/GameGuess";
import { GameStateContext } from "@/context/GameState";
import GameSummary from "@/components/Photos/GameSummary";
import PhotosLayout from "@/components/Photos/PhotosLayout";
import Spinner from "@/components/Spinner";

import type { MapClickEvent, Pin } from "@/components/Map";
import type { ResponsePhotoData } from "@/app/api/photos/route";

const CURRENT_PIN_COLOR = "#fb7185";

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
  const [currentPin, setCurrentPin] = useState<Pin | undefined>(undefined);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const { gameState, addCompletedGuess } = useContext(GameStateContext);

  let contents: React.ReactNode;
  let controls: React.ReactNode;
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
    setCurrentPin(undefined);
    setHasSubmitted(false);
  }, [currentImage, hasSubmitted, photoData, gameState.completedGuesses]);

  const clickHandler = (e: MapClickEvent): void => {
    if (completedGuess) {
      return;
    }
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
      trackEvent(AnalyticsEvent.GUESSED_PHOTO, {
        [AnalyticsVariable.GUESS_PHOTO]: currentImage,
        [AnalyticsVariable.GUESS_SCORE]: result.score,
        [AnalyticsVariable.NUMBER_GUESSES]: Object.keys(
          gameState.completedGuesses,
        ).length,
        [AnalyticsVariable.USER_ID]: gameState.userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isGameOver = (): boolean => {
    return (
      !!photoData &&
      Object.keys(photoData).length ===
        Object.keys(gameState.completedGuesses).length
    );
  };

  useEffect(() => {
    if (!isLoading) {
      advanceCurrentImage();
    }
  }, [photoData, isLoading, advanceCurrentImage]);

  if (loadingError) {
    contents = (
      <p className="text-center">Error fetching data. Please try again.</p>
    );
  } else if (!isLoading && photoData && currentImage && gameState.userId) {
    contents = (
      <GameGuess
        mapboxApiKey={mapboxApiKey}
        currentImage={currentImage}
        currentPin={currentPin}
        hasSubmitted={hasSubmitted}
        photoData={photoData}
        clickHandler={clickHandler}
      />
    );
  } else if (isGameOver()) {
    contents = <GameSummary photoData={photoData} />;
  } else {
    contents = (
      <div className="flex grow items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (completedGuess) {
    controls = (
      <Button
        onClick={() => {
          setHasSubmitted(true);
          advanceCurrentImage();
        }}
        text="Next"
      />
    );
  } else if (!isGameOver()) {
    controls = (
      <Button onClick={makeGuess} disabled={!currentPin} text="Submit" />
    );
  }

  return (
    <PhotosLayout
      contents={contents}
      currentImageIndex={Object.keys(gameState?.completedGuesses || {}).length}
      photoData={photoData}
      controls={controls}
    />
  );
};

export default PhotoGame;
