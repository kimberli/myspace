import React, { useContext, useEffect } from "react";

import { AnalyticsEvent, AnalyticsVariable, trackEvent } from "@/lib/analytics";
import { GameStateContext, PHOTOS_PER_ROUND } from "@/context/GameState";
import Button from "@/components/Button";
import Code from "@/components/Code";
import GalleryImage from "@/components/GalleryImage";
import Spinner from "@/components/Spinner";

import type { Guesses } from "@/context/GameState";
import type { ResponsePhotoData } from "@/app/api/photos/route";

interface GameSummaryProps {
  gameOver?: boolean;
  photoData?: ResponsePhotoData;
}

const GameSummary: React.FC<GameSummaryProps> = ({
  gameOver,
  photoData,
}: GameSummaryProps) => {
  const { gameState, getGuessesFromCurrentRound } =
    useContext(GameStateContext);

  let guesses: Guesses;
  if (gameOver) {
    guesses = gameState.completedGuesses;
  } else {
    guesses = getGuessesFromCurrentRound();
  }

  const scores = Object.values(guesses).map((guess) => guess.score);

  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const totalScore = scores.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const eventName = gameOver
      ? AnalyticsEvent.GAME_OVER
      : AnalyticsEvent.ROUND_OVER;
    trackEvent(eventName, {
      [AnalyticsVariable.FINAL_SCORE]: totalScore,
      [AnalyticsVariable.NUMBER_GUESSES]: scores.length,
      [AnalyticsVariable.USER_ID]: gameState.userId,
    });
  }, [gameOver, gameState.userId, scores.length, totalScore]);

  let details: React.ReactNode;
  if (!gameOver) {
    if (photoData) {
      const minGuess = Object.entries(guesses).reduce((a, b) =>
        a[1].score < b[1].score ? a : b,
      );
      const minGuessImage = minGuess[0];
      const maxGuess = Object.entries(guesses).reduce((a, b) =>
        a[1].score > b[1].score ? a : b,
      );
      const maxGuessImage = maxGuess[0];

      details = (
        <div className="flex flex-col sm:flex-row justify-evenly gap-2 py-2">
          <div>
            <p className="italic text-center text-sm">
              Best guess: {minGuess[1].score.toFixed(3)} km
            </p>
            <GalleryImage
              altText={photoData[minGuessImage]?.label}
              imageId={minGuessImage}
              blurBase64Image={photoData[minGuessImage]?.blur}
              className="m-auto max-w-[320px] sm:w-[260px] md:w-[320px]"
            />
          </div>
          <div>
            <p className="italic text-center text-sm">
              Worst guess: {maxGuess[1].score.toFixed(3)} km
            </p>
            <GalleryImage
              altText={photoData[maxGuessImage]?.label}
              imageId={maxGuessImage}
              blurBase64Image={photoData[maxGuessImage]?.blur}
              className="m-auto max-w-[320px] sm:w-[260px] md:w-[320px]"
            />
          </div>
        </div>
      );
    } else {
      details = (
        <div className="flex grow items-center justify-center w-full h-full">
          <Spinner />
        </div>
      );
    }
  } else {
    const roundScores: number[] = [];
    const totalRounds = Object.keys(photoData).length / PHOTOS_PER_ROUND;
    for (let round = 0; round < totalRounds; round++) {
      const roundScore = scores
        .filter(
          (score, index) => Math.floor(index / PHOTOS_PER_ROUND) === round,
        )
        .reduce((a, b) => a + b, 0);
      roundScores.push(roundScore);
    }
    details = (
      <div className="flex flex-col items-center justify-center gap-2">
        <Code className="text-sm text-zinc-500 mt-2">
          {roundScores.map(
            (score, index) => `Round ${index + 1}: ${score.toFixed(2)} km\n`,
          )}
        </Code>
        <Button
          onClick={() =>
            navigator.clipboard.writeText("Copy this text to clipboard")
          }
          text="Share results"
        />
      </div>
    );
  }

  return (
    <div className="divide-y flex flex-col gap-2">
      <div>
        <p className="text-center">
          {gameOver ? "Game over!" : `Round ${gameState.currentRound + 1}`}
        </p>
        <p className="text-center text-sm">
          Average score: {averageScore.toFixed(2)} km
        </p>
        <p className="text-center text-sm">
          Total score: {totalScore.toFixed(2)} km
        </p>
      </div>
      {details}
    </div>
  );
};

export default GameSummary;
