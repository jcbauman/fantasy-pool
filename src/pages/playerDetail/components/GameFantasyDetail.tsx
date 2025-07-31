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
  Link,
  IconButton,
} from "@mui/material";
import { FC, useState } from "react";
import { GameStatKeys, GameStat, Game, Player } from "../../../types";
import {
  getFantasyMultiplierForStat,
  getStringFromStatKey,
  normalizeStat,
  getFantasyScoreForPlayerSeason,
} from "../../../utils/statsUtils";
import {
  formatDateToMMDD,
  formatDateToTimeOfDay,
  formatMinutesToMSS,
} from "../../../utils/dateUtils";
import {
  getIsGamePartnership,
  getOtherGamePlayer,
} from "../../../utils/gameUtils";
import { useAppContext } from "../../../context/AppContext";
import { NavigateNext } from "@mui/icons-material";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";

export const GameFantasyDetail: FC<{
  game: Game | undefined;
  player: Player | undefined;
  scoringMatrix: Record<string, number>;
  includeElapsedTime?: boolean;
}> = ({ game, player, scoringMatrix, includeElapsedTime }) => {
  const { players } = useAppContext();
  const [playerToView, setPlayerToView] = useState(player);
  if (!game || !playerToView) return <></>;
  const playerStats = game.statsByPlayer.find(
    (s) => s.playerId === playerToView.id
  );
  if (!playerStats) return <></>;
  const timeOfDay = formatDateToTimeOfDay(new Date(game.timestamp));
  const caption = `${formatDateToMMDD(new Date(game.timestamp))} at ${
    game.location ?? "?"
  } - ${timeOfDay}`;
  const elapsedTime = game.endedAt
    ? `
        ${formatMinutesToMSS(
          (new Date(game.endedAt).getTime() -
            new Date(game.timestamp).getTime()) /
            60000
        )}`
    : undefined;
  const isGamePartnership = getIsGamePartnership(game);
  const otherGamePlayer = getOtherGamePlayer(game, playerToView?.id, players);
  const partnershipCaption =
    isGamePartnership !== undefined
      ? `${isGamePartnership ? "w/" : "vs."} ${otherGamePlayer?.name}`
      : undefined;
  return (
    <Stack direction="column" sx={{ alignItems: "center" }}>
      <Stack
        direction="column"
        sx={{ alignItems: "center", py: 2 }}
        spacing={1}
      >
        <Avatar src={playerToView.profilePictureUrl} alt={playerToView.name} />
        <Typography>{playerToView.name}</Typography>
        <Typography variant="caption">{caption}</Typography>
        {partnershipCaption && (
          <Link
            sx={{
              color: "white",
              ml: 1,
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => {
              setPlayerToView(otherGamePlayer);
              fireAnalyticsEvent("FantasyDetail_Clicked_SwitchPlayer");
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <Typography
                variant="caption"
                sx={{ fontStyle: "italic", textDecoration: "underline" }}
              >
                {partnershipCaption}
              </Typography>
              <IconButton aria-label="switch players" size="small">
                <NavigateNext />
              </IconButton>
            </Stack>
          </Link>
        )}
        {elapsedTime && includeElapsedTime && (
          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
            Elapsed time: {elapsedTime}
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
                    playerToView.id,
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
