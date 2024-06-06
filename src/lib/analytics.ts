import { sendGTMEvent } from "@next/third-parties/google";

export const ANALYTICS_MEASUREMENT_ID = "G-GT6NFS8BH3";
export const TAG_MANAGER_ID = "GTM-WN92TN8N";

export enum AnalyticsEvent {
  BUTTON_CLICKED = "Button Clicked",
  ITEM_CLICKED = "Item Clicked",
  GUESSED_PHOTO = "Guessed Photo",
  GAME_OVER = "Game Over",
}

export enum AnalyticsVariable {
  BUTTON_CLICKED = "buttonClicked",
  ITEM_CLICKED = "itemClicked",
  FINAL_SCORE = "finalScore",
  GUESS_PHOTO = "guessPhoto",
  GUESS_SCORE = "guessScore",
  NUMBER_GUESSES = "numberGuesses",
  USER_ID = "userID",
}

export const trackEvent = (
  eventName: string,
  variables?: Record<string, string | number>,
): void => {
  console.log("sending tracking event", eventName, variables);
  sendGTMEvent({
    event: eventName,
    ...variables,
  });
};
