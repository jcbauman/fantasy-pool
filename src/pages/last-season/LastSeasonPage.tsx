import { Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { getPlayerGamesForLastSeason } from "../../backend/getters";
import { Game } from "../../types";
import { RankingTable } from "./components/RankingTable";
import { YourPosition } from "./components/YourPosition";
import { TopLocation } from "./components/TopLocation";
import { PlayerSeasonStats } from "../playerDetail/components/PlayerSeasonStats";
import { usePlayerParams } from "../../shared-components/hooks/usePlayerParam";
import { canSeeLastSeason } from "../../utils/gameUtils";
import { useConfetti } from "../../shared-components/hooks/useConfetti";
import { ScratchKing } from "./components/ScratchKing";

export const LastSeasonPage: FC = () => {
  const { player, loading: loadingPlayer } = usePlayerParams(true);
  const { records } = useAppContext();
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const { confettiComponent, launchConfetti } = useConfetti();
  useEffect(() => {
    const fetchPlayerData = async (id: string) => {
      setLoadingGames(true);
      const thisPlayerGames = await getPlayerGamesForLastSeason(id);
      setPlayerGames(thisPlayerGames || []);
      setLoadingGames(false);
    };
    if (player?.id) {
      fetchPlayerData(player?.id);
    }
  }, [player]);
  const showLastSeasonTab = canSeeLastSeason(records, player?.id);
  const playerPlaced = player?.id && records && records?.[player?.id]?.rank < 4;
  useEffect(() => {
    if (playerPlaced) launchConfetti();
  }, [launchConfetti, playerPlaced]);
  return (
    <PageContainer loading={loadingGames || loadingPlayer} authedRoute>
      {showLastSeasonTab ? (
        <Stack
          direction="column"
          sx={{ width: "100%", height: "100%", p: 1, overflowY: "auto" }}
          spacing={2}
        >
          {playerPlaced && confettiComponent()}
          <YourPosition player={player} />
          {player && <PlayerSeasonStats games={playerGames} player={player} />}
          <RankingTable />
          <TopLocation games={playerGames} player={player} />
          <ScratchKing />
        </Stack>
      ) : (
        <Stack
          sx={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>No games to show from last season</Typography>
        </Stack>
      )}
    </PageContainer>
  );
};
