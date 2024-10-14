import { Button, ButtonGroup } from "@mui/material";
import { FC } from "react";
import { GameStat, GameStatKeys, Player } from "../../../types";
import styled from "@emotion/styled";

interface ButtonGroupIteratorProps {
  field: {
    stat: GameStatKeys;
    primary: string;
    secondary: string;
    icon: JSX.Element;
    multiBall?: boolean;
  };
  setMultiBallDeleteDialogOpen: (open: boolean) => void;
  setMultiBallDialogOpen: (open: boolean) => void;
  currentPlayerGameStats: GameStat;
  selectedTab: number;
  iterateStat: (args: {
    playerId: string;
    statKey: GameStatKeys;
    delta: number;
  }) => void;
  gamePlayers: Player[];
  totalRuns: number;
}

export const ButtonGroupIterator: FC<ButtonGroupIteratorProps> = ({
  setMultiBallDeleteDialogOpen,
  currentPlayerGameStats,
  field,
  selectedTab,
  iterateStat,
  gamePlayers,
  setMultiBallDialogOpen,
  totalRuns,
}) => {
  const StyledButtonGroup = styled(ButtonGroup)({
    outline: "none", // Initial state without outline
    transition: "outline 1s ease", // Fades the outline over 1 second
    "&.active": {
      outline: "4px solid yellow", // Add the yellow outline when active
    },
  });

  const statValue = currentPlayerGameStats[field.stat] ?? 0;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const groupElement = e.currentTarget.parentElement;
    if (groupElement) {
      groupElement.classList.add("active");
      setTimeout(() => {
        groupElement.classList.remove("active"); // Remove the class after 1 second to fade the outline
      }, 1000); // Duration matches the transition time
    }
  };

  return (
    <StyledButtonGroup
      variant="contained"
      aria-label="Iterate stat button group"
    >
      <Button
        onClick={(e) => {
          if (field.multiBall) {
            setMultiBallDeleteDialogOpen(true);
          } else {
            if (statValue !== 0) {
              iterateStat({
                playerId: gamePlayers[selectedTab]?.id,
                statKey: field.stat,
                delta: -1,
              });
            }
          }
          handleClick(e);
        }}
      >
        -
      </Button>
      <Button sx={{ pointerEvents: "none" }}>
        {field.multiBall ? totalRuns : statValue}
      </Button>
      <Button
        onClick={(e) => {
          if (field.multiBall) {
            setMultiBallDialogOpen(true);
          } else {
            iterateStat({
              playerId: gamePlayers[selectedTab]?.id,
              statKey: field.stat,
              delta: 1,
            });
          }
          handleClick(e);
        }}
      >
        +
      </Button>
    </StyledButtonGroup>
  );
};
