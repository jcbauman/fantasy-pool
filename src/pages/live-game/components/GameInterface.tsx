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
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearGame, setLastGameId } from "../../../redux/gameSlice";
import { RootState } from "../../../redux/store";
import { mockPlayers } from "../../../backend/fixtures";
import { Player } from "../../../types";
import { getPlayerNameAbbreviation } from "../../playersList/utils/playerUtils";
import { ConfirmationDialog } from "./ConfirmationDialog";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { TimeCounter } from "./TimeCounter";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

export const GameInterface: FC = () => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game.currentGame);
  const [selectedTab, setSelectedTab] = useState(0);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const startTime = game?.timestamp ? new Date(game?.timestamp) : new Date();

  const gamePlayers = mockPlayers.filter((player) =>
    game?.playerIds.includes(player.id)
  );
  const showTabs = gamePlayers.length > 1;
  const scorableFields = [
    {
      primary: "Win (8  ball)",
      secondary: "Via 8-Ball sink",
      icon: <EmojiEventsOutlinedIcon />,
    },
    {
      primary: "Win (scratch)",
      secondary: "Via opponent scratching on 8-Ball",
      icon: <EmojiEventsOutlinedIcon />,
    },
    {
      primary: "Incredible shot",
      secondary: "That illicits praise from opponent",
      icon: <CelebrationOutlinedIcon />,
    },
    {
      primary: "Run (3+ balls)",
      secondary: "Run of 3 or more pocketed balls",
      icon: <DirectionsRunOutlinedIcon />,
    },
    {
      primary: "George Washington",
      secondary: "Giving up the table after a win",
      icon: <WavingHandOutlinedIcon />,
    },
    { divider: true },
    {
      primary: "Loss (8 ball)",
      secondary: "Via opponent sink 8-Ball",
      icon: <DisabledByDefaultOutlinedIcon />,
    },
    {
      primary: "Loss (scratch)",
      secondary: "Via scratching on 8-Ball",
      icon: <DisabledByDefaultOutlinedIcon />,
    },
  ];
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
            <Typography variant="overline">Game time</Typography>
            <TimeCounter startTime={startTime} />
          </Stack>
        </Stack>
        <Divider />
        <List disablePadding>
          {scorableFields.map((field) => {
            if (field.divider) {
              return <Divider key="divider" />;
            }
            return (
              <ListItem
                key={field.primary}
                disablePadding
                secondaryAction={
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    <Button>-</Button>
                    <Button aria-readonly={true}>0</Button>
                    <Button>+</Button>
                  </ButtonGroup>
                }
              >
                <ListItemIcon>{field.icon}</ListItemIcon>
                <ListItemText {...field} />
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
        onConfirm={() => {
          dispatch(setLastGameId(game?.id ?? null));
          window.location.pathname = "/game-complete";
          dispatch(clearGame());
        }}
      />
    </Stack>
  );
};
