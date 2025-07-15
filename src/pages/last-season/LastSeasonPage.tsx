import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { getPlayerGamesForLastSeason } from "../../backend/getters";
import { Game } from "../../types";
import { RankingTable } from "./components/RankingTable";
import { YourPosition } from "./components/YourPosition";
import { TopLocation } from "./components/TopLocation";

import { PlayerSeasonStats } from "../playerDetail/components/PlayerSeasonStats";

export const LastSeasonPage: FC = () => {
  const {
    authState: { player },
  } = useAppContext();

  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPlayerData = async (id: string) => {
      setLoading(true);
      const thisPlayerGames = await getPlayerGamesForLastSeason(id);
      setPlayerGames(thisPlayerGames || []);
      setLoading(false);
    };
    if (player?.id) {
      fetchPlayerData(player?.id);
    }
  }, [player]);

  return (
    <PageContainer loading={loading}>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1, overflowY: "auto" }}
        spacing={2}
      >
        <YourPosition />
        {player && <PlayerSeasonStats games={playerGames} player={player} />}
        <RankingTable />
        <TopLocation games={playerGames} />
      </Stack>
    </PageContainer>
  );
};
