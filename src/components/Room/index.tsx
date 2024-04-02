"use client";

import React, { useState } from "react";

import {
  Bike,
  Books,
  Couch,
  Floor,
  Paper,
  Photos,
  Plant,
  Shelf,
  Table,
  Wall,
} from "./items";

import Modal from "@/components/Modal";

interface RoomProps {}

const Room: React.FC<RoomProps> = ({}) => {
  const [showInfoModal, setShowInfoModal] = useState(true);
  // We use Tailwind responsive utility classes to adjust element positioning when
  // the screen is too narrow or too wide.
  // Keep in mind that responsive classes are mobile-first; "xs" means at a width of xs or higher.
  return (
    <div
      className={`bg-gradient-to-r from-primary via-primary-light to-primary-dark flex flex-col items-center justify-between p-24 relative h-dvh min-h-[650px] overflow-x-hidden`}
    >
      {showInfoModal && (
        <Modal title="About" onClose={() => setShowInfoModal(false)}>
          <div className="mx-4">
            <p className="mb-2">
              Welcome to my space! I created this during a period of nomadic
              traveling, imagining it as my little home on the Internet.
            </p>
            <p className="mb-2">
              Feel free to explore, or just settle in and make yourself
              comfortable.
            </p>
            <p className="mb-2">
              To learn more about me, visit my personal website at{" "}
              <a href="https://kimberli.me" target="_blank">
                kimberli.me
              </a>
              .
            </p>
            <p className="mb-2 text-right">- Kim</p>
          </div>
        </Modal>
      )}
      <Wall />
      <Floor />
      {/* Wall items consist of the photo array and the bookshelf. */}
      <div className="absolute flex flex-col bottom-56 xs:bottom-72 w-full">
        <Photos />
        <div className="flex flex-col items-center justify-center w-full">
          <Shelf />
          <div className="absolute flex flex-row items-end justify-center gap-20 bottom-12 xs:bottom-[3.25rem]">
            <Books />
            <Bike />
          </div>
        </div>
      </div>
      <div className="absolute bottom-16 flex flex-row items-center justify-center">
        <Plant />
      </div>
      <div className="absolute bottom-12 flex flex-row justify-center">
        <Couch />
      </div>
      {/* Move the side table in front of the couch when the screen is too narrow. */}
      <div className="absolute bottom-6 xs:bottom-4 md:bottom-14 flex-row">
        <Table />
        <Paper onClick={() => setShowInfoModal(true)} />
      </div>
    </div>
  );
};

export default Room;
