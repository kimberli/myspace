"use client";

import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { GuessResult } from "@/app/api/photos/route";

export const PHOTOS_PER_ROUND = 6;

export const enum GameStatus {
  UNDEFINED = 0,
  INTRO = 1,
  SKIPPED = 2,
  PLAYING = 3,
  FINISHED = 4,
}

export interface Guesses {
  [photoId: string]: GuessResult;
}

interface GameState {
  userId: string;
  currentRound: number;
  status: GameStatus;
  completedGuesses: Guesses;
}

const EmptyGameState = {
  userId: "",
  currentRound: 0,
  status: GameStatus.UNDEFINED,
  completedGuesses: {},
};

function loadGameState(): GameState {
  const storedState = localStorage.getItem("game-state");
  if (storedState) {
    try {
      const state = { currentRound: 0, ...JSON.parse(storedState) };
      return state;
    } catch {
      return {
        userId: uuidv4(),
        currentRound: 0,
        status: GameStatus.INTRO,
        completedGuesses: {},
      };
    }
  }
  return {
    userId: uuidv4(),
    currentRound: 0,
    status: GameStatus.INTRO,
    completedGuesses: {},
  };
}

export const GameStateContext = createContext({
  gameState: {} as GameState,
  setGameStatus: (_gameStatus: GameStatus): void => {},
  addCompletedGuess: (_photoId: string, _guess: GuessResult): void => {},
  getCurrentGuessIndex: (): number => 0,
  incrementCurrentRound: (): void => {},
  getGuessesFromCurrentRound: (): Guesses => ({}),
  clearGameState: (): void => {},
});

const GameStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(EmptyGameState);

  useEffect(() => {
    const newGameState = loadGameState();
    setGameState(newGameState);
  }, []);

  useEffect(() => {
    const saveState = (): void | (() => void) => {
      // Only serialize the game state if it's already loaded.
      if (Object.keys(gameState).length > 0 && gameState.userId) {
        localStorage.setItem("game-state", JSON.stringify(gameState));
      }
    };
    saveState();
    window.addEventListener("beforeunload", saveState);
    return () => window.removeEventListener("beforeunload", saveState);
  }, [gameState]);

  const setGameStatus = (gameStatus: GameStatus): void => {
    setGameState({ ...gameState, status: gameStatus });
  };

  const addCompletedGuess = (photoId: string, guess: GuessResult): void => {
    setGameState({
      ...gameState,
      completedGuesses: { ...gameState.completedGuesses, [photoId]: guess },
    });
  };

  const getCurrentGuessIndex = (): number => {
    return Object.keys(gameState.completedGuesses).length;
  };

  const incrementCurrentRound = (): void => {
    setGameState((prevState) => ({
      ...prevState,
      currentRound: prevState.currentRound + 1,
    }));
  };

  const getGuessesFromCurrentRound = (): Guesses => {
    const roundStartIndex = gameState.currentRound * PHOTOS_PER_ROUND;
    const photosInRound = Object.keys(gameState.completedGuesses).slice(
      roundStartIndex,
      roundStartIndex + PHOTOS_PER_ROUND,
    );
    return photosInRound.reduce(
      (acc, photoId) => ({
        ...acc,
        [photoId]: gameState.completedGuesses[photoId],
      }),
      {},
    );
  };

  const clearGameState = (): void => {
    setGameState((prevState) => ({
      ...prevState,
      currentRound: 0,
      completedGuesses: {},
    }));
  };

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        setGameStatus,
        addCompletedGuess,
        getCurrentGuessIndex,
        incrementCurrentRound,
        getGuessesFromCurrentRound,
        clearGameState,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;
