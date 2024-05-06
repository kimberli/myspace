"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { GameStateContext, GameStatus } from "@/context/GameState";
import GameInfo from "@/components/Photos/GameInfo";
import LoadingOverlay from "@/components/LoadingOverlay";
import Modal from "@/components/Modal";
import PhotoGallery from "@/components/Photos/PhotoGallery";
import PhotoGame from "@/components/Photos/PhotoGame";

import type { ResponsePhotoData } from "@/app/api/photos/route";

const fetcher = (url: string): Promise<ResponsePhotoData> =>
  fetch(url).then((res) => res.json());

interface PhotosProps {
  mapboxApiKey: string;
}

const Photos: React.FC<PhotosProps> = ({ mapboxApiKey }: PhotosProps) => {
  const router = useRouter();
  const onClose = (): void => router.push("/");
  const { gameState } = useContext(GameStateContext);

  const { data, error, isLoading } = useSWR<ResponsePhotoData, string, string>(
    "/api/photos",
    fetcher,
  );

  if (
    !gameState.userId ||
    !gameState.status ||
    gameState.status == GameStatus.UNDEFINED
  ) {
    return <LoadingOverlay />;
  }

  let contents;
  switch (gameState.status) {
    case GameStatus.SKIPPED:
      contents = (
        <PhotoGallery
          photoData={data}
          loadingError={error}
          isLoading={isLoading}
        />
      );
      break;
    case GameStatus.PLAYING:
      contents = (
        <PhotoGame
          mapboxApiKey={mapboxApiKey}
          photoData={data}
          loadingError={error}
          isLoading={isLoading}
        />
      );
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
