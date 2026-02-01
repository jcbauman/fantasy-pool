import { FC, useState } from "react";
import { Game, GameStatKeys, GameStatKeysAbbrev, Player } from "../../../types";
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
import { getStatsForGame } from "../../players/utils/playerUtils";
import {
  getAbbreviation,
  getFantasyScoreForPlayerSeason,
  normalizeStat,
} from "../../../utils/statsUtils";
import { GameFantasyDetailDialog } from "./GameFantasyDetailDialog";
import { sortGamesByDate } from "../../../utils/gameUtils";
import { useAppContext } from "../../../context/AppContext";
import { formatDateToMMDD } from "../../../utils/dateUtils";
import { fetchLocationByName } from "../../../backend/endpoints/locations";
import { useNavigate } from "react-router-dom";

export const GameLog: FC<{ player: Player; games: Game[] }> = ({
  player,
  games,
}) => {
  const { scoringMatrix } = useAppContext();
  const [detailModalGame, setDetailModalGame] = useState<Game | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const dateSortedGames = sortGamesByDate(games);

  const viewLocation = async (locationName: string | undefined) => {
    if (!locationName) return;
    const loc = await fetchLocationByName(locationName);
    if (loc) {
      navigate(`/locations/${loc.id}`);
    }
  };

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
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dateSortedGames.map((g, idx) => {
                  const stats = getStatsForGame(player.id, g);
                  const fantasyPoints = getFantasyScoreForPlayerSeason(
                    [g],
                    player.id,
                    scoringMatrix
                  );
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
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => viewLocation(g.location)}
                      >
                        {getAbbreviation(g.location)}
                      </TableCell>
                      <TableCell
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
                      </TableCell>
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
      <GameFantasyDetailDialog
        open={Boolean(detailModalGame)}
        onClose={() => setDetailModalGame(undefined)}
        player={player}
        scoringMatrix={scoringMatrix}
        game={detailModalGame}
      />
    </Card>
  );
};
