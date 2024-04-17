import React, { useContext } from "react";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";

const GameInfo: React.FC = () => {
  const { setGameStatus } = useContext(GameStateContext);

  return (
    <div className="flex flex-col gap-4 mx-auto text-center">
      <p>
        Here are a few of my favorite scenes I&apos;ve collected over the years.
        Note that I&apos;m by no means a photographer, and all of these photos
        were taken on my Pixel phone.
      </p>
      <p>
        As a fun challenge, you can explore the photos via a guessing game
        rather than just in a gallery grid. For each photo, identify the
        location in the world you think it was taken.
      </p>
      <div className="flex flex-row gap-2 justify-end">
        <Button onClick={() => setGameStatus(GameStatus.PLAYING)}>
          Try the challenge
        </Button>
        <Button outline onClick={() => setGameStatus(GameStatus.SKIPPED)}>
          I don&apos;t play games
        </Button>
      </div>
    </div>
  );
};

export default GameInfo;
