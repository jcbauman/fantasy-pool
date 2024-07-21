import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { getStatsForPlayerGames } from "../pages/playersList/utils/playerUtils";
import { Game, Player } from "../types";

export const normalizePercentage = (value: number): string => {
  const per = Number.isNaN(value) ? 0 : (value * 100).toFixed(1);
  return per + "%";
};

export const normalizeStat = (value: number): string => {
  const per = Number.isNaN(value) ? 0 : value.toFixed(1);
  return per.toString();
};

export const getAbbreviation = (input?: string): string => {
  if (!input) return "?";
  if (!input.trim()) return "?";
  const words = input.trim().split(/\s+/);
  const abbreviation = words.map((word) => word[0].toUpperCase()).join("");
  if (abbreviation.length >= 3) {
    return abbreviation.substring(0, 3);
  }
  return abbreviation.padEnd(3, abbreviation[abbreviation.length - 1]);
};

export const formatDateToMMDD = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}/${day}`;
};
