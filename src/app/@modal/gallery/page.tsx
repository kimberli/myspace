"use client";

import React from "react";

import GameStateProvider from "@/context/GameState";
import Photos from "@/components/Photos";

const ModalPage: React.FC = () => {
  return (
    <GameStateProvider>
      <Photos />
    </GameStateProvider>
  );
};

export default ModalPage;
