import { Game, Session } from "../types";

export const sortGamesByDate = (games: Game[]): Game[] => {
  return games.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
};

export const sortSessionsByDate = (sessions: Session[]): Session[] => {
  return sessions.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
};
