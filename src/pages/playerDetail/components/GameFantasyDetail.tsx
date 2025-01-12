import {
  Stack,
  Avatar,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FC } from "react";
import { GameStatKeys, GameStat, Game, Player } from "../../../types";
import {
  getFantasyMultiplierForStat,
  getStringFromStatKey,
  normalizeStat,
  getFantasyScoreForPlayerSeason,
  formatDateToMMDD,
} from "../../../utils/statsUtils";
import { formatMinutesToMSS } from "../../../utils/gameUtils";

export const GameFantasyDetail: FC<{
  game: Game | undefined;
  player: Player | undefined;
  scoringMatrix: Record<string, number>;
  includeElapsedTime?: boolean;
}> = ({ game, player, scoringMatrix, includeElapsedTime }) => {
  if (!game || !player) return <></>;
  const playerStats = game.statsByPlayer.find((s) => s.playerId === player.id);
  if (!playerStats) return <></>;
  const caption = `${formatDateToMMDD(new Date(game.timestamp))} at ${
    game.location ?? "?"
  }`;
  console.log(game);
  const elapsedTime = game.endedAt
    ? `
        ${formatMinutesToMSS(
          (new Date(game.endedAt).getTime() -
            new Date(game.timestamp).getTime()) /
            60000
        )}`
    : undefined;

  return (
    <Stack direction="column" sx={{ alignItems: "center" }}>
      <Stack
        direction="column"
        sx={{ alignItems: "center", py: 2 }}
        spacing={1}
      >
        <Avatar src={player.profilePictureUrl} alt={player.name} />
        <Typography>{player.name}</Typography>
        <Typography variant="caption">{caption}</Typography>
        {elapsedTime && includeElapsedTime && (
          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
            Elasped time: {elapsedTime}
          </Typography>
        )}
      </Stack>
      <TableContainer
        component={Paper}
        style={{ overflowX: "auto", width: "100%" }}
      >
        <Table size="small" sx={{ borderColor: "white" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="overline" noWrap>
                  Scoring category
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  per
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  #
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  Score
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(GameStatKeys).map((key, idx) => {
              const pointsPer = getFantasyMultiplierForStat(key, scoringMatrix);
              if (playerStats[key as keyof GameStat] ?? 0) {
                return (
                  <TableRow
                    key={`${key}-scoring-row-${idx}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      borderColor: "white",
                    }}
                  >
                    <TableCell>{getStringFromStatKey(key)}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="body2">{pointsPer}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="body2">
                        {playerStats[key as keyof GameStat] ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography
                        variant="body2"
                        color={pointsPer >= 0 ? "inherit" : "error"}
                      >
                        {normalizeStat(
                          pointsPer *
                            (playerStats[
                              key as unknown as keyof Omit<GameStat, "playerId">
                            ] ?? 0)
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              } else {
                return <></>;
              }
            })}
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="overline">Total</Typography>
              </TableCell>
              <TableCell align="right">
                {normalizeStat(
                  getFantasyScoreForPlayerSeason(
                    [game],
                    player.id,
                    scoringMatrix
                  )
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
