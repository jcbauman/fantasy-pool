import { useEffect, useState } from "react";
import { Player } from "../../../types";
import { mockPlayers } from "../../../backend/fixtures";
import { useAuthState } from "../../../auth/useAuthState";

interface GameStartForm {
  allPlayers: Player[];
  player: Player | null;
}

export const useGameStartForm = (): GameStartForm => {
  const { player } = useAuthState();
  const allPlayers = mockPlayers;

  return { allPlayers, player };
};
