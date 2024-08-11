import { FC, useMemo, useState } from "react";
import {
  Game,
  GameStatKeys,
  GameStatKeysAbbrev,
  Player,
  Session,
} from "../../../types";
import {
  Avatar,
  Button,
  Card,
  Collapse,
  IconButton,
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
  getStatsForGame,
  getStatsForSession,
} from "../../playersList/utils/playerUtils";
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
import { useDispatch } from "react-redux";
import { sendSuccessNotificaton } from "../../../redux/notificationSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { MultiPlayerGameLog } from "./MultiPlayerGameLog";
import { sortGamesByDate } from "../../../utils/gameUtils";

export const MultiPlayerSessionLog: FC<{ session: Session }> = ({
  session,
}) => {
  const {
    players,
    authState: { user },
    scoringMatrix,
  } = useAppContext();
  const [gamesExpanded, setGamesExpanded] = useState(false);
  const [detailModalPlayer, setDetailModalPlayer] = useState<
    Player | undefined
  >(undefined);
  const dispatch = useDispatch();
  const dateSortedGames = useMemo(
    () => sortGamesByDate(session.games),
    [session.games]
  );
  return (
    <Stack>
      <Card>
        <Stack direction="column" sx={{ p: 0, pb: 1 }}>
          <Stack
            direction="row"
            sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography>{session.location}</Typography>
            <IconButton
              onClick={() => setGamesExpanded((expanded) => !expanded)}
              sx={{
                ".MuiSvgIcon-root": {
                  transform: gamesExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.1s ease",
                },
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
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
                {session.playerIds.map((pId) => {
                  const stats = getStatsForSession(pId, session);
                  const fantasyPoints = getFantasyScoreForPlayerSeason(
                    [session],
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
                        onClick={(e) => {
                          e.preventDefault();
                          setDetailModalPlayer(thisPlayer);
                        }}
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
        </Stack>
      </Card>
      <Collapse in={gamesExpanded} collapsedSize={0}>
        <Stack
          spacing={2}
          direction="column"
          sx={{ py: 2, px: 1, backgroundColor: "transparent" }}
        >
          {dateSortedGames.map((game) => {
            return <MultiPlayerGameLog game={game} key={game.id} />;
          })}
          <Button
            variant="text"
            size="small"
            onClick={() => setGamesExpanded(false)}
          >
            Collapse games
          </Button>
        </Stack>
      </Collapse>
      <GameFantasyDetailDialog
        open={Boolean(detailModalPlayer)}
        onClose={() => setDetailModalPlayer(undefined)}
        player={detailModalPlayer}
        scoringMatrix={scoringMatrix}
        game={session}
      />
    </Stack>
  );
};
