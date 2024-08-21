import { Game } from "../types";

export const sortGamesByDate = (games: Game[]): Game[] => {
  return games.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
};

export const isMoreThanTwoHoursAgo = (timestamp: string): boolean => {
  const now = new Date().getTime(); // Current time in milliseconds
  const timestampInMillis = new Date(timestamp).getTime(); // Convert Firestore Timestamp to JavaScript Date and then to milliseconds
  const twoHoursInMillis = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  return now - timestampInMillis > twoHoursInMillis;
};
