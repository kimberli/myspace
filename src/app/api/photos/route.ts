import { NextResponse } from "next/server";

import PHOTO_DATA from "src/lib/photos.json";

const RESPONSE_DATA = Object.fromEntries(
  Object.entries(PHOTO_DATA).map(([key, value]) => [key, { blur: value.blur }]),
);

export async function GET(): NextResponse {
  try {
    // Return all keys as an array

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
