import {
  Button,
  ButtonGroup,
  Card,
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
import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearGame, setLastGameId } from "../../../redux/gameSlice";
import { RootState } from "../../../redux/store";
import {
  getPlayerNameAbbreviation,
  getStatsForGame,
} from "../../playersList/utils/playerUtils";
import { ConfirmationDialog } from "./ConfirmationDialog";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { TimeCounter } from "./TimeCounter";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { useAppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { GameStatKeys } from "../../../types";
import { useIterateStats } from "../hooks/useIterateStats";
import { MultiBallDialog } from "./MultiBallDialog";
import { addNewGame } from "../../../backend/setters";
import { getStatKeyFromNumBalls } from "../../../utils/statsUtils";
import { DiscardDialog } from "./DiscardDialog";

export const GameInterface: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    players,
    authState: { player },
  } = useAppContext();
  const game = useSelector((state: RootState) => state.game.currentGame);
  const { iterateStat } = useIterateStats();
  const [selectedTab, setSelectedTab] = useState(0);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [discardGameDialogOpen, setDiscardGameDialogOpen] = useState(false);
  const [multiBallDialogOpen, setMultiBallDialogOpen] = useState(false);
  const startTime = game?.timestamp ? new Date(game?.timestamp) : new Date();

  const gamePlayers = players.filter((player) =>
    game?.playerIds.includes(player.id)
  );
  const currentPlayerGameStats = useMemo(
    () => getStatsForGame(gamePlayers[selectedTab].id, game),
    [selectedTab, game, gamePlayers]
  );
  const showTabs = gamePlayers.length > 1;
  const scorableFields = [
    {
      stat: GameStatKeys.winsBy8BallSink,
      primary: "Win (8  ball)",
      secondary: "My team or I sunk the 8-ball",
      icon: <EmojiEventsOutlinedIcon />,
    },
    {
      stat: GameStatKeys.winsByOpponentScratch,
      primary: "Win (scratch)",
      secondary: "My opponent screwed up",
      icon: <EmojiEventsOutlinedIcon />,
    },
    {
      stat: GameStatKeys.lossesBy8BallSink,
      primary: "Loss (8 ball)",
      secondary: "My opponent sunk the 8-ball",
      icon: <DisabledByDefaultOutlinedIcon />,
    },
    {
      stat: GameStatKeys.lossesByScratch,
      primary: "Loss (scratch)",
      secondary: "My team or I screwed up",
      icon: <DisabledByDefaultOutlinedIcon />,
    },
    {
      stat: GameStatKeys.incredibleShots,
      primary: "Incredible shot",
      secondary: "My shot impressed",
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
      stat: GameStatKeys.georgeWashingtons,
      primary: "George Washington",
      secondary: "Gave up the table after a win",
      icon: <WavingHandOutlinedIcon />,
    },
  ];
  const totalRuns =
    currentPlayerGameStats[GameStatKeys.threeBallsPocketedInRow] +
    currentPlayerGameStats[GameStatKeys.fourBallsPocketedInRow] +
    currentPlayerGameStats[GameStatKeys.fiveBallsPocketedInRow] +
    currentPlayerGameStats[GameStatKeys.sixBallsPocketedInRow] +
    currentPlayerGameStats[GameStatKeys.sevenBallsPocketedInRow] +
    currentPlayerGameStats[GameStatKeys.runTheTable];
  return (
    <Stack direction="column" spacing={2}>
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
            <Typography variant="overline">Ellapsed time</Typography>
            <TimeCounter startTime={startTime} />
          </Stack>
        </Stack>
        <Divider />
        <List disablePadding>
          {scorableFields.map((field) => {
            const statValue = currentPlayerGameStats[field.stat] ?? 0;
            return (
              <ListItem
                key={field.primary}
                disablePadding
                secondaryAction={
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    <Button
                      onClick={() => {
                        if (field.multiBall) {
                          setMultiBallDialogOpen(true);
                        } else {
                          if (statValue !== 0)
                            iterateStat({
                              playerId: gamePlayers[selectedTab].id,
                              statKey: field.stat,
                              delta: -1,
                            });
                        }
                      }}
                    >
                      -
                    </Button>
                    <Button sx={{ pointerEvents: "none" }}>
                      {field.multiBall ? totalRuns : statValue}
                    </Button>
                    <Button
                      onClick={() => {
                        if (field.multiBall) {
                          setMultiBallDialogOpen(true);
                        } else {
                          iterateStat({
                            playerId: gamePlayers[selectedTab].id,
                            statKey: field.stat,
                            delta: 1,
                          });
                        }
                      }}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                }
              >
                <ListItemIcon>{field.icon}</ListItemIcon>
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
      <Button
        color="error"
        variant="contained"
        fullWidth
        onClick={() => setEndGameDialogOpen(true)}
        startIcon={<DoneOutlinedIcon />}
      >
        End session
      </Button>
      <ConfirmationDialog
        open={endGameDialogOpen}
        onClose={() => setEndGameDialogOpen(false)}
        onDiscard={() => {
          setEndGameDialogOpen(false);
          setDiscardGameDialogOpen(true);
        }}
        onConfirm={async () => {
          if (game) {
            const { id, ...gameNoId } = game;
            const gameId = await addNewGame(gameNoId);
            dispatch(setLastGameId(gameId ?? null));
          }
          navigate("/game-complete");
          dispatch(clearGame());
        }}
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
        onConfirm={(numBalls: number) =>
          iterateStat({
            playerId: gamePlayers[selectedTab].id,
            statKey: getStatKeyFromNumBalls(numBalls),
            delta: 1,
          })
        }
      />
    </Stack>
  );
};
