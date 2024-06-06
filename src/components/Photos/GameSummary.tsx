import React, { useContext, useEffect } from "react";

import { AnalyticsEvent, AnalyticsVariable, trackEvent } from "@/lib/analytics";
import GalleryImage from "@/components/GalleryImage";
import { GameStateContext } from "@/context/GameState";

import type { ResponsePhotoData } from "@/app/api/photos/route";

interface GameSummaryProps {
  photoData?: ResponsePhotoData;
}

const GameSummary: React.FC<GameSummaryProps> = ({
  photoData,
}: GameSummaryProps) => {
  const { gameState } = useContext(GameStateContext);

  const scores = Object.values(gameState.completedGuesses).map(
    (guess) => guess.score,
  );

  const minGuess = Object.entries(gameState.completedGuesses).reduce((a, b) =>
    a[1].score < b[1].score ? a : b,
  );
  const minGuessImage = minGuess[0];
  const maxGuess = Object.entries(gameState.completedGuesses).reduce((a, b) =>
    a[1].score > b[1].score ? a : b,
  );
  const maxGuessImage = maxGuess[0];

  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const totalScore = scores.reduce((a, b) => a + b, 0);

  useEffect(() => {
    trackEvent(AnalyticsEvent.GAME_OVER, {
      [AnalyticsVariable.FINAL_SCORE]: totalScore,
      [AnalyticsVariable.NUMBER_GUESSES]: scores.length,
      [AnalyticsVariable.USER_ID]: gameState.userId,
    });
  }, [gameState.userId, scores.length, totalScore]);

  return (
    <div className="divide-y flex flex-col gap-2">
      <div>
        <p className="text-center">Game over!</p>
        <p className="text-center">
          Average score: {averageScore.toFixed(2)} km
        </p>
        <p className="text-center">Total score: {totalScore.toFixed(2)} km</p>
      </div>
      {!!photoData && (
        <div className="flex flex-col xs:flex-row justify-evenly gap-2 pt-2">
          <div>
            <p className="text-center text-sm">
              Best guess: {minGuess[1].score.toFixed(3)} km
            </p>
            <GalleryImage
              altText={photoData[minGuessImage]?.label}
              imageId={minGuessImage}
              blurBase64Image={photoData[minGuessImage]?.blur}
              description={photoData[minGuessImage]?.description}
              className="xs:max-w-[320px]"
            />
          </div>
          <div>
            <p className="text-center text-sm">
              Worst guess: {maxGuess[1].score.toFixed(3)} km
            </p>
            <GalleryImage
              altText={photoData[maxGuessImage]?.label}
              imageId={maxGuessImage}
              blurBase64Image={photoData[maxGuessImage]?.blur}
              description={photoData[maxGuessImage]?.description}
              className="xs:max-w-[320px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSummary;
