import {
  Button,
  ButtonGroup,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";
import { sendIterationNotificationMessage } from "../hooks/utils";
import { useIterateStats } from "../hooks/useIterateStats";
import { GameStat, GameStatKeys, Player } from "../../../types";

interface ScorableFieldItemProps {
  setMultiBallDialogOpen: (open: boolean) => void;
  setMultiBallDeleteDialogOpen: (open: boolean) => void;
  handleButtonAnimation: (index: number) => void;
  field: {
    stat: GameStatKeys;
    primary: string;
    secondary: string;
    icon: JSX.Element;
    multiBall?: boolean;
  };
  totalRuns: number;
  idx: number;
  statValue: number;
  gamePlayers: Player[];
  selectedTab: number;
  btnFlashStates: Record<number, boolean>;
  currentPlayerGameStats: GameStat;
}

export const ScorableFieldItem: FC<ScorableFieldItemProps> = ({
  setMultiBallDialogOpen,
  setMultiBallDeleteDialogOpen,
  handleButtonAnimation,
  field,
  totalRuns,
  idx,
  statValue,
  gamePlayers,
  selectedTab,
  btnFlashStates,
  currentPlayerGameStats,
}) => {
  const { iterateStat } = useIterateStats();
  return (
    <ListItem
      sx={idx === 2 ? { borderTop: "1px solid", pt: 2, mt: 1 } : {}}
      disablePadding
      secondaryAction={
        <ButtonGroup variant="contained" aria-label="Run selection">
          <Button
            size="large"
            onClick={() => {
              if (field.multiBall) {
                if (totalRuns > 1) {
                  setMultiBallDeleteDialogOpen(true);
                  return;
                }
                if (totalRuns === 1) {
                  const stat = findMultiBallStat(currentPlayerGameStats);
                  if (!stat) return;
                  iterateStat({
                    playerId: gamePlayers[selectedTab].id,
                    statKey: stat,
                    delta: -1,
                  });
                  if (gamePlayers.length > 1)
                    sendIterationNotificationMessage(
                      gamePlayers[selectedTab].firstName,
                      stat,
                      -1
                    );
                  handleButtonAnimation(idx);
                  fireAnalyticsEvent("GameMode_Clicked_DecreaseStat", {
                    statKey: stat,
                  });
                }
              } else {
                if (statValue !== 0) {
                  iterateStat({
                    playerId: gamePlayers[selectedTab].id,
                    statKey: field.stat,
                    delta: -1,
                  });
                  if (gamePlayers.length > 1)
                    sendIterationNotificationMessage(
                      gamePlayers[selectedTab].firstName,
                      field.stat,
                      -1
                    );
                  handleButtonAnimation(idx);
                  fireAnalyticsEvent("GameMode_Clicked_DecreaseStat", {
                    statKey: field.stat,
                  });
                }
              }
            }}
          >
            -
          </Button>
          <Button
            sx={{
              pointerEvents: "none",
              backgroundColor: btnFlashStates[idx] ? "white" : "black",
              color: btnFlashStates[idx] ? "black" : "white",
              transition: "background-color 0.3s, color 0.3s",
            }}
            size="large"
          >
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
                handleButtonAnimation(idx);
                if (gamePlayers.length > 1)
                  sendIterationNotificationMessage(
                    gamePlayers[selectedTab].firstName,
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
      <ListItemIcon sx={{ minWidth: "30px" }}>{field.icon}</ListItemIcon>
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
};

const findMultiBallStat = (
  currentPlayerGameStats: GameStat
): GameStatKeys | undefined => {
  const multiballStats = [
    GameStatKeys.threeBallsPocketedInRow,
    GameStatKeys.fourBallsPocketedInRow,
    GameStatKeys.fiveBallsPocketedInRow,
    GameStatKeys.sixBallsPocketedInRow,
    GameStatKeys.sevenBallsPocketedInRow,
    GameStatKeys.runTheTable,
  ];
  return multiballStats.find(
    (stat) =>
      Boolean(currentPlayerGameStats?.[stat]) &&
      (currentPlayerGameStats?.[stat] ?? 0) > 0
  );
};
