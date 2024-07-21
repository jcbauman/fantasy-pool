import { FC } from "react";
import { GameStatKeys, Player } from "../../../types";
import { Divider, Stack, Typography } from "@mui/material";
import { useAppContext } from "../../../context/AppContext";
import { normalizePercentage } from "../../../utils/statsUtils";

export const StatOverview: FC<{ player: Player }> = ({ player }) => {
  const { rankings, allStatsByPlayers } = useAppContext();
  const totalWinRank =
    (rankings["totalWins"].findIndex((id) => id === player.id) ?? 0) + 1;
  const totalGamesRank =
    (rankings["totalGames"].findIndex((id) => id === player.id) ?? 0) + 1;
  console.log(allStatsByPlayers);
  const totalGames = allStatsByPlayers[player.id]?.totalGames ?? 0;
  const totalWins = allStatsByPlayers[player.id]?.totalWins ?? 0;
  const winPercentage = totalGames
    ? normalizePercentage(totalWins / totalGames)
    : "0%";
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", width: "100%" }}
    >
      <Divider />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          Wins rank
        </Typography>
        <Typography variant="body1">{totalWinRank}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          # Games rank
        </Typography>
        <Typography variant="body1">{totalGamesRank}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          # games
        </Typography>
        <Typography variant="body1">{totalGames}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          Win%
        </Typography>
        <Typography variant="body1">{winPercentage}</Typography>
      </Stack>
    </Stack>
  );
};
