"use client";

import React, { useContext } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { GameStateContext, GameStatus } from "@/context/GameState";
import GalleryInfo from "@/components/Photos/GalleryInfo";
import IconButton from "@/components/IconButton";
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
  const { gameState, setGameStatus } = useContext(GameStateContext);

  const { data, error, isLoading } = useSWR<ResponsePhotoData, string, string>(
    "/api/photos",
    fetcher,
  );

  if (!gameState.userId || !gameState.status) {
    return <LoadingOverlay />;
  }

  let contents;
  switch (gameState.status) {
    case GameStatus.INTRO:
      contents = <GalleryInfo />;
      break;
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
      contents = <LoadingOverlay />;
  }

  const leftControls =
    gameState.status === GameStatus.INTRO ? undefined : (
      <IconButton
        onClick={() => setGameStatus(GameStatus.INTRO)}
        icon={<HiChevronLeft />}
        transparent
      />
    );
  return (
    <Modal
      title="Gallery"
      className="flex flex-col"
      onClose={onClose}
      fullSize={gameState.status !== GameStatus.INTRO}
      leftControls={leftControls}
    >
      {contents}
    </Modal>
  );
};

export default Photos;
