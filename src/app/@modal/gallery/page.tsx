"use server";

import React from "react";

import GameStateProvider from "@/context/GameState";
import Photos from "@/components/Photos";

const GalleryModalPage: React.FC = () => {
  const mapboxApiKey: string = process.env.MAPBOX_API_KEY || "";
  return (
    <GameStateProvider>
      <Photos mapboxApiKey={mapboxApiKey} />
    </GameStateProvider>
  );
};

export default GalleryModalPage;
