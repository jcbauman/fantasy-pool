import { FC, useState } from "react";
import { Game, GameStatKeys, GameStatKeysAbbrev, Player } from "../../../types";
import {
  Avatar,
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
import { getStatsForGame } from "../../playersList/utils/playerUtils";
import {
  formatDateToMMDD,
  getAbbreviation,
  getFantasyScoreForPlayerSeason,
  normalizeStat,
} from "../../../utils/statsUtils";
import { mockScoringMatrix } from "../../../backend/fixtures";
import { useAppContext } from "../../../context/AppContext";
import { PlayerCell } from "../../playersList/components/PlayerCell";
import { GameFantasyDetailDialog } from "../../playerDetail/components/GameFantasyDetailDialog";

export const MultiPlayerGameLog: FC<{ game: Game }> = ({ game }) => {
  const { players } = useAppContext();
  const [detailModalPlayer, setDetailModalPlayer] = useState<
    Player | undefined
  >(undefined);
  const authorPlayer = players.find((p) => p.id === game?.authorPlayerId);
  return (
    <Card>
      <Stack direction="column" sx={{ p: 0, pb: 1 }}>
        <Stack
          direction="row"
          sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography>{game.location}</Typography>
          {authorPlayer && (
            <Stack direction="row">
              <Typography variant="caption">By</Typography>
              <Avatar
                sx={{ width: 20, height: 20, ml: 1 }}
                src={authorPlayer?.profilePictureUrl}
                alt={authorPlayer?.name}
              >
                <Typography variant="caption">
                  {getAbbreviation(authorPlayer?.name)}
                </Typography>
              </Avatar>
            </Stack>
          )}
        </Stack>
        <TableContainer component={Paper} style={{ overflowX: "auto" }}>
          <Table size="small" sx={{ borderColor: "white" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="overline" noWrap>
                    Player
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
                    {GameStatKeysAbbrev[GameStatKeys.incredibleShots]}
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
                    {GameStatKeysAbbrev[GameStatKeys.georgeWashingtons]}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {game.playerIds.map((pId) => {
                const stats = getStatsForGame(pId, game);
                const fantasyPoints = getFantasyScoreForPlayerSeason(
                  [game],
                  pId,
                  mockScoringMatrix
                );
                const thisPlayer = players.find((p) => p.id === pId);
                if (!thisPlayer) return <></>;
                return (
                  <TableRow
                    key={pId}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      borderColor: "white",
                    }}
                  >
                    <TableCell>
                      <PlayerCell player={thisPlayer} />
                    </TableCell>
                    <TableCell
                      onClick={() => setDetailModalPlayer(thisPlayer)}
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
                    <TableCell>
                      {stats[GameStatKeys.runTheTable] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats[GameStatKeys.georgeWashingtons] ?? 0}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <GameFantasyDetailDialog
        open={Boolean(detailModalPlayer)}
        onClose={() => setDetailModalPlayer(undefined)}
        player={detailModalPlayer}
        scoringMatrix={mockScoringMatrix}
        game={game}
      />
    </Card>
  );
};
