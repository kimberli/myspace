import React, { useContext } from "react";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";

const PhotosGame: React.FC = () => {
  const { setGameStatus } = useContext(GameStateContext);
  return (
    <div className="flex flex-col gap-2 grow">
      <div className="w-full h-full"></div>
      <div className="flex flex-row gap-2 justify-end">
        <Button
          onClick={() => setGameStatus(GameStatus.INTRO)}
          text="Go back"
        />
      </div>
    </div>
  );
};

export default PhotosGame;
