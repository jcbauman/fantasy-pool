import { Collapse, IconButton, Slider, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Check, Close } from "@mui/icons-material";

interface MultiBallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (numBalls: number) => void;
}

export const MultiBallCollapse: FC<MultiBallDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [numBalls, setNumBalls] = useState(3);
  const buttons = [3, 4, 5, 6, 7, 8];
  const formatValueLabel = (value: number) => {
    return `${value} balls in-a-row`;
  };
  return (
    <Collapse in={open}>
      <Stack
        spacing={2}
        direction="row"
        sx={{ width: "100%", justifyContent: "space-between", mb: 4, pl: 1 }}
      >
        <Slider
          sx={{ mr: 1 }}
          aria-label="Balls pocketed in-a-row"
          defaultValue={3}
          size="medium"
          marks={buttons.map((v) => {
            return { value: v, label: v.toString() };
          })}
          valueLabelFormat={formatValueLabel}
          valueLabelDisplay="auto"
          shiftStep={1}
          step={1}
          min={3}
          onChange={(_, value) => setNumBalls(value as number)}
          max={8}
        />
        <IconButton
          color="error"
          onClick={onClose}
          size="medium"
          aria-label="Cancel"
        >
          <Close />
        </IconButton>
        <IconButton
          color="success"
          size="medium"
          onClick={() => {
            onConfirm(numBalls);
            onClose();
          }}
          aria-label="Confirm"
        >
          <Check />
        </IconButton>
      </Stack>
      <Collapse
        collapsedSize={0}
        in={numBalls > 6}
        sx={{ justifyContent: "center", width: "100%" }}
      >
        <Typography variant="h4" align="center" fontWeight="bold">
          BRUH{numBalls === 8 ? "!" : ""}
        </Typography>
      </Collapse>
    </Collapse>
  );
};
