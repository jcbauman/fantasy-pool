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
  getAbbreviation,
  getFantasyScoreForPlayerSeason,
  normalizeStat,
} from "../../../utils/statsUtils";
import { useAppContext } from "../../../context/AppContext";
import { PlayerCell } from "../../playersList/components/PlayerCell";
import { GameFantasyDetailDialog } from "../../playerDetail/components/GameFantasyDetailDialog";
import { TextEditorField } from "../../../shared-components/TextEditorField";
import { updateExistingGame } from "../../../backend/fetchers/games";
import { useDispatch } from "react-redux";
import { sendSuccessNotification } from "../../../redux/notificationSlice";

export const MultiPlayerGameLog: FC<{ game: Game }> = ({ game }) => {
  const {
    players,
    authState: { user },
    scoringMatrix,
  } = useAppContext();
  const [detailModalPlayer, setDetailModalPlayer] = useState<
    Player | undefined
  >(undefined);
  const [editingGameLoc, setEditingGameLoc] = useState(false);
  const authorPlayer = players.find((p) => p.id === game?.authorPlayerId);
  const dispatch = useDispatch();
  return (
    <Card>
      <Stack direction="column" sx={{ p: 0, pb: 1 }}>
        <Stack
          direction="row"
          sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack
            onClick={() => {
              if (user?.isAppAdmin || game.authorPlayerId === user?.id) {
                setEditingGameLoc(true);
              }
            }}
          >
            {editingGameLoc ? (
              <TextEditorField
                placeholder="Edit location"
                defaultValue={game.location ?? ""}
                onSave={async (newVal: string) => {
                  const resolvedGame: Game = {
                    ...game,
                    location: newVal,
                  };
                  const { id, ...gameNoId } = resolvedGame;
                  await updateExistingGame(gameNoId, game.id);
                  setEditingGameLoc(false);
                }}
                onClickAway={() => setEditingGameLoc(false)}
              />
            ) : (
              <Typography>{game.location}</Typography>
            )}
          </Stack>
          {authorPlayer && (
            <Stack direction="row">
              <Typography variant="caption">By</Typography>
              <Avatar
                sx={{ width: 20, height: 20, ml: 1 }}
                src={authorPlayer?.profilePictureUrl}
                alt={authorPlayer?.name}
                onClick={() => {
                  if (user?.isAppAdmin) {
                    navigator.clipboard
                      .writeText(game.id)
                      .then(() => {
                        dispatch(
                          sendSuccessNotification("Copied game ID to clipboard")
                        );
                      })
                      .catch((err) => {
                        console.error("Failed to copy text: ", err);
                      });
                  }
                }}
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
              {game.playerIds.map((pId) => {
                const stats = getStatsForGame(pId, game);
                const fantasyPoints = getFantasyScoreForPlayerSeason(
                  [game],
                  pId,
                  scoringMatrix
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
                      <PlayerCell player={thisPlayer} linkToPlayer />
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
                    <TableCell>
                      {stats[GameStatKeys.runTheTable] ?? 0}
                    </TableCell>
                    <TableCell>{stats[GameStatKeys.scratches] ?? 0}</TableCell>
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
        scoringMatrix={scoringMatrix}
        game={game}
      />
    </Card>
  );
};
