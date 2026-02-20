import { FC, useState } from "react";
import { Game, Player } from "../../../types";
import {
  AvatarGroup,
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
import { sortGamesByDate } from "../../../utils/gameUtils";
import { formatDateToMMDD } from "../../../utils/dateUtils";
import { useAppContext } from "../../../context/AppContext";
import { PlayerAvatar } from "../../../shared-components/PlayerAvatar";
import { getWinningAndLosingPlayersForGame } from "../hooks/utils";
import { GameFantasyDetailDialog } from "../../player-detail/components/GameFantasyDetailDialog";

export const LocationGameLog: FC<{ games: Game[] }> = ({ games }) => {
  const dateSortedGames = sortGamesByDate(games);
  const { players, scoringMatrix } = useAppContext();
  const [detailModalGame, setDetailModalGame] = useState<Game | undefined>(
    undefined,
  );
  const [detailModalPlayer, setDetailModalPlayer] = useState<
    Player | undefined
  >(undefined);

  const handleOpenDetailModal = (player: Player, game: Game) => {
    setDetailModalPlayer(player);
    setDetailModalGame(game);
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
                      Win (+)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      Loss (-)
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dateSortedGames.map((g, idx) => {
                  const { winningPlayers, losingPlayers } =
                    getWinningAndLosingPlayersForGame(players, g);
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
                      <TableCell>
                        <Stack
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            textAlign: "center",
                          }}
                        >
                          {winningPlayers.length > 0 ? (
                            <AvatarGroup sx={{ justifyContent: "flex-end" }}>
                              {winningPlayers.map((p) => {
                                const key = `${p.id}-${g.id}`;
                                return (
                                  <PlayerAvatar
                                    key={key}
                                    player={p}
                                    onClick={() => handleOpenDetailModal(p, g)}
                                  />
                                );
                              })}
                            </AvatarGroup>
                          ) : (
                            ""
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            textAlign: "center",
                          }}
                        >
                          {losingPlayers.length > 0 ? (
                            <AvatarGroup sx={{ justifyContent: "flex-end" }}>
                              {losingPlayers.map((p) => {
                                const key = `${p.id}-${g.id}`;
                                return (
                                  <PlayerAvatar
                                    key={key}
                                    player={p}
                                    onClick={() => handleOpenDetailModal(p, g)}
                                  />
                                );
                              })}
                            </AvatarGroup>
                          ) : (
                            ""
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack sx={{ py: 2, alignItems: "center", justifyContent: "center" }}>
            <Typography variant="caption">
              No games to show this season
            </Typography>
          </Stack>
        )}
      </Stack>
      <GameFantasyDetailDialog
        open={Boolean(detailModalGame)}
        onClose={() => setDetailModalGame(undefined)}
        player={detailModalPlayer}
        scoringMatrix={scoringMatrix}
        game={detailModalGame}
      />
    </Card>
  );
};
