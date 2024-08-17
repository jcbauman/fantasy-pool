import { Game } from "../../../types";
import { sortGamesByDate } from "../../../utils/gameUtils";

export const getStartOfWeek = (date: Date): Date => {
  const givenDate = new Date(date); // Create a copy to avoid mutating the original date
  const day = givenDate.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
  const diff = day === 0 ? -6 : 1 - day; // If Sunday (0), go back 6 days, otherwise go back to Monday
  givenDate.setDate(givenDate.getDate() + diff); // Set the date to the Monday of the same week
  givenDate.setHours(0, 0, 0, 0); // Reset the time to midnight for consistency
  return givenDate;
};

interface GamesByWeek {
  [weekStart: string]: Game[];
}

export const bucketGamesByWeek = (games: Game[]): GamesByWeek => {
  const dateSortedGames = sortGamesByDate(games);
  const bucketedGames = dateSortedGames.reduce(
    (acc: GamesByWeek, game: Game) => {
      const startOfWeek = getStartOfWeek(new Date(game.timestamp));
      const weekKey = startOfWeek.toISOString();
      if (!acc[weekKey]) {
        acc[weekKey] = [];
      }
      acc[weekKey].push(game);

      return acc;
    },
    {}
  );
  return bucketedGames;
};
