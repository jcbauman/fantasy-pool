import { FC } from "react";
import { Player } from "../../../types";
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
import { mockGame } from "../../../backend/fixtures";
import { formatDateToMMDD, getAbbreviation } from "../../../utils/statsUtils";

export const GameLog: FC<{ player: Player }> = ({ player }) => {
  const games = getPlayedGamesForPlayer(player.id, [mockGame]);
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
                      W8
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      WS
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      L8
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      LS
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      IS
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      MPR
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      GW
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      FP
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
                      <TableCell>{stats.winsBy8BallSink}</TableCell>
                      <TableCell>{stats.winsByOpponentScratch}</TableCell>
                      <TableCell>{stats.lossesBy8BallSink}</TableCell>
                      <TableCell>{stats.lossesByScratch}</TableCell>
                      <TableCell>{stats.incredibleShots}</TableCell>
                      <TableCell>{stats.ballsPocketedInRow}</TableCell>
                      <TableCell>{stats.georgeWashingtons}</TableCell>
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
