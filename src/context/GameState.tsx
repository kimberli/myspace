"use client";

import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum GameStatus {
  INTRO,
  SKIPPED,
  PLAYING,
  FINISHED,
}

interface Guesses {
  [imageId: string]: {
    score: number;
    latitude: number;
    longitude: number;
  };
}

interface GameState {
  userId: string;
  status: GameStatus;
  completedGuesses: Guesses;
}

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
});

const GameStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    userId: "",
    status: GameStatus.INTRO,
    completedGuesses: {},
  });

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

  return (
    <GameStateContext.Provider value={{ gameState, setGameStatus }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;
