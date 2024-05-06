"use client";

import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum GameStatus {
  INTRO,
  SKIPPED,
  PLAYING,
  FINISHED,
}

interface Guess {
  score: number;
  latitude: number;
  longitude: number;
}

interface Guesses {
  [photoId: string]: Guess;
}

interface GameState {
  userId: string;
  status: GameStatus;
  completedGuesses: Guesses;
}

const EmptyGameState = {
  userId: "",
  status: GameStatus.INTRO,
  completedGuesses: {},
};

function loadGameState(): GameState {
  const storedState = localStorage.getItem("game-state");
  if (storedState) {
    try {
      const state = JSON.parse(storedState);
      return state;
    } catch {
      return {
        userId: uuidv4(),
        status: GameStatus.INTRO,
        completedGuesses: {},
      };
    }
  }
  return { userId: uuidv4(), status: GameStatus.INTRO, completedGuesses: {} };
}

export const GameStateContext = createContext({
  gameState: {} as GameState,
  setGameStatus: (_gameStatus: GameStatus): void => {},
  addCompletedGuess: (_photoId: string, _guess: Guess): void => {},
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
      if (Object.keys(gameState).length > 0) {
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

  const addCompletedGuess = (photoId: string, guess: Guess): void => {
    setGameState({
      ...gameState,
      completedGuesses: { ...gameState.completedGuesses, [photoId]: guess },
    });
  };

  return (
    <GameStateContext.Provider
      value={{ gameState, setGameStatus, addCompletedGuess }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;
