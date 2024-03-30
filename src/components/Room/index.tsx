import React from "react";

import { ITEMS } from "./items";

interface RoomProps {}

const Room: React.FC<RoomProps> = ({}) => {
  // We use Tailwind responsive utility classes to adjust element positioning when
  // the screen is too narrow or too wide.
  // Keep in mind that responsive classes are mobile-first; "xs" means at a width of xs or higher.
  return (
    <div
      className={`bg-gradient-to-r from-primary via-primary-light to-primary-dark flex flex-col items-center justify-between p-24 relative h-dvh min-h-[650px] overflow-x-hidden`}
    >
      {ITEMS.wall}
      {ITEMS.floor}
      {/* Wall items consist of the photo array and the bookshelf. */}
      <div className="absolute flex flex-col bottom-56 xs:bottom-72 w-full">
        {/* Photos should be inline on wide screens and alternating on narrow screens */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-6 w-full px-2">
          {ITEMS.photoA}
          {ITEMS.photoB}
          {ITEMS.photoC}
        </div>
        {/* Bookshelf */}
        <div className="flex flex-col items-center justify-center w-full">
          {ITEMS.shelf}
          {/* Shelf items */}
          <div className="absolute flex flex-row items-end justify-center gap-20 bottom-12 xs:bottom-[3.25rem]">
            {ITEMS.books}
            {ITEMS.bike}
          </div>
        </div>
      </div>
      <div className="absolute bottom-16 flex flex-row items-center justify-center">
        {ITEMS.plant}
      </div>
      <div className="absolute bottom-12 flex flex-row justify-center">
        {ITEMS.couch}
      </div>
      {/* Move the side table in front of the couch when the screen is too narrow. */}
      <div className="absolute bottom-6 xs:bottom-4 md:bottom-14 flex-row">
        {ITEMS.table}
        {ITEMS.paper}
      </div>
    </div>
  );
};

export default Room;
