import { Button, ButtonGroup } from "@mui/material";
import { FC } from "react";

interface ScoringButtonGroupProps {
  onDecrement: () => void;
  onIncrement: () => void;
  value: number;
  highlight: boolean;
}
export const ScoringButtonGroup: FC<ScoringButtonGroupProps> = ({
  onDecrement,
  onIncrement,
  value,
  highlight,
}) => {
  return (
    <ButtonGroup variant="contained" aria-label="Run selection">
      <Button size="large" onClick={onDecrement}>
        -
      </Button>
      <Button
        sx={{
          pointerEvents: "none",
          backgroundColor: highlight ? "white" : "black",
          color: highlight ? "black" : "white",
          transition: "background-color 0.3s, color 0.3s",
        }}
        size="large"
      >
        {value}
      </Button>
      <Button size="large" onClick={onIncrement}>
        +
      </Button>
    </ButtonGroup>
  );
};
