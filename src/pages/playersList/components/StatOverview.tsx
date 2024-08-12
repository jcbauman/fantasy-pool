import { FC, useMemo, useState } from "react";
import { Game, GameStatKeys, Player } from "../../../types";
import { Divider, Stack, Typography } from "@mui/material";
import { useAppContext } from "../../../context/AppContext";
import {
  getFantasyScoreForPlayerSeason,
  normalizePercentage,
  normalizeStat,
} from "../../../utils/statsUtils";

export const StatOverview: FC<{ player: Player; playerGames: Game[] }> = ({
  player,
  playerGames,
}) => {
  const { rankings, allStatsByPlayers, scoringMatrix } = useAppContext();
  const fantasyScore = useMemo(() => {
    return getFantasyScoreForPlayerSeason(
      playerGames,
      player?.id,
      scoringMatrix
    );
  }, [playerGames, player?.id, scoringMatrix]);
  const totalWinRank =
    (rankings["totalWins"].findIndex((id) => id === player.id) ?? 0) + 1;
  const totalGamesRank =
    (rankings["totalGames"].findIndex((id) => id === player.id) ?? 0) + 1;
  const totalGames = allStatsByPlayers[player.id]?.totalGames ?? 0;
  const totalWins = allStatsByPlayers[player.id]?.totalWins ?? 0;
  const winPercentage = totalGames
    ? normalizePercentage(totalWins / totalGames)
    : "0%";
  const fantasyGameAvg = normalizeStat(fantasyScore / (totalGames || 1));
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
      </Stack>
    </Stack>
  );
};
