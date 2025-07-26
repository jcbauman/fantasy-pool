import { Button, ButtonGroup, Collapse, Stack } from "@mui/material";
import { FC } from "react";
import { Close } from "@mui/icons-material";

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
  const buttons = [3, 4, 5, 6, 7, 8];
  return (
    <Collapse in={open} sx={{ width: "100%" }}>
      <Stack
        spacing={2}
        direction="row"
        sx={{ width: "100%", justifyContent: "space-between", my: 2 }}
      >
        <ButtonGroup sx={{ width: "100%" }} size="large" fullWidth>
          {buttons.map((b) => {
            return (
              <Button
                size="large"
                sx={{ flex: 1 }}
                variant="contained"
                onClick={() => {
                  onConfirm(b);
                  onClose();
                }}
              >
                {b}
              </Button>
            );
          })}
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            size="large"
            aria-label="Cancel"
            sx={{ flex: 1 }}
          >
            <Close />
          </Button>
        </ButtonGroup>
      </Stack>
    </Collapse>
  );
};
