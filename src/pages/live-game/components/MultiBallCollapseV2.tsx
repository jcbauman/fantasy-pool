import { Button, Collapse, IconButton, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Check, Close } from "@mui/icons-material";
import { ScoringButtonGroup } from "./ScoringButtonGroup";

interface MultiBallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (numBalls: number) => void;
}

export const MultiBallCollapseV2: FC<MultiBallDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [numBalls, setNumBalls] = useState(3);
  const [highlight, setHighlight] = useState(false);

  const handleButtonAnimation = () => {
    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, 300);
  };

  useEffect(() => {
    if (open) setNumBalls(3);
  }, [open]);

  return (
    <Collapse in={open} sx={{ width: "100%" }}>
      <Stack
        spacing={1}
        direction="row"
        sx={{ width: "100%", justifyContent: "flex-end", my: 2 }}
      >
        <IconButton size="large" onClick={onClose} aria-label="Cancel">
          <Close />
        </IconButton>
        <ScoringButtonGroup
          value={`${numBalls}PR`}
          onDecrement={() => {
            if (numBalls > 3) {
              setNumBalls(numBalls - 1);
              handleButtonAnimation();
            }
          }}
          onIncrement={() => {
            if (numBalls < 8) {
              setNumBalls(numBalls + 1);
              handleButtonAnimation();
            }
          }}
          highlight={highlight}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            onConfirm(numBalls);
            onClose();
          }}
          size="large"
          aria-label="Submit"
        >
          <Check />
        </Button>
      </Stack>
    </Collapse>
  );
};
