import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearGame } from "../../../redux/gameSlice";
import { RootState } from "../../../redux/store";
import { mockPlayers } from "../../../backend/fixtures";
import { Player } from "../../../types";
import { getPlayerNameAbbreviation } from "../../playersList/utils/playerUtils";
import { getTimeDifference } from "../../../utils/statsUtils";

export const GameInterface: FC = () => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game.game);
  const [selectedTab, setSelectedTab] = useState(0);
  const gamePlayers = mockPlayers.filter((player) =>
    game?.playerIds.includes(player.id)
  );
  const scorableFields = [
    { primary: "Win", secondary: "Via 8-Ball sink" },
    { primary: "Win", secondary: "Via opponent scratching on 8-Ball" },
    { primary: "Loss", secondary: "Via opponent sink 8-Ball" },
    { primary: "Loss", secondary: "Via scratching on 8-Ball" },
  ];
  return (
    <Stack direction="column" spacing={2}>
      <Card sx={{ p: 2 }}>
        <Tabs
          sx={{ mb: 2 }}
          value={selectedTab}
          onChange={(_e, value) => setSelectedTab(value)}
        >
          {gamePlayers.map((p) => {
            return <Tab key={p.id} label={getPlayerNameAbbreviation(p.name)} />;
          })}
        </Tabs>
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
          <Stack direction="column">
            <Typography variant="overline">Game time</Typography>
            <Typography variant="h5">
              {getTimeDifference(
                game?.timestamp ? new Date(game?.timestamp) : new Date()
              )}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <List disablePadding>
          {scorableFields.map((field) => {
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
        onClick={() => dispatch(clearGame())}
      >
        End session
      </Button>
    </Stack>
  );
};
