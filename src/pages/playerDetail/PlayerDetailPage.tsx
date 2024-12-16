import { Button, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { PlayerDetailHeader } from "./components/PlayerDetailHeader";
import { PlayerSeasonStats } from "./components/PlayerSeasonStats";
import { PageContainer } from "../../shared-components/PageContainer";
import { GameLog } from "./components/GameLog";
import { Link } from "react-router-dom";
import { usePlayerParams } from "../../shared-components/hooks/usePlayerParam";

export const PlayerDetailPage: FC = () => {
  const { player, loading, playerGames } = usePlayerParams();

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
