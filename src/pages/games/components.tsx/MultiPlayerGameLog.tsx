import { FC, useState } from "react";
import { Game, GameStatKeys, GameStatKeysAbbrev, Player } from "../../../types";
import {
  Avatar,
  Card,
  IconButton,
  Menu,
  MenuItem,
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
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";
import { useNavigate } from "react-router-dom";
import { canEditGame } from "../../edit-game/utils";
import { EditOutlined } from "@mui/icons-material";

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
  const [showEditingDropdownAnchor, setShowEditingDropdownAnchor] =
    useState<null | HTMLElement>(null);

  return (
    <Card>
      <Stack
        direction="column"
        sx={{
          p: 0,
          pb: 1,
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack>
            <Typography>{game.location}</Typography>
          </Stack>
          {canEditGame(game, player?.id ?? "", false) ? (
            <Stack direction="row" sx={{ alignItems: "center" }}>
              <IconButton
                aria-label="Edit game"
                onClick={() => {
                  fireAnalyticsEvent("RecentGames_Clicked_EditToast");
                  navigate(`/edit-game/${game.id}`);
                }}
                sx={{
                  width: 20,
                  height: 20,
                  p: 0,
                }}
              >
                <EditOutlined sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
          ) : (
            <Stack direction="row">
              <Typography variant="caption">By</Typography>
              <Avatar
                sx={{ width: 20, height: 20, ml: 1 }}
                src={authorPlayer?.profilePictureUrl}
                alt={authorPlayer?.name}
                onClick={(e) => {
                  e.preventDefault();
                  if (user?.isAppAdmin) {
                    setShowEditingDropdownAnchor(e.currentTarget);
                  }
                }}
              >
                <Typography variant="caption">
                  {getAbbreviation(authorPlayer?.name)}
                </Typography>
              </Avatar>
              <Menu
                sx={{
                  ".MuiList-root": { backgroundColor: "black", py: 0 },
                  mt: 1,
                }}
                anchorEl={showEditingDropdownAnchor}
                open={Boolean(showEditingDropdownAnchor)}
                onClose={() => setShowEditingDropdownAnchor(null)}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  sx={{ p: 1 }}
                  onClick={() => {
                    fireAnalyticsEvent("RecentGames_Clicked_EditToast");
                    navigate(`/edit-game/${game.id}`);
                    setShowEditingDropdownAnchor(null);
                  }}
                >
                  Edit game
                </MenuItem>
              </Menu>
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
    </Card>
  );
};
