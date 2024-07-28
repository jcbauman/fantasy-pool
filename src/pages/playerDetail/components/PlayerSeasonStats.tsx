import { FC } from "react";
import {
  Game,
  GameStat,
  GameStatKeys,
  GameStatKeysAbbrev,
  Player,
} from "../../../types";
import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { normalizePercentage } from "../../../utils/statsUtils";
import { getStatsForPlayerGames } from "../../playersList/utils/playerUtils";

export const PlayerSeasonStats: FC<{ player: Player; games: Game[] }> = ({
  player,
  games,
}) => {
  const stats = getStatsForPlayerGames(player.id, games);
  console.log(new Date().toString());
  return (
    <Card>
      <Stack direction="column">
        <Stack direction="column" sx={{ p: 2 }}>
          <Typography>Season Stats</Typography>
        </Stack>
        <TableContainer style={{ overflowX: "auto" }}>
          <Table size="small" sx={{ borderColor: "white" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    W
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.winsBy8BallSink]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.winsByOpponentScratch]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.lossesBy8BallSink]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.lossesByScratch]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    W%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.skillShots]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.threeBallsPocketedInRow]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.fourBallsPocketedInRow]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.fiveBallsPocketedInRow]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.sixBallsPocketedInRow]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.sevenBallsPocketedInRow]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.runTheTable]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeysAbbrev[GameStatKeys.cueHauler]}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderColor: "white",
                }}
              >
                <TableCell>{stats["totalWins"] ?? 0}</TableCell>
                <TableCell>
                  {stats[GameStatKeys.winsBy8BallSink] ?? 0}
                </TableCell>
                <TableCell>
                  {stats[GameStatKeys.winsByOpponentScratch] ?? 0}
                </TableCell>
                <TableCell>
                  {stats[GameStatKeys.lossesBy8BallSink] ?? 0}
                </TableCell>
                <TableCell>
                  {stats[GameStatKeys.lossesByScratch] ?? 0}
                </TableCell>
                <TableCell>
                  {normalizePercentage(
                    stats["totalWins"] / stats["totalGames"] ?? 0
                  )}
                </TableCell>
                <TableCell>{stats[GameStatKeys.skillShots] ?? 0}</TableCell>
                <TableCell>
                  {stats[GameStatKeys.threeBallsPocketedInRow] ?? 0}
                </TableCell>
                <TableCell>
                  {stats[GameStatKeys.fourBallsPocketedInRow] ?? 0}
                </TableCell>
                <TableCell>
                  {stats[GameStatKeys.fiveBallsPocketedInRow] ?? 0}
                </TableCell>
                <TableCell>
                  {stats[GameStatKeys.sixBallsPocketedInRow] ?? 0}
                </TableCell>
                <TableCell>
                  {stats[GameStatKeys.sevenBallsPocketedInRow] ?? 0}
                </TableCell>
                <TableCell>{stats[GameStatKeys.runTheTable] ?? 0}</TableCell>
                <TableCell>{stats[GameStatKeys.cueHauler] ?? 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Card>
  );
};
