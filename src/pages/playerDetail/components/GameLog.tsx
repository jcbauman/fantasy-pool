import { FC } from "react";
import { GameStatKeys, Player } from "../../../types";
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
import {
  getPlayedGamesForPlayer,
  getStatsForGame,
} from "../../playersList/utils/playerUtils";
import { formatDateToMMDD, getAbbreviation } from "../../../utils/statsUtils";
import { useAppContext } from "../../../context/AppContext";

export const GameLog: FC<{ player: Player }> = ({ player }) => {
  const { games: allGames } = useAppContext();
  const games = getPlayedGamesForPlayer(player.id, allGames);
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
                      {GameStatKeys.incredibleShots}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      {GameStatKeys.ballsPocketedInRow}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      {GameStatKeys.georgeWashingtons}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      {0}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((g) => {
                  const stats = getStatsForGame(player.id, g);
                  return (
                    <TableRow
                      key={g.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        borderColor: "white",
                      }}
                    >
                      <TableCell>
                        {formatDateToMMDD(new Date(g.timestamp))}
                      </TableCell>
                      <TableCell>{getAbbreviation(g.location)}</TableCell>
                      <TableCell>
                        {stats[GameStatKeys.winsBy8BallSink]}
                      </TableCell>
                      <TableCell>
                        {stats[GameStatKeys.winsByOpponentScratch]}
                      </TableCell>
                      <TableCell>
                        {stats[GameStatKeys.lossesBy8BallSink]}
                      </TableCell>
                      <TableCell>
                        {stats[GameStatKeys.lossesByScratch]}
                      </TableCell>
                      <TableCell>
                        {stats[GameStatKeys.incredibleShots]}
                      </TableCell>
                      <TableCell>
                        {stats[GameStatKeys.ballsPocketedInRow]}
                      </TableCell>
                      <TableCell>
                        {stats[GameStatKeys.georgeWashingtons]}
                      </TableCell>
                      <TableCell>{0}</TableCell>
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
