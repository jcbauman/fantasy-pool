import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";
import {
  findMultiBallStat,
  sendIterationNotificationMessage,
} from "../hooks/utils";
import { useIterateStats } from "../hooks/useIterateStats";
import { GameStat, GameStatKeys, Player } from "../../../types";
import { ScoringButtonGroup } from "./ScoringButtonGroup";

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
        <ScoringButtonGroup
          onDecrement={() => {
            if (field.multiBall) {
              if (totalRuns > 1) {
                setMultiBallDeleteDialogOpen(true);
                return;
              } else if (totalRuns === 1) {
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
              } else if (totalRuns === 0) {
                setMultiBallDialogOpen(false);
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
          onIncrement={() => {
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
          value={field.multiBall ? totalRuns : statValue}
          highlight={btnFlashStates[idx]}
        />
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
