import {
  Button,
  ButtonGroup,
  Card,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { FC, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearGame, setLastGameId } from "../../../redux/gameSlice";
import { RootState } from "../../../redux/store";
import SportsMmaOutlinedIcon from "@mui/icons-material/SportsMmaOutlined";
import {
  getPlayerNameAbbreviation,
  getStatsForGame,
} from "../../playersList/utils/playerUtils";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { TimeCounter } from "./TimeCounter";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { useAppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Game, GameStat, GameStatKeys } from "../../../types";
import { useIterateStats } from "../hooks/useIterateStats";
import { MultiBallDialog } from "./MultiBallDialog";
import { addNewGame } from "../../../backend/setters";
import { getStatKeyFromNumBalls } from "../../../utils/statsUtils";
import { DiscardDialog } from "./DiscardDialog";
import StrikethroughSOutlinedIcon from "@mui/icons-material/StrikethroughSOutlined";
import { MultiBallDeleteDialog } from "./MultiBallDeleteDialog";
import { Timestamp } from "firebase/firestore";
import { useGameIsIncomplete } from "../hooks/useGameIsIncomplete";
import { DeleteOutline, FavoriteBorder, Undo } from "@mui/icons-material";
import EightBallIcon from "../../../shared-components/icons/EightBallIcon";
import { ConfirmationDrawerV2 } from "./ConfirmationDrawerV2";
import { sendErrorNotification } from "../../../shared-components/toasts/notificationToasts";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";
import { sendIterationNotificationMessage } from "../hooks/utils";

export const GameInterfaceV2: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    players,
    authState: { player },
  } = useAppContext();
  const gameIsIncomplete = useGameIsIncomplete();
  const game = useSelector((state: RootState) => state.game.currentGame);
  const { iterateStat, iterateStatNonRedux } = useIterateStats();
  const [selectedTab, setSelectedTab] = useState(0);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [discardGameDialogOpen, setDiscardGameDialogOpen] = useState(false);
  const [multiBallDialogOpen, setMultiBallDialogOpen] = useState(false);
  const [multiBallDeleteDialogOpen, setMultiBallDeleteDialogOpen] =
    useState(false);
  const [showEndGameSection, setShowEndGameSection] = useState(false);

  //game end states
  const [wonGame, setWonGame] = useState<boolean | null>(null);
  const [by8Ball, setBy8Ball] = useState<boolean | null>(null);
  const [doubles, setDoubles] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTime = game?.timestamp ? new Date(game?.timestamp) : new Date();

  const gamePlayers = players.filter((player) =>
    game?.playerIds.includes(player.id)
  );
  const currentPlayerGameStats = useMemo(
    () => getStatsForGame(gamePlayers[selectedTab].id, game),
    [selectedTab, game, gamePlayers]
  );
  const showTabs = gamePlayers.length > 1;
  const enableSubmitForSingles =
    !showTabs && wonGame !== null && by8Ball !== null;
  const enableSubmitForDoubles =
    showTabs &&
    by8Ball !== null &&
    doubles !== null &&
    (doubles === false || wonGame !== null);
  const enableSaveGame = showTabs
    ? enableSubmitForDoubles
    : enableSubmitForSingles;
  const scorableFields = [
    {
      stat: GameStatKeys.skillShots,
      primary: "Skill shot",
      secondary: "Banks, combos, caroms",
      icon: <CelebrationOutlinedIcon />,
    },
    {
      stat: GameStatKeys.threeBallsPocketedInRow,
      primary: "Run (3+ balls)",
      secondary: "3 or more balls in a row",
      icon: <DirectionsRunOutlinedIcon />,
      multiBall: true,
    },
    {
      stat: GameStatKeys.scratches,
      primary: "Scratch",
      secondary: "Scratched (not on 8-ball)",
      icon: <StrikethroughSOutlinedIcon />,
    },
  ];
  const otherPlayer = showTabs
    ? gamePlayers[selectedTab * -1 + 1].name.split(" ")[0]
    : "";
  const doublesScoringOutcomeWording = wonGame
    ? "Both players will share this win!"
    : "Both players will share this loss";
  const doublesScoringCaption = doubles
    ? doublesScoringOutcomeWording
    : `${otherPlayer} will suffer a loss`;
  const totalRuns =
    (currentPlayerGameStats[GameStatKeys.threeBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.fourBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.fiveBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.sixBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.sevenBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.runTheTable] ?? 0);

  const logWin = (playerTab: number, currGame: Game): GameStat[] => {
    return (
      iterateStatNonRedux({
        playerId: gamePlayers[playerTab].id,
        statKey: by8Ball
          ? GameStatKeys.winsBy8BallSink
          : GameStatKeys.winsByOpponentScratch,
        delta: 1,
        currGame,
      }) ?? []
    );
  };

  const logLoss = (playerTab: number, currGame: Game): GameStat[] => {
    return (
      iterateStatNonRedux({
        playerId: gamePlayers[playerTab].id,
        statKey: by8Ball
          ? GameStatKeys.lossesBy8BallSink
          : GameStatKeys.lossesByScratch,
        delta: 1,
        currGame,
      }) ?? []
    );
  };
  const resolveGame = (): Game | undefined => {
    if (!game) return;
    let resolvedGame: Game = { ...game };
    if (showTabs) {
      //doubles
      if (doubles) {
        if (wonGame) {
          //both won
          resolvedGame = {
            ...resolvedGame,
            statsByPlayer: logWin(0, game),
          };
          resolvedGame = {
            ...resolvedGame,
            statsByPlayer: logWin(1, resolvedGame),
          };
        } else {
          //both lost
          resolvedGame = {
            ...resolvedGame,
            statsByPlayer: logLoss(0, game),
          };
          resolvedGame = {
            ...resolvedGame,
            statsByPlayer: logLoss(1, resolvedGame),
          };
        }
      } else {
        //opponents
        resolvedGame = {
          ...resolvedGame,
          statsByPlayer: logWin(selectedTab, game),
        };
        resolvedGame = {
          ...resolvedGame,
          statsByPlayer: logLoss(selectedTab * -1 + 1, resolvedGame),
        };
      }
    } else {
      //solo
      if (wonGame) {
        resolvedGame = {
          ...resolvedGame,
          statsByPlayer: logWin(selectedTab, game),
        };
      } else {
        resolvedGame = {
          ...resolvedGame,
          statsByPlayer: logLoss(selectedTab, game),
        };
      }
    }
    return resolvedGame;
  };

  const onSubmitGame = async () => {
    setIsSubmitting(true);
    if (game) {
      const endedGame = resolveGame();
      if (!endedGame) return;
      const createdAt = Timestamp.fromDate(new Date(endedGame.timestamp));
      const endedAt = new Date().toString();
      const { id, ...gameNoId } = endedGame;
      const resolvedGame: Omit<Game, "id"> = {
        ...gameNoId,
        createdAt,
        endedAt,
      };
      if (!gameIsIncomplete) {
        sendErrorNotification("There was an error submitting your game");
        setIsSubmitting(false);
      }
      const gameId = await addNewGame(resolvedGame);
      dispatch(setLastGameId(gameId ?? null));
      navigate("/game-complete");
      dispatch(clearGame());
      setIsSubmitting(false);
      setEndGameDialogOpen(false);
    } else {
      setIsSubmitting(false);
      setEndGameDialogOpen(false);
    }
  };
  return (
    <Stack direction="column">
      <Collapse collapsedSize={0} in={!showEndGameSection}>
        <Card sx={{ p: 2 }}>
          {showTabs && (
            <Tabs
              sx={{ mb: 2 }}
              value={selectedTab}
              onChange={(_e, value) => setSelectedTab(value)}
            >
              {gamePlayers.map((p) => {
                return (
                  <Tab key={p.id} label={getPlayerNameAbbreviation(p.name)} />
                );
              })}
            </Tabs>
          )}
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction="column">
              <Typography variant="overline">Entering for:</Typography>
              <Typography variant="h5">
                <strong>{gamePlayers[selectedTab].name}</strong>
              </Typography>
            </Stack>
            <Stack direction="column" sx={{ alignItems: "flex-end" }}>
              <Typography variant="overline">Elapsed time</Typography>
              <TimeCounter startTime={startTime} />
            </Stack>
          </Stack>
          <Divider />
          <List disablePadding>
            {scorableFields.map((field, idx) => {
              const statValue = currentPlayerGameStats[field.stat] ?? 0;
              return (
                <ListItem
                  sx={
                    idx === 1 ? { borderBottom: "1px solid", pb: 2, mb: 1 } : {}
                  }
                  key={field.primary}
                  disablePadding
                  secondaryAction={
                    <ButtonGroup variant="contained" aria-label="Run selection">
                      <Button
                        size="large"
                        onClick={() => {
                          if (field.multiBall) {
                            if (totalRuns > 0)
                              setMultiBallDeleteDialogOpen(true);
                          } else {
                            if (statValue !== 0) {
                              iterateStat({
                                playerId: gamePlayers[selectedTab].id,
                                statKey: field.stat,
                                delta: -1,
                              });
                              if (gamePlayers.length > 1)
                                sendIterationNotificationMessage(
                                  gamePlayers[selectedTab].name,
                                  field.stat,
                                  -1
                                );
                              fireAnalyticsEvent(
                                "GameMode_Clicked_DecreaseStat",
                                { statKey: field.stat }
                              );
                            }
                          }
                        }}
                      >
                        -
                      </Button>
                      <Button sx={{ pointerEvents: "none" }} size="large">
                        {field.multiBall ? totalRuns : statValue}
                      </Button>
                      <Button
                        size="large"
                        onClick={() => {
                          if (field.multiBall) {
                            setMultiBallDialogOpen(true);
                          } else {
                            iterateStat({
                              playerId: gamePlayers[selectedTab].id,
                              statKey: field.stat,
                              delta: 1,
                            });
                            if (gamePlayers.length > 1)
                              sendIterationNotificationMessage(
                                gamePlayers[selectedTab].name,
                                field.stat,
                                1
                              );
                          }
                        }}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                  }
                >
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    {field.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={field.primary}
                    secondary={
                      <Typography variant="caption" noWrap>
                        {field.secondary}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Card>
      </Collapse>
      <Collapse collapsedSize={0} in={showEndGameSection}>
        <Card sx={{ p: 2 }}>
          <Stack direction="column">
            <Stack
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              sx={{ mb: 1 }}
            >
              <Divider flexItem />
              <Typography
                variant="h6"
                sx={{ mx: 1, whiteSpace: "nowrap", my: 0.5 }} // `mx` for minimal spacing between the dividers
              >
                End game
              </Typography>
              <Divider flexItem />
            </Stack>
            {showTabs && (
              <Stack>
                <Typography variant="overline">Players were:</Typography>
                <ButtonGroup fullWidth>
                  <Button
                    size="large"
                    startIcon={<SportsMmaOutlinedIcon />}
                    onClick={() => setDoubles(false)}
                    variant={doubles === false ? "contained" : "outlined"}
                  >
                    Opponents
                  </Button>
                  <Button
                    size="large"
                    startIcon={<FavoriteBorder />}
                    onClick={() => setDoubles(true)}
                    variant={doubles ? "contained" : "outlined"}
                  >
                    Team
                  </Button>
                </ButtonGroup>
                <Collapse in={doubles === false} collapsedSize={0}>
                  <Stack sx={{ mt: 2 }}>
                    <Typography variant="overline">Winner:</Typography>
                    <ButtonGroup fullWidth>
                      <Button
                        size="large"
                        onClick={() => setSelectedTab(0)}
                        variant={selectedTab === 0 ? "contained" : "outlined"}
                      >
                        {gamePlayers[0].name.split(" ")[0]}
                      </Button>
                      <Button
                        size="large"
                        onClick={() => setSelectedTab(1)}
                        variant={selectedTab === 1 ? "contained" : "outlined"}
                      >
                        {gamePlayers[1].name.split(" ")[0]}
                      </Button>
                    </ButtonGroup>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      {doublesScoringCaption}
                    </Typography>
                  </Stack>
                </Collapse>
              </Stack>
            )}
            {(!showTabs || doubles) && (
              <Stack sx={{ mt: doubles ? 2 : 0 }}>
                <Typography variant="overline">Game outcome:</Typography>
                <ButtonGroup fullWidth>
                  <Button
                    size="large"
                    startIcon={<EmojiEventsOutlinedIcon />}
                    onClick={() => setWonGame(true)}
                    variant={wonGame ? "contained" : "outlined"}
                  >
                    Win
                  </Button>
                  <Button
                    size="large"
                    startIcon={<DisabledByDefaultOutlinedIcon />}
                    onClick={() => setWonGame(false)}
                    variant={wonGame === false ? "contained" : "outlined"}
                  >
                    Loss
                  </Button>
                </ButtonGroup>
              </Stack>
            )}
            <Typography variant="overline" sx={{ mt: 2 }}>
              {wonGame === false ? "Lost" : "Won"} by:
            </Typography>
            <ButtonGroup fullWidth>
              <Button
                size="large"
                startIcon={<EightBallIcon color={"white"} />}
                onClick={() => setBy8Ball(true)}
                variant={by8Ball ? "contained" : "outlined"}
              >
                8-ball sink
              </Button>
              <Button
                size="large"
                startIcon={<StrikethroughSOutlinedIcon />}
                onClick={() => setBy8Ball(false)}
                variant={by8Ball === false ? "contained" : "outlined"}
              >
                Scratch
              </Button>
            </ButtonGroup>
            <Divider sx={{ my: 2 }} />
            <Button
              disabled={!enableSaveGame}
              fullWidth
              startIcon={<SaveOutlinedIcon />}
              variant="contained"
              size="large"
              sx={{ mt: 1 }}
              color="success"
              onClick={() => setEndGameDialogOpen(true)}
            >
              Save game
            </Button>
          </Stack>
        </Card>
      </Collapse>
      <Stack direction="row" sx={{ alignItems: "center", mt: 1 }} gap={1}>
        <Button
          size="large"
          variant={showEndGameSection ? "outlined" : "contained"}
          color="error"
          onClick={() => {
            setDiscardGameDialogOpen(true);
            fireAnalyticsEvent("GameMode_Clicked_DeleteGame");
          }}
        >
          <DeleteOutline color={showEndGameSection ? "error" : "inherit"} />
        </Button>
        <Button
          size="large"
          color={"primary"}
          variant={showEndGameSection ? "outlined" : "contained"}
          fullWidth
          onClick={() => {
            setShowEndGameSection(!showEndGameSection);
            fireAnalyticsEvent("GameMode_Clicked_EndGame");
          }}
          startIcon={showEndGameSection ? <Undo /> : <DoneOutlinedIcon />}
        >
          {showEndGameSection ? "Back" : "End game"}
        </Button>
      </Stack>
      <ConfirmationDrawerV2
        loading={isSubmitting}
        open={endGameDialogOpen}
        onClose={() => setEndGameDialogOpen(false)}
        onDiscard={() => {
          setEndGameDialogOpen(false);
          setDiscardGameDialogOpen(true);
        }}
        onConfirm={onSubmitGame}
      />
      <DiscardDialog
        open={discardGameDialogOpen}
        onClose={() => setDiscardGameDialogOpen(false)}
        onConfirm={async () => {
          dispatch(clearGame());
          navigate("/");
        }}
      />
      <MultiBallDialog
        open={multiBallDialogOpen}
        onClose={() => setMultiBallDialogOpen(false)}
        selectedPlayerName={
          gamePlayers[selectedTab].id === player?.id
            ? "you"
            : getPlayerNameAbbreviation(gamePlayers[selectedTab].name)
        }
        onConfirm={(numBalls: number) => {
          iterateStat({
            playerId: gamePlayers[selectedTab].id,
            statKey: getStatKeyFromNumBalls(numBalls),
            delta: 1,
          });
          if (gamePlayers.length > 1)
            sendIterationNotificationMessage(
              gamePlayers[selectedTab].name,
              getStatKeyFromNumBalls(numBalls),
              1
            );
        }}
      />
      <MultiBallDeleteDialog
        currentGame={game}
        open={multiBallDeleteDialogOpen}
        onClose={() => setMultiBallDeleteDialogOpen(false)}
        selectedPlayerName={
          gamePlayers[selectedTab].id === player?.id
            ? "you"
            : getPlayerNameAbbreviation(gamePlayers[selectedTab].name)
        }
        selectedPlayerId={gamePlayers[selectedTab].id}
        onConfirmDelete={(numBalls: number) => {
          iterateStat({
            playerId: gamePlayers[selectedTab].id,
            statKey: getStatKeyFromNumBalls(numBalls),
            delta: -1,
          });
          if (gamePlayers.length > 1)
            sendIterationNotificationMessage(
              gamePlayers[selectedTab].name,
              getStatKeyFromNumBalls(numBalls),
              -1
            );
        }}
      />
    </Stack>
  );
};
