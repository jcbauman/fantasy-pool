import { FC } from "react";
import { GameStat, GameStatKeys, Player } from "../../../types";
import {
  Card,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useAppContext } from "../../../context/AppContext";
import {
  getFantasyScoreForStat,
  normalizePercentage,
} from "../../../utils/statsUtils";

export const PlayerSeasonStats: FC<{ player: Player }> = ({ player }) => {
  const { allStatsByPlayers, scoringMatrix } = useAppContext();
  const stats = allStatsByPlayers[player.id];
  const fantasyPoints = getFantasyScoreForStat(
    stats as Omit<GameStat, "playerId">,
    scoringMatrix
  );
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
                    {GameStatKeys.winsBy8BallSink}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.winsByOpponentScratch}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.lossesBy8BallSink}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.lossesByScratch}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    W%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.incredibleShots}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.threeBallsPocketedInRow}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.fourBallsPocketedInRow}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.fiveBallsPocketedInRow}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.sixBallsPocketedInRow}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.sevenBallsPocketedInRow}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.runTheTable}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    {GameStatKeys.georgeWashingtons}
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
                <TableCell>
                  {stats[GameStatKeys.incredibleShots] ?? 0}
                </TableCell>
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
                <TableCell>
                  {stats[GameStatKeys.georgeWashingtons] ?? 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Card>
  );
};
