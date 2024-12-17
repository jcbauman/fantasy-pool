import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerById, fetchGamesForPlayer } from "../../backend/getters";
import { Game, Player } from "../../types";

interface PlayerParams extends Record<string, string | undefined> {
  id: string;
}

interface UsePlayerParams {
  player: Player | undefined;
  playerGames: Game[];
  loading: boolean;
}

export const usePlayerParams = (): UsePlayerParams => {
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [playerGames, setPlayerGames] = useState<Game[]>([]);

  const [loading, setLoading] = useState(false);
  const { id } = useParams<PlayerParams>();

  useEffect(() => {
    const fetchPlayerData = async (id: string) => {
      setLoading(true);
      const thisPlayer = await fetchPlayerById(id);
      const thisPlayerGames = await fetchGamesForPlayer(
        id,
        new Date("2024-05-05")
      );
      setPlayer(thisPlayer);
      setPlayerGames(thisPlayerGames || []);
      setLoading(false);
    };
    if (id) {
      fetchPlayerData(id);
    }
  }, [id]);

  return { player, playerGames, loading };
};
