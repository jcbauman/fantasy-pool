import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchLocationById,
  getGamesForLocationAfterDate,
} from "../../backend/getters";
import { Game, PoolHallLocation } from "../../types";

interface LocationParams extends Record<string, string | undefined> {
  id: string;
}

interface UseLocationParams {
  location: PoolHallLocation | undefined;
  locationGames: Game[];
  loading: boolean;
}

export const useLocationParams = (): UseLocationParams => {
  const [location, setLocation] = useState<PoolHallLocation | undefined>(
    undefined
  );
  const [locationGames, setLocationGames] = useState<Game[]>([]);

  const [loading, setLoading] = useState(false);
  const { id } = useParams<LocationParams>();

  useEffect(() => {
    const fetchPlayerData = async (id: string) => {
      setLoading(true);
      const thisLocation = await fetchLocationById(id);
      const thisLocationGames = await getGamesForLocationAfterDate(
        thisLocation?.name ?? ""
      );
      setLocation(thisLocation);
      setLocationGames(thisLocationGames || []);
      setLoading(false);
    };
    if (id) {
      fetchPlayerData(id);
    }
  }, [id]);

  return { location, locationGames, loading };
};
