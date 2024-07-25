import { Button, Stack, Typography } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerDetailHeader } from "./components/PlayerDetailHeader";
import { PlayerSeasonStats } from "./components/PlayerSeasonStats";
import { PageContainer } from "../../shared-components/PageContainer";
import { GameLog } from "./components/GameLog";
import { fetchPlayerById, getGamesForPlayer } from "../../backend/getters";
import { Game, Player } from "../../types";
import { Link } from "react-router-dom";
import { mockScoringMatrix } from "../../backend/fixtures";
import { getFantasyScoreForPlayerSeason } from "../../utils/statsUtils";
import { GameFantasyDetailDialog } from "./components/GameFantasyDetailDialog";

interface PlayerParams extends Record<string, string | undefined> {
  id: string;
}

export const PlayerDetailPage: FC = () => {
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

  if (!player) {
    return (
      <PageContainer loading={loading}>
        <Stack
          direction="column"
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="overline">Player not found</Typography>
          <Button variant="contained" to="/" component={Link}>
            Back to home
          </Button>
        </Stack>
      </PageContainer>
    );
  }
  return (
    <PageContainer loading={loading}>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        <PlayerDetailHeader player={player} playerGames={playerGames} />
        <Stack sx={{ p: 1, pt: 2 }} spacing={2}>
          <PlayerSeasonStats player={player} games={playerGames} />
          <GameLog player={player} games={playerGames} />
        </Stack>
      </Stack>
    </PageContainer>
  );
};
