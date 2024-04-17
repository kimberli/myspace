import { NextResponse } from "next/server";

import PHOTO_DATA from "@/lib/photos.json";

import type { ErrorMessage } from "@/app/api/types";

export type PhotoData = {
  [key: string]: {
    blur: string;
  };
};

const RESPONSE_DATA: PhotoData = Object.fromEntries(
  Object.entries(PHOTO_DATA).map(([key, value]) => [key, { blur: value.blur }]),
);

// TODO(Kim): Paginate this since it's reading a 3 MB file, maybe with swc/infinite?
export function GET(): NextResponse<PhotoData | ErrorMessage> {
  try {
    return NextResponse.json(RESPONSE_DATA);
  } catch (error) {
    console.error(error);
    // Handle errors appropriately (e.g., return a 500 status code)
    return NextResponse.json(
      { message: "Error reading data file" },
      { status: 500 },
    );
  }
}
