import React, { useContext } from "react";

import { GameStateContext, GameStatus } from "@/context/GameState";
import Button from "@/components/Button";

const PhotoGallery: React.FC = () => {
  const { setGameStatus } = useContext(GameStateContext);
  return (
    <div className="flex flex-col">
      <div className="w-7/8 h-7/8">TODO</div>
      <div className="flex flex-row gap-2 justify-end">
        <Button onClick={() => setGameStatus(GameStatus.INTRO)}>Go back</Button>
      </div>
    </div>
  );
};

export default PhotoGallery;
