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

export enum ScoreQuality {
  UNDEFINED,
  POOR,
  OK,
  GOOD,
  GREAT,
}

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
  scoreQuality: ScoreQuality;
};

const EARTH_RADIUS_KM = 6371;
const TYPED_PHOTO_DATA = PHOTO_DATA as RawPhotoData;

const RESPONSE_DATA: ResponsePhotoData = Object.fromEntries(
  Object.entries(TYPED_PHOTO_DATA).map(([key, value]) => [
    key,
    { blur: value.blur, label: value.label, description: value.description },
  ]),
);

const toRadians = (angle: number): number => {
  return (angle * Math.PI) / 180;
};

const calculateDistance = (
  guessLatitude: number,
  guessLongitude: number,
  correctLatitude: number,
  correctLongitude: number,
): number => {
  // Estimate the distance between the two points using the Haversine formula.
  const guessLatRad = toRadians(guessLatitude);
  const guessLonRad = toRadians(guessLongitude);
  const correctLatRad = toRadians(correctLatitude);
  const correctLonRad = toRadians(correctLongitude);

  const dLat = guessLatRad - correctLatRad;
  const dLon = guessLonRad - correctLonRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(correctLatRad) *
      Math.cos(guessLatRad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

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
    const score = calculateDistance(
      guessLatitude,
      guessLongitude,
      correctLatitude,
      correctLongitude,
    );
    let scoreQuality;
    if (score < 50) {
      scoreQuality = ScoreQuality.GREAT;
    } else if (score < 1000) {
      scoreQuality = ScoreQuality.GOOD;
    } else if (score < 5000) {
      scoreQuality = ScoreQuality.OK;
    } else {
      scoreQuality = ScoreQuality.POOR;
    }
    const guessResult = {
      correctLatitude,
      correctLongitude,
      score,
      scoreQuality,
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
