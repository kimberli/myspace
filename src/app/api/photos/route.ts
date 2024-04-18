import { NextResponse } from "next/server";

import PHOTO_DATA from "@/lib/photos.json";

import type { ErrorMessage } from "@/app/api/types";

export type PhotoData = {
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

const RESPONSE_DATA: PhotoData = Object.fromEntries(
  Object.entries(PHOTO_DATA).map(([key, value]) => [
    key,
    { blur: value.blur, label: value.label, description: value.description },
  ]),
);

// TODO(Kim): Paginate this since it's reading a 3 MB file, maybe with swc/infinite?
export function GET(): NextResponse<PhotoData | ErrorMessage> {
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
): NextResponse<GuessResult | ErrorMessage> {
  try {
    const { photoId, guessLatitude, guessLongitude } = await req.json();
    if (!PHOTO_DATA.hasOwnProperty(photoId)) {
      return NextResponse.json(
        { message: "Cannot find image ID" },
        { status: 400 },
      );
    }
    const correctLatitude = PHOTO_DATA[photoId].lat;
    const correctLongitude = PHOTO_DATA[photoId].lng;
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
