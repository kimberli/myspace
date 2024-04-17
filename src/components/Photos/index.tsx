import React, { useContext } from "react";
import { useRouter } from "next/navigation";

import { GameStateContext, GameStatus } from "@/context/GameState";
import GameInfo from "@/components/Photos/GameInfo";
import LoadingOverlay from "@/components/LoadingOverlay";
import Modal from "@/components/Modal";
import PhotoGallery from "@/components/Photos/PhotoGallery";
import PhotoGame from "@/components/Photos/PhotoGame";

const Photos: React.FC = () => {
  const router = useRouter();
  const onClose = (): void => router.push("/");
  const { gameState } = useContext(GameStateContext);
  if (gameState.status === undefined) {
    return <LoadingOverlay />;
  }

  let contents;
  switch (gameState.status) {
    case GameStatus.SKIPPED:
      contents = <PhotoGallery />;
      break;
    case GameStatus.PLAYING:
      contents = <PhotoGame />;
      break;
    case GameStatus.FINISHED:
      contents = "Finished";
      break;
    default:
      contents = <GameInfo />;
  }
  return (
    <Modal
      title="Gallery"
      className="flex flex-col"
      onClose={onClose}
      fullSize={gameState.status !== GameStatus.INTRO}
    >
      {contents}
    </Modal>
  );
};

export default Photos;
