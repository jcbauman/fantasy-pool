import { FC } from "react";
import { Game } from "../../../types";
import { Divider, Stack, Typography } from "@mui/material";

export const LocationStatOverview: FC<{
  games: Game[];
}> = ({ games }) => {
  //   const totalWinRank =
  //     (rankings["totalWins"].findIndex((id) => id === player.id) ?? 0) + 1;
  //   const totalGames = allStatsByPlayers[player.id]?.totalGames ?? 0;
  //   const totalWins = allStatsByPlayers[player.id]?.totalWins ?? 0;
  //   const winPercentage = totalGames
  //     ? normalizePercentage(totalWins / totalGames)
  //     : "0%";
  //   const fantasyGameAvg = normalizeStat(fantasyScore / (totalGames || 1));
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", width: "100%" }}
    >
      <Divider />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          Season games
        </Typography>
        <Typography variant="body1">{games.length}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      {/* <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          Win%
        </Typography>
        <Typography variant="body1">{winPercentage}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          FTSY Avg
        </Typography>
        <Typography variant="body1">{fantasyGameAvg}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          FTSY tot
        </Typography>
        <Typography variant="body1">{normalizeStat(fantasyScore)}</Typography>
      </Stack> */}
    </Stack>
  );
};
