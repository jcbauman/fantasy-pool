import {
  Autocomplete,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setLastGameId } from "../../../redux/gameSlice";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  getPlayerFullName,
  getPlayerNameAbbreviation,
  getStatsForGame,
} from "../../players/utils/playerUtils";
import { ConfirmationDialog } from "./ConfirmationDialog";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { TimeCounter } from "./TimeCounter";
import { useAppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Game, GameStatKeys } from "../../../types";
import { useIterateStats } from "../hooks/useIterateStats";
import { MultiBallDialog } from "./MultiBallDialog";
import {
  deleteGame,
  updateExistingGame,
} from "../../../backend/endpoints/games";
import { getStatKeyFromNumBalls } from "../../../utils/statsUtils";
import { DiscardDialog } from "./DiscardDialog";
import StrikethroughSOutlinedIcon from "@mui/icons-material/StrikethroughSOutlined";
import { MultiBallDeleteDialog } from "./MultiBallDeleteDialog";
import { useFetchLocationNames } from "../../../backend/endpoints/locations";
import { DeleteOutlined } from "@mui/icons-material";
import DatePicker from "../../../shared-components/DatePicker";
import { Timestamp } from "firebase/firestore";
import { formatDateStringToMMDDYYY } from "../../../utils/dateUtils";
import { sendSuccessNotification } from "../../../shared-components/toasts/notificationToasts";
import { capitalizeLocation } from "../../../utils/gameUtils";
import { ScoringButtonGroup } from "./ScoringButtonGroup";

export const GameEditingInterface: FC<{ gameToEdit: Game }> = ({
  gameToEdit,
}) => {
  const [currGame, setCurrGame] = useState(gameToEdit);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    players,
    authState: { player },
  } = useAppContext();
  const locations = useFetchLocationNames();
  const { iterateStatNonRedux } = useIterateStats();
  const [selectedTab, setSelectedTab] = useState(0);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [discardGameDialogOpen, setDiscardGameDialogOpen] = useState(false);
  const [multiBallDialogOpen, setMultiBallDialogOpen] = useState(false);
  const [multiBallDeleteDialogOpen, setMultiBallDeleteDialogOpen] =
    useState(false);
  const startTime = currGame?.timestamp
    ? new Date(currGame?.timestamp)
    : new Date();
  const endTime = currGame?.endedAt
    ? new Date(currGame?.endedAt)
    : new Date(new Date().toString());

  const gamePlayers = players.filter((player) =>
    currGame?.playerIds.includes(player.id)
  );
  const currentPlayerGameStats = useMemo(
    () => getStatsForGame(gamePlayers[selectedTab]?.id, currGame),
    [selectedTab, currGame, gamePlayers]
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
  const totalRuns =
    (currentPlayerGameStats[GameStatKeys.threeBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.fourBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.fiveBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.sixBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.sevenBallsPocketedInRow] ?? 0) +
    (currentPlayerGameStats[GameStatKeys.runTheTable] ?? 0);
  return (
    <Stack direction="column" spacing={2}>
      <Card sx={{ p: 2 }}>
        <Typography variant="overline">Details</Typography>
        <Stack direction="column" gap={2}>
          <Autocomplete
            sx={{ mt: 1 }}
            value={currGame.location}
            freeSolo
            onChange={(_e, newValue) => {
              setCurrGame({
                ...currGame,
                location: capitalizeLocation(newValue),
              });
            }}
            onInputChange={(_e, newInputValue) =>
              setCurrGame({
                ...currGame,
                location: capitalizeLocation(newInputValue),
              })
            }
            options={locations}
            renderInput={(params) => (
              <TextField
                value={currGame.location}
                {...params}
                label="Location"
                placeholder="Select location or enter a new one"
              />
            )}
          />
          <DatePicker
            label="Original game date"
            defValue={formatDateStringToMMDDYYY(currGame.timestamp)}
            onChange={(date) => {
              setCurrGame({
                ...currGame,
                createdAt: Timestamp.fromDate(date),
                timestamp: date.toString(),
              });
            }}
          />
        </Stack>
      </Card>
      <Card sx={{ p: 2 }}>
        {showTabs && (
          <Tabs
            sx={{ mb: 2 }}
            value={selectedTab}
            onChange={(_e, value) => setSelectedTab(value)}
          >
            {gamePlayers.map((p) => {
              return <Tab key={p.id} label={getPlayerNameAbbreviation(p)} />;
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
              <strong>{getPlayerFullName(gamePlayers[selectedTab])}</strong>
            </Typography>
          </Stack>
          <Stack direction="column" sx={{ alignItems: "flex-end" }}>
            <Typography variant="overline">Elapsed time</Typography>
            <TimeCounter startTime={startTime} endTime={endTime} />
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
                  <ScoringButtonGroup
                    onDecrement={() => {
                      if (field.multiBall) {
                        setMultiBallDeleteDialogOpen(true);
                      } else {
                        if (statValue !== 0) {
                          const resolvedStats = iterateStatNonRedux({
                            playerId: gamePlayers[selectedTab].id,
                            statKey: field.stat,
                            delta: -1,
                            currGame,
                          });

                          setCurrGame({
                            ...currGame,
                            statsByPlayer: resolvedStats
                              ? resolvedStats
                              : currGame.statsByPlayer,
                          });
                        }
                      }
                    }}
                    onIncrement={() => {
                      if (field.multiBall) {
                        setMultiBallDialogOpen(true);
                      } else {
                        const resolvedStats = iterateStatNonRedux({
                          playerId: gamePlayers[selectedTab].id,
                          statKey: field.stat,
                          delta: 1,
                          currGame,
                        });
                        setCurrGame({
                          ...currGame,
                          statsByPlayer: resolvedStats
                            ? resolvedStats
                            : currGame.statsByPlayer,
                        });
                      }
                    }}
                    value={field.multiBall ? totalRuns : statValue}
                    highlight={false}
                  />
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
      <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
        <Button color="error" onClick={() => setDiscardGameDialogOpen(true)}>
          <DeleteOutlined />
        </Button>
        <Button
          color="success"
          variant="contained"
          fullWidth
          onClick={() => setEndGameDialogOpen(true)}
          startIcon={<SaveOutlinedIcon />}
        >
          Save edits
        </Button>
      </Stack>
      <Stack sx={{ h: 4 }} />
      <ConfirmationDialog
        action="edit"
        open={endGameDialogOpen}
        onClose={() => setEndGameDialogOpen(false)}
        onDiscard={() => {
          setEndGameDialogOpen(false);
          setDiscardGameDialogOpen(true);
        }}
        onConfirm={async () => {
          if (currGame) {
            const editedAt = new Date().toString();
            const { id, ...gameNoId } = currGame;
            const resolvedGame: Omit<Game, "id"> = {
              ...gameNoId,
              editedAt,
            };
            await updateExistingGame(resolvedGame, currGame.id);
            dispatch(setLastGameId(currGame.id ?? null));
          }
          navigate("/game-complete");
        }}
      />
      <DiscardDialog
        open={discardGameDialogOpen}
        onClose={() => setDiscardGameDialogOpen(false)}
        onConfirm={async () => {
          await deleteGame(currGame.id, () =>
            sendSuccessNotification("Game deleted successfully")
          );

          navigate("/recent-games");
        }}
      />
      <MultiBallDialog
        open={multiBallDialogOpen}
        onClose={() => setMultiBallDialogOpen(false)}
        selectedPlayerName={
          gamePlayers[selectedTab].id === player?.id
            ? "you"
            : getPlayerNameAbbreviation(gamePlayers[selectedTab])
        }
        onConfirm={(numBalls: number) => {
          const resolvedStats = iterateStatNonRedux({
            playerId: gamePlayers[selectedTab].id,
            statKey: getStatKeyFromNumBalls(numBalls),
            delta: 1,
            currGame,
          });
          setCurrGame({
            ...currGame,
            statsByPlayer: resolvedStats
              ? resolvedStats
              : currGame.statsByPlayer,
          });
        }}
      />
      <MultiBallDeleteDialog
        currentGame={currGame}
        open={multiBallDeleteDialogOpen}
        onClose={() => setMultiBallDeleteDialogOpen(false)}
        selectedPlayerName={
          gamePlayers[selectedTab].id === player?.id
            ? "you"
            : getPlayerNameAbbreviation(gamePlayers[selectedTab])
        }
        selectedPlayerId={gamePlayers[selectedTab].id}
        onConfirmDelete={(numBalls: number) => {
          const resolvedStats = iterateStatNonRedux({
            playerId: gamePlayers[selectedTab].id,
            statKey: getStatKeyFromNumBalls(numBalls),
            delta: -1,
            currGame,
          });
          setCurrGame({
            ...currGame,
            statsByPlayer: resolvedStats
              ? resolvedStats
              : currGame.statsByPlayer,
          });
        }}
      />
    </Stack>
  );
};
