import React, { useCallback, useContext, useEffect, useState } from "react";

import { AnalyticsEvent, AnalyticsVariable, trackEvent } from "@/lib/analytics";
import GameGuess, { CURRENT_PIN_COLOR } from "@/components/Photos/GameGuess";
import { GameStateContext, PHOTOS_PER_ROUND } from "@/context/GameState";
import Button from "@/components/Button";
import GameSummary from "@/components/Photos/GameSummary";
import PhotosLayout from "@/components/Photos/PhotosLayout";
import Spinner from "@/components/Spinner";

import type { MapClickEvent, Pin } from "@/components/Map";
import type { ResponsePhotoData } from "@/app/api/photos/route";

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
  const {
    gameState,
    addCompletedGuess,
    getCurrentGuessIndex,
    incrementCurrentRound,
    clearGameState,
  } = useContext(GameStateContext);

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
      addCompletedGuess(currentImage, result);
      trackEvent(AnalyticsEvent.GUESSED_PHOTO, {
        [AnalyticsVariable.PHOTO_ID]: currentImage,
        [AnalyticsVariable.GUESS_SCORE]: result.score,
        [AnalyticsVariable.NUMBER_GUESSES]: getCurrentGuessIndex(),
        [AnalyticsVariable.USER_ID]: gameState.userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isGameOver = (): boolean => {
    if (!photoData) {
      return false;
    }
    const totalPhotos = Object.keys(photoData).length;
    return PHOTOS_PER_ROUND * gameState.currentRound >= totalPhotos;
  };

  const atEndOfRound = (): boolean => {
    const currentGuessIndex = getCurrentGuessIndex();
    if (currentGuessIndex === 0) {
      return false;
    }
    const intendedRound = currentGuessIndex / PHOTOS_PER_ROUND;
    return (
      intendedRound !== gameState.currentRound &&
      currentGuessIndex % PHOTOS_PER_ROUND === 0
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
  } else if (isGameOver()) {
    contents = <GameSummary photoData={photoData} gameOver />;
    controls = (
      <Button
        onClick={() => {
          clearGameState();
        }}
        text="Start over"
      />
    );
  } else if (!completedGuess && atEndOfRound()) {
    contents = <GameSummary photoData={photoData} />;
    controls = (
      <Button
        onClick={() => {
          incrementCurrentRound();
        }}
        text="Continue"
      />
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
    } else {
      controls = (
        <Button onClick={makeGuess} disabled={!currentPin} text="Submit" />
      );
    }
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
      controls={controls}
      currentImageIndex={getCurrentGuessIndex()}
      photoData={photoData}
    />
  );
};

export default PhotoGame;
