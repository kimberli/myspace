"use client";

import React from "react";
import { useRouter } from "next/navigation";

import RoomItem, { PARENT_GLOW } from "@/components/RoomItem";

export const Wall: React.FC<> = () => (
  <RoomItem
    src="/wall.svg"
    className="absolute bottom-20 xs:bottom-24 h-4 xs:h-8 w-full"
    imageClass="object-cover object-top"
    base64PlaceholderImage="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88eTmfwAJBwOmQQR12wAAAABJRU5ErkJggg=="
  />
);

export const Floor: React.FC<> = () => (
  <RoomItem
    src="/floor.svg"
    className="absolute bottom-0 h-20 xs:h-24 w-full"
    imageClass="object-cover object-top"
    base64PlaceholderImage="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMNtf7DwADVgG50H/xBwAAAABJRU5ErkJggg=="
  />
);

export const Photos: React.FC<> = () => {
  const router = useRouter();
  return (
    <div
      className={`flex flex-col xs:flex-row items-center justify-center gap-6 px-2 ${PARENT_GLOW}`}
    >
      <RoomItem
        src="/photo_a.svg"
        className="relative right-16 top-48 xs:inset-0 h-[150px] w-[100px] xs:h-[180px] xs:w-[120px]"
        imageClass="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
        onClick={() => router.push("/photos")}
      />
      <RoomItem
        src="/photo_b.svg"
        className="relative right-16 top-48 xs:inset-0 w-[90px] h-[90px] xs:w-[140px] xs:h-[140px]"
        imageClass="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
        onClick={() => router.push("/photos")}
      />
      <RoomItem
        src="/photo_c.svg"
        className="relative left-16 bottom-12 xs:inset-0 w-[112px] h-[144px] xs:w-[140px] xs:h-[180px]"
        imageClass="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
        onClick={() => router.push("/photos")}
      />
    </div>
  );
};

export const Shelf: React.FC<> = () => (
  <RoomItem
    src="/shelf.svg"
    className="relative w-[300px] xs:w-[320px] h-[150px] xs:h-[160px]"
    imageClass="drop-shadow-[8px_8px_4px_rgba(0,0,0,0.2)]"
  />
);

export const Books: React.FC<> = () => {
  const router = useRouter();
  return (
    <RoomItem
      src="/books.svg"
      className="relative w-[100px] h-[70px]"
      imageClass="drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
      onClick={() => router.push("/favorites")}
      glow
    />
  );
};

export const Bike: React.FC<> = () => {
  const router = useRouter();
  return (
    <RoomItem
      src="/bike.svg"
      className="relative w-[80px] h-[60px]"
      onClick={() => router.push("/biking")}
      glow
    />
  );
};

export const Plant: React.FC<> = () => (
  <RoomItem
    src="/plant.svg"
    className="relative w-[200px] h-[320px] xs:w-[250px] xs:h-[400px] ml-[450px] xs:ml-[625px]"
    imageClass="drop-shadow-[16px_16px_16px_rgba(0,0,0,0.6)]"
  />
);

export const Couch: React.FC<> = () => (
  <RoomItem
    src="/couch.svg"
    className="relative w-[400px] h-[160px] xs:w-[500px] xs:h-[200px]"
    imageClass="drop-shadow-[24px_24px_20px_rgba(0,0,0,0.8)]"
  />
);

export const Table: React.FC<> = () => (
  <RoomItem
    src="/table.svg"
    className="relative w-[150px] h-[160px] xs:w-[180px] xs:h-[200px] mr-[200px] xs:mr-[300px] md:mr-[620px]"
    imageClass="drop-shadow-[8px_8px_8px_rgba(0,0,0,0.2)]"
  />
);

export const Paper: React.FC<> = () => {
  return (
    <RoomItem
      src="/paper.svg"
      className="absolute top-12 xs:top-[3.75rem] left-16 xs:left-20 w-[50px] h-[25px] xs:w-[60px] xs:h-[30px]"
      onClick={() => {
        // TODO(Kim): Implement introduction action
      }}
      glow
    />
  );
};
