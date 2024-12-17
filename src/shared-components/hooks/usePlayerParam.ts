import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlayerById } from "../../backend/fetchers/players";
import { Game, Player } from "../../types";
import { getGamesForPlayer } from "../../backend/fetchers/games";

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
      const thisPlayerGames = await getGamesForPlayer(id);
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
