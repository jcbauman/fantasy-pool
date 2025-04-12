import React, { FC, useState } from "react";
import { Game, GameStatKeys, GameStatKeysAbbrev, Player } from "../../../types";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Paper,
  Snackbar,
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
import { updateExistingGame } from "../../../backend/setters";
import { sendSuccessNotification } from "../../../shared-components/toasts/notificationToasts";
import CloseIcon from "@mui/icons-material/Close";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";
import { useNavigate } from "react-router-dom";
import { canEditGame } from "../../edit-game/utils";

export const MultiPlayerGameLog: FC<{ game: Game }> = ({ game }) => {
  const {
    players,
    authState: { user, player },
    scoringMatrix,
  } = useAppContext();
  const navigate = useNavigate();
  const [detailModalPlayer, setDetailModalPlayer] = useState<
    Player | undefined
  >(undefined);
  const authorPlayer = players.find((p) => p.id === game?.authorPlayerId);
  const [showEditingToast, setShowEditingToast] = useState(false);

  return (
    <Card>
      <Stack
        direction="column"
        sx={{
          p: 0,
          pb: 1,
          transition: "border 0.3s ease-in-out",
          border: showEditingToast ? "1px solid white" : "default",
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}
          onClick={() => {
            if (canEditGame(game, player?.id ?? "", user?.isAppAdmin)) {
              fireAnalyticsEvent("RecentGames_Clicked_Header");
              setShowEditingToast(true);
            }
          }}
        >
          <Stack>
            <Typography>{game.location}</Typography>
          </Stack>
          {authorPlayer && (
            <Stack direction="row">
              <Typography variant="caption">By</Typography>
              <Avatar
                sx={{ width: 20, height: 20, ml: 1 }}
                src={authorPlayer?.profilePictureUrl}
                alt={authorPlayer?.name}
                onClick={(e) => {
                  e.preventDefault();
                  if (user?.isAppAdmin) {
                    navigator.clipboard
                      .writeText(game.id)
                      .then(() => {
                        sendSuccessNotification("Copied game ID to clipboard");
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
                      {stats?.[GameStatKeys.winsBy8BallSink] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.winsByOpponentScratch] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.lossesBy8BallSink] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.lossesByScratch] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.skillShots] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.threeBallsPocketedInRow] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.fourBallsPocketedInRow] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.fiveBallsPocketedInRow] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.sixBallsPocketedInRow] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.sevenBallsPocketedInRow] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.runTheTable] ?? 0}
                    </TableCell>
                    <TableCell>
                      {stats?.[GameStatKeys.scratches] ?? 0}
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
        scoringMatrix={scoringMatrix}
        game={game}
      />
      {showEditingToast && (
        <Snackbar
          sx={{
            ".MuiSnackbarContent-root": {
              backgroundColor: "black",
              color: "white",
            },
          }}
          autoHideDuration={3000}
          message="You can still edit the stats of this game"
          open={showEditingToast}
          onClose={() => setShowEditingToast(false)}
          action={
            <Button
              color="secondary"
              sx={{ fontWeight: 600 }}
              size="small"
              onClick={() => {
                fireAnalyticsEvent("RecentGames_Clicked_EditToast");
                setShowEditingToast(false);
                navigate(`/edit-game/${game.id}`);
              }}
            >
              Edit
            </Button>
          }
        />
      )}
    </Card>
  );
};
