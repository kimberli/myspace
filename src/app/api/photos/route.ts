import { NextRequest, NextResponse } from "next/server";

import PHOTO_DATA from "@/lib/photos.json";

import type { ErrorMessage } from "@/app/api/types";

type RawPhotoData = {
  [key: string]: {
    lat: number;
    lng: number;
    blur: string;
    label: string;
    description: string;
  };
};

export type ResponsePhotoData = {
  [key: string]: {
    blur: string;
    label: string;
    description: string;
  };
};

export type GuessResult = {
  correctLatitude: number;
  correctLongitude: number;
  score: number;
};

const TYPED_PHOTO_DATA = PHOTO_DATA as RawPhotoData;

const RESPONSE_DATA: ResponsePhotoData = Object.fromEntries(
  Object.entries(TYPED_PHOTO_DATA).map(([key, value]) => [
    key,
    { blur: value.blur, label: value.label, description: value.description },
  ]),
);

// TODO(Kim): Paginate this since it's reading a 3 MB file, maybe with swc/infinite?
export function GET(): NextResponse<ResponsePhotoData | ErrorMessage> {
  try {
    return NextResponse.json(RESPONSE_DATA);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error reading data file" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<GuessResult | ErrorMessage>> {
  try {
    const { photoId, guessLatitude, guessLongitude } = await req.json();
    if (!TYPED_PHOTO_DATA.hasOwnProperty(photoId)) {
      return NextResponse.json(
        { message: "Cannot find image ID" },
        { status: 400 },
      );
    }
    const correctLatitude = TYPED_PHOTO_DATA[photoId].lat as number;
    const correctLongitude = TYPED_PHOTO_DATA[photoId].lng as number;
    // TODO(Kim): Replace this with a real distance calculation.
    const score = Math.sqrt(
      (guessLatitude - correctLatitude) ** 2 +
        (guessLongitude - correctLongitude) ** 2,
    );
    const guessResult = {
      correctLatitude,
      correctLongitude,
      score,
    };
    return NextResponse.json(guessResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error reading data file" },
      { status: 500 },
    );
  }
}
