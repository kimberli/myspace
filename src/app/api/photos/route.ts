import { NextResponse } from "next/server";

import PHOTO_DATA from "src/lib/photos.json";

export async function GET(): NextResponse {
  try {
    // Return all keys as an array
    const keys = Object.keys(PHOTO_DATA);

    return NextResponse.json(keys);
  } catch (error) {
    console.error(error);
    // Handle errors appropriately (e.g., return a 500 status code)
    return NextResponse.json(
      { message: "Error reading data file" },
      { status: 500 },
    );
  }
}
