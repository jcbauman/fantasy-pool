import { FC } from "react";
import { Game } from "../../../types";
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
import { formatDateToMMDD, getAbbreviation } from "../../../utils/statsUtils";
import { sortGamesByDate } from "../../../utils/gameUtils";
import { useAppContext } from "../../../context/AppContext";

export const LocationGameLog: FC<{ games: Game[] }> = ({ games }) => {
  const dateSortedGames = sortGamesByDate(games);

  return (
    <Card>
      <Stack direction="column" sx={{ p: 0, pb: 1 }}>
        <Stack direction="column" sx={{ p: 2 }}>
          <Typography>Game Log</Typography>
        </Stack>
        {games.length > 0 ? (
          <TableContainer component={Paper} style={{ overflowX: "auto" }}>
            <Table size="small" sx={{ borderColor: "white" }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      Loc
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      Pts
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
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
                      {GameStatKeysAbbrev[GameStatKeys.scratches]}
                    </Typography>
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {dateSortedGames.map((g, idx) => {
                  return (
                    <TableRow
                      key={g.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        borderColor: "white",
                        backgroundColor: idx % 2 === 0 ? "#404040" : "inherit",
                      }}
                    >
                      <TableCell>
                        {formatDateToMMDD(new Date(g.timestamp))}
                      </TableCell>
                      <TableCell>{getAbbreviation(g.location)}</TableCell>
                      {/* <TableCell
                        onClick={() => setDetailModalGame(g)}
                        sx={{
                          color: "lightblue",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {normalizeStat(fantasyPoints)}
                      </TableCell>
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
                        {stats[GameStatKeys.skillShots] ?? 0}
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
                      <TableCell>
                        {stats[GameStatKeys.runTheTable] ?? 0}
                      </TableCell>
                      <TableCell>
                        {stats[GameStatKeys.scratches] ?? 0}
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack sx={{ py: 2, alignItems: "center", justifyContent: "center" }}>
            <Typography variant="caption">No games to show</Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
